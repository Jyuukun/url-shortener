RESERVED_WORDS = frozenset(
    {
        # API & Documentation
        "api",
        "docs",
        "redoc",
        "openapi",
        "graphql",
        # Admin & Dashboard
        "admin",
        "dashboard",
        "analytics",
        "stats",
        "links",
        # Authentication
        "login",
        "logout",
        "signin",
        "signout",
        "signup",
        "register",
        "auth",
        "oauth",
        "sso",
        # User
        "account",
        "settings",
        "profile",
        "user",
        "users",
        "me",
        # Legal & Info pages
        "about",
        "contact",
        "help",
        "support",
        "terms",
        "privacy",
        "pricing",
        "legal",
        # Actions
        "new",
        "create",
        "edit",
        "delete",
        "shorten",
        # Technical
        "health",
        "status",
        "ping",
        "static",
        "assets",
        "favicon",
        "www",
        "app",
        "cdn",
        "mail",
        "email",
        "ftp",
        # Common short paths
        "go",
        "link",
        "url",
        "r",
        "s",
        "l",
    }
)


class AliasValidationError(Exception):
    pass


def validate_custom_alias(alias: str) -> None:
    """Validate custom alias is not a reserved word."""
    if alias.lower() in RESERVED_WORDS:
        raise AliasValidationError(f"'{alias}' is a reserved word and cannot be used as an alias")
