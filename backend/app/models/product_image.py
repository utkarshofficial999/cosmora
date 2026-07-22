from __future__ import annotations
import uuid
from sqlalchemy import String, Boolean, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.product import Product


class ProductImage(Base):
    """ProductImage model representing images associated with a product."""

    __tablename__ = "product_images"

    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )
    url: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )
    alt_text: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Relationships
    product: Mapped[Product] = relationship(
        "Product",
        back_populates="images",
    )

    def __repr__(self) -> str:
        return f"<ProductImage(id={self.id}, url={self.url})>"
