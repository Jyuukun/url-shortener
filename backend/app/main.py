from typing import cast

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from secure import (
    ContentSecurityPolicy,
    PermissionsPolicy,
    ReferrerPolicy,
    Secure,
    StrictTransportSecurity,
    XContentTypeOptions,
    XFrameOptions,
)
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.types import ExceptionHandler

from app.api.v1.endpoints import redirect, shorten
from app.api.v1.endpoints.shorten import limiter
from app.core.config import settings

app = FastAPI(
    title="URL Shortener",
    description="A simple URL shortener API",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, cast(ExceptionHandler, _rate_limit_exceeded_handler))

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

secure_headers = Secure(
    csp=ContentSecurityPolicy()
    .default_src("'self'")
    .script_src("'self'")
    .style_src("'self'", "'unsafe-inline'")
    .img_src("'self'", "data:")
    .connect_src("'self'"),
    permissions=PermissionsPolicy().geolocation().microphone().camera(),
    referrer=ReferrerPolicy().strict_origin_when_cross_origin(),
    xfo=XFrameOptions().deny(),
    xcto=XContentTypeOptions(),
    hsts=StrictTransportSecurity() if settings.environment == "production" else None,
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next) -> Response:
    response = await call_next(request)
    secure_headers.set_headers(response)
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


app.include_router(shorten.router, prefix="/api/v1", tags=["shorten"])
app.include_router(redirect.router, tags=["redirect"])
