"""Models package — SQLAlchemy ORM models.

Exposes all models for import and discovery by Alembic's target_metadata.
"""

from app.models.role import Role
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.era import Era
from app.models.timeline import TimelineEvent
from app.models.event_media import EventMedia
from app.models.planet import Planet
from app.models.moon import Moon
from app.models.planet_fact import PlanetFact
from app.models.agency import SpaceAgency
from app.models.mission import Mission
from app.models.milestone import MissionMilestone
from app.models.mission_media import MissionMedia
from app.models.story_category import StoryCategory
from app.models.story_tag import StoryTag, story_tag_association
from app.models.story import Story
from app.models.chapter import StoryChapter
from app.models.reading_progress import StoryProgress
from app.models.search_history import SearchHistory
from app.models.bookmark import Bookmark
from app.models.user_activity import UserActivity
from app.models.collection import Collection, CollectionItem
from app.models.notification import Notification
from app.models.notification_preference import NotificationPreference
from app.models.scheduled_notification import ScheduledNotification
from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage
from app.models.embedding_document import EmbeddingDocument
from app.models.admin_audit_log import AdminAuditLog
from app.models.analytics_event import AnalyticsEvent
from app.models.daily_analytics import DailyAnalytics
from app.models.content_analytics import ContentAnalytics

__all__ = [
    "Role",
    "User",
    "Category",
    "Product",
    "ProductImage",
    "Era",
    "TimelineEvent",
    "EventMedia",
    "Planet",
    "Moon",
    "PlanetFact",
    "SpaceAgency",
    "Mission",
    "MissionMilestone",
    "MissionMedia",
    "StoryCategory",
    "StoryTag",
    "story_tag_association",
    "Story",
    "StoryChapter",
    "StoryProgress",
    "SearchHistory",
    "Bookmark",
    "UserActivity",
    "Collection",
    "CollectionItem",
    "Notification",
    "NotificationPreference",
    "ScheduledNotification",
    "AIConversation",
    "AIMessage",
    "EmbeddingDocument",
    "AdminAuditLog",
    "AnalyticsEvent",
    "DailyAnalytics",
    "ContentAnalytics",
]
