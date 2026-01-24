from pydantic import BaseModel, Field, HttpUrl


class ShortenRequest(BaseModel):
    url: HttpUrl = Field(..., max_length=2048)
    custom_alias: str | None = Field(
        default=None,
        min_length=3,
        max_length=40,
        pattern=r"^[a-zA-Z0-9_-]+$",
    )


class ShortenResponse(BaseModel):
    short_url: str
    short_code: str
    original_url: str
    is_custom: bool
