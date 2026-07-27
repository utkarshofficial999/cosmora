"""Cosmos Platform — Domain Exceptions for Space Modules.

Provides domain-specific exceptions for Eras, Timeline Events, Planets, Moons, Facts, Agencies, Missions, Stories, Search, Bookmarks, Collections, Notifications, AI RAG, and Admin CMS.
"""

from fastapi import status
from app.exceptions.auth import AuthBaseException


class AppDomainException(AuthBaseException):
    """Base exception for domain logic errors."""

    def __init__(
        self,
        detail: str = "Domain processing error",
        status_code: int = status.HTTP_400_BAD_REQUEST,
    ) -> None:
        super().__init__(detail=detail, status_code=status_code)


class EraNotFoundError(AppDomainException):
    """Raised when an Era is not found."""

    def __init__(self, detail: str = "Era not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class TimelineEventNotFoundError(AppDomainException):
    """Raised when a Timeline Event is not found."""

    def __init__(self, detail: str = "Timeline event not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class PlanetNotFoundError(AppDomainException):
    """Raised when a Planet is not found."""

    def __init__(self, detail: str = "Planet not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class MoonNotFoundError(AppDomainException):
    """Raised when a Moon is not found."""

    def __init__(self, detail: str = "Moon not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class PlanetFactNotFoundError(AppDomainException):
    """Raised when a PlanetFact is not found."""

    def __init__(self, detail: str = "Planet fact not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class AgencyNotFoundError(AppDomainException):
    """Raised when a SpaceAgency is not found."""

    def __init__(self, detail: str = "Space agency not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class MissionNotFoundError(AppDomainException):
    """Raised when a Mission is not found."""

    def __init__(self, detail: str = "Mission not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class MilestoneNotFoundError(AppDomainException):
    """Raised when a MissionMilestone is not found."""

    def __init__(self, detail: str = "Milestone not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class MissionMediaNotFoundError(AppDomainException):
    """Raised when MissionMedia is not found."""

    def __init__(self, detail: str = "Mission media not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class StoryNotFoundError(AppDomainException):
    """Raised when a Story is not found."""

    def __init__(self, detail: str = "Story not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class ChapterNotFoundError(AppDomainException):
    """Raised when a StoryChapter is not found."""

    def __init__(self, detail: str = "Story chapter not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class CategoryNotFoundError(AppDomainException):
    """Raised when a StoryCategory is not found."""

    def __init__(self, detail: str = "Story category not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class TagNotFoundError(AppDomainException):
    """Raised when a StoryTag is not found."""

    def __init__(self, detail: str = "Story tag not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class ReadingProgressNotFoundError(AppDomainException):
    """Raised when reading progress record is not found."""

    def __init__(self, detail: str = "Reading progress record not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class BookmarkNotFoundError(AppDomainException):
    """Raised when a Bookmark is not found."""

    def __init__(self, detail: str = "Bookmark not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class CollectionNotFoundError(AppDomainException):
    """Raised when a Collection is not found."""

    def __init__(self, detail: str = "Collection not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class CollectionItemNotFoundError(AppDomainException):
    """Raised when a CollectionItem is not found."""

    def __init__(self, detail: str = "Collection item not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class NotificationNotFoundError(AppDomainException):
    """Raised when a Notification is not found."""

    def __init__(self, detail: str = "Notification not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class PreferenceNotFoundError(AppDomainException):
    """Raised when NotificationPreference is not found."""

    def __init__(self, detail: str = "Notification preference not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class ScheduledNotificationNotFoundError(AppDomainException):
    """Raised when a ScheduledNotification is not found."""

    def __init__(self, detail: str = "Scheduled notification not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class ConversationNotFoundError(AppDomainException):
    """Raised when an AIConversation is not found."""

    def __init__(self, detail: str = "AI conversation not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class MessageNotFoundError(AppDomainException):
    """Raised when an AIMessage is not found."""

    def __init__(self, detail: str = "AI message not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class EmbeddingDocumentNotFoundError(AppDomainException):
    """Raised when an EmbeddingDocument is not found."""

    def __init__(self, detail: str = "Embedding document not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class AuditLogNotFoundError(AppDomainException):
    """Raised when an AdminAuditLog is not found."""

    def __init__(self, detail: str = "Admin audit log entry not found") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class DuplicateBookmarkError(AppDomainException):
    """Raised when bookmarking an already bookmarked resource."""

    def __init__(self, detail: str = "Resource is already bookmarked") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)


class DuplicateSlugError(AppDomainException):
    """Raised when a resource slug already exists."""

    def __init__(self, detail: str = "Resource with this slug already exists") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)


class DuplicateNameError(AppDomainException):
    """Raised when a resource name already exists."""

    def __init__(self, detail: str = "Resource with this name already exists") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)


class InvalidEraError(AppDomainException):
    """Raised when an invalid era ID or slug is supplied."""

    def __init__(self, detail: str = "Specified Era does not exist or is invalid") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_400_BAD_REQUEST)


class ValidationError(AppDomainException):
    """Raised when domain validation rules are violated."""

    def __init__(self, detail: str = "Validation failed") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
