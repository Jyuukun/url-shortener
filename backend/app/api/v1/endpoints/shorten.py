from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlmodel import Session, select

from app.core.config import settings
from app.core.database import get_session
from app.models.url import URL
from app.schemas.url import ShortenRequest, ShortenResponse
from app.services.alias_validator import AliasValidationError, validate_custom_alias
from app.services.shortener import generate_short_code
from app.services.url_validator import URLValidationError, validate_url_safety

router = APIRouter()
limiter = Limiter(key_func=get_remote_address, enabled=settings.rate_limit_enabled)

OWN_DOMAIN = urlparse(settings.base_url).netloc

MAX_COLLISION_RETRIES = 10


def _get_short_code(request: ShortenRequest, session: Session) -> tuple[str, bool]:
    if request.custom_alias:
        try:
            validate_custom_alias(request.custom_alias)
        except AliasValidationError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

        if session.exec(select(URL).where(URL.short_code == request.custom_alias)).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Custom alias '{request.custom_alias}' is already taken",
            )
        return request.custom_alias, True

    for _ in range(MAX_COLLISION_RETRIES):
        short_code = generate_short_code()
        if not session.exec(select(URL).where(URL.short_code == short_code)).first():
            return short_code, False

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to generate unique short code",
    )


@router.post("/shorten", response_model=ShortenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def shorten_url(
    request: Request,
    payload: ShortenRequest,
    session: Session = Depends(get_session),
) -> ShortenResponse:
    try:
        validate_url_safety(str(payload.url), own_domain=OWN_DOMAIN)
    except URLValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

    short_code, is_custom = _get_short_code(payload, session)

    url_entry = URL(original_url=str(payload.url), short_code=short_code, is_custom=is_custom)
    session.add(url_entry)
    session.commit()

    return ShortenResponse(
        short_url=f"{settings.base_url}/{short_code}",
        short_code=short_code,
        original_url=url_entry.original_url,
        is_custom=is_custom,
    )
