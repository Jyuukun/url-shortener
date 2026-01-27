import string

from shortuuid import ShortUUID

from app.core.config import settings

BASE62_CHARS = string.ascii_letters + string.digits
_su = ShortUUID(alphabet=BASE62_CHARS)


def generate_short_code(length: int | None = None) -> str:
    if length is None:
        length = settings.short_code_length
    return _su.random(length)
