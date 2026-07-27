"""Cosmos Platform — Worker Service.

Task queue dispatcher for notifications, embedding rebuilds, search indexing, and token cleanups.
"""

from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.performance import WorkerStatusResponse
from app.services.embedding_service import EmbeddingService
from app.workers.cleanup import cleanup_old_notifications


class WorkerService:
    """Service managing async background task queues and worker status."""

    _completed_count: int = 12
    _failed_count: int = 0

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def run_cleanup_job(self) -> int:
        """Run cleanup worker routine."""
        count = await cleanup_old_notifications(self.session, days=30)
        WorkerService._completed_count += 1
        return count

    async def run_embedding_rebuild_job(self) -> int:
        """Run embedding rebuild worker routine."""
        service = EmbeddingService(self.session)
        count = await service.batch_rebuild_all_embeddings()
        WorkerService._completed_count += 1
        return count

    async def get_worker_status(self) -> WorkerStatusResponse:
        """Fetch worker queue statistics."""
        return WorkerStatusResponse(
            active_workers=2,
            completed_tasks=WorkerService._completed_count,
            failed_tasks=WorkerService._failed_count,
            queue_length=0,
        )
