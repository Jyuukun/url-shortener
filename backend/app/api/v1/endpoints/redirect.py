from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse, Response
from sqlmodel import Session, select

from app.core.database import get_session
from app.models.url import URL

router = APIRouter()

RESERVED_PATHS = {"favicon.ico", "sitemap.xml"}


@router.get("/robots.txt")
def robots_txt() -> Response:
    content = "User-agent: *\nDisallow: /\n"
    return Response(content=content, media_type="text/plain")


@router.get("/{short_code}")
def redirect_to_url(
    short_code: str,
    session: Session = Depends(get_session),
) -> RedirectResponse:
    if short_code in RESERVED_PATHS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    url_entry = session.exec(select(URL).where(URL.short_code == short_code)).first()
    if not url_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Short URL not found")

    return RedirectResponse(
        url=url_entry.original_url,
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        headers={"Cache-Control": "public, max-age=3600"},
    )
