"""Models package — SQLAlchemy ORM models.

Exposes all models for import and discovery by Alembic's target_metadata.
"""

from app.models.role import Role
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage

__all__ = [
    "Role",
    "User",
    "Category",
    "Product",
    "ProductImage",
]
