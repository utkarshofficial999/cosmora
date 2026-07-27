"""Cosmos Platform — Background Worker Tests.

Tests for background task worker execution and queue status.
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.worker_service import WorkerService


@pytest.mark.anyio
async def test_worker_task_dispatch(db_session: AsyncSession) -> None:
    """Test WorkerService task execution and worker status response."""
    worker = WorkerService(db_session)

    # 1. Run notification cleanup job
    cleaned = await worker.run_cleanup_job()
    assert isinstance(cleaned, int)

    # 2. Get status
    status_resp = await worker.get_worker_status()
    assert status_resp.active_workers >= 1
    assert status_resp.completed_tasks >= 1
