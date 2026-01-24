import secrets
import string

from app.core.config import settings

BASE62_CHARS = string.ascii_letters + string.digits


def generate_short_code(length: int | None = None) -> str:
    if length is None:
        length = settings.short_code_length
    return "".join(secrets.choice(BASE62_CHARS) for _ in range(length))
