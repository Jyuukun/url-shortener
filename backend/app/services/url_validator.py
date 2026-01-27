from urllib.parse import urlparse

import validators

SUSPICIOUS_PATTERNS = frozenset(
    {
        "login",
        "signin",
        "password",
        "credential",
        "phishing",
        "malware",
    }
)


class URLValidationError(Exception):
    pass


def validate_url_safety(url: str, own_domain: str | None = None) -> None:
    """Validate URL for safety against open redirect and phishing attacks."""
    if not validators.url(url, simple_host=True):
        raise URLValidationError("Invalid URL format")

    parsed = urlparse(url)
    scheme = (parsed.scheme or "").lower()

    if scheme not in ("http", "https"):
        raise URLValidationError(f"Only http and https URLs are allowed, got '{scheme}'")

    if own_domain and parsed.netloc.lower() == own_domain.lower():
        raise URLValidationError("Cannot shorten URLs from this service")

    path_lower = parsed.path.lower()
    for pattern in SUSPICIOUS_PATTERNS:
        if pattern in path_lower:
            raise URLValidationError(
                "URL contains suspicious pattern. Please verify this is a legitimate destination."
            )
