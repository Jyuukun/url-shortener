import uuid
from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(UTC)


class URL(SQLModel, table=True):
    __tablename__ = "urls"  # type: ignore[misc]

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    original_url: str = Field(index=True, max_length=2048)
    short_code: str = Field(unique=True, index=True, max_length=40)
    is_custom: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utcnow, index=True)
