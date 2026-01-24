from functools import lru_cache

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings


@lru_cache
def get_engine():
    db_url = settings.database_url
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
    return create_engine(
        db_url,
        echo=settings.environment == "development",
        pool_size=20,
        max_overflow=10,
        pool_recycle=3600,
        pool_pre_ping=True,
    )


def init_db() -> None:
    SQLModel.metadata.create_all(get_engine())


def get_session():
    with Session(get_engine()) as session:
        yield session
