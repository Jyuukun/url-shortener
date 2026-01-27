import pytest

from app.services.alias_validator import AliasValidationError, validate_custom_alias
from app.services.shortener import generate_short_code
from app.services.url_validator import URLValidationError, validate_url_safety


class TestShortener:
    def test_generate_short_code_returns_string(self):
        code = generate_short_code()
        assert isinstance(code, str)

    def test_generate_short_code_default_length(self):
        code = generate_short_code()
        assert len(code) == 6

    def test_generate_short_code_custom_length(self):
        code = generate_short_code(length=10)
        assert len(code) == 10

    def test_generate_short_code_is_base62(self):
        code = generate_short_code()
        allowed_chars = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
        assert all(c in allowed_chars for c in code)

    def test_generate_short_code_is_random(self):
        codes = {generate_short_code() for _ in range(100)}
        assert len(codes) == 100


class TestAliasValidator:
    """Tests for reserved word validation only.

    Note: Length and pattern validation is handled by Pydantic schema
    and tested in test_api.py (test_shorten_alias_too_short, test_shorten_alias_invalid_chars).
    """

    def test_validate_custom_alias_valid(self):
        validate_custom_alias("my-link")

    def test_validate_custom_alias_valid_with_underscore(self):
        validate_custom_alias("my_link")

    def test_validate_custom_alias_valid_with_numbers(self):
        validate_custom_alias("link123")

    def test_validate_custom_alias_reserved_word_api(self):
        with pytest.raises(AliasValidationError) as exc:
            validate_custom_alias("api")
        assert "reserved" in str(exc.value).lower()

    def test_validate_custom_alias_reserved_word_admin(self):
        with pytest.raises(AliasValidationError) as exc:
            validate_custom_alias("admin")
        assert "reserved" in str(exc.value).lower()

    def test_validate_custom_alias_reserved_word_login(self):
        with pytest.raises(AliasValidationError) as exc:
            validate_custom_alias("login")
        assert "reserved" in str(exc.value).lower()

    def test_validate_custom_alias_reserved_word_health(self):
        with pytest.raises(AliasValidationError) as exc:
            validate_custom_alias("health")
        assert "reserved" in str(exc.value).lower()

    def test_validate_custom_alias_reserved_word_docs(self):
        with pytest.raises(AliasValidationError) as exc:
            validate_custom_alias("docs")
        assert "reserved" in str(exc.value).lower()

    def test_validate_custom_alias_case_insensitive_reserved(self):
        with pytest.raises(AliasValidationError) as exc:
            validate_custom_alias("LOGIN")
        assert "reserved" in str(exc.value).lower()


class TestURLValidator:
    def test_validate_url_safety_valid_https(self):
        validate_url_safety("https://example.com/page")

    def test_validate_url_safety_valid_http(self):
        validate_url_safety("http://example.com/page")

    def test_validate_url_safety_blocks_javascript_scheme(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("javascript:alert(1)")
        assert "invalid" in str(exc.value).lower()

    def test_validate_url_safety_blocks_data_scheme(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("data:text/html,<script>alert(1)</script>")
        assert "invalid" in str(exc.value).lower()

    def test_validate_url_safety_blocks_file_scheme(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("file:///etc/passwd")
        assert "invalid" in str(exc.value).lower()

    def test_validate_url_safety_requires_hostname(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("https:///path/only")
        assert "invalid" in str(exc.value).lower()

    def test_validate_url_safety_blocks_ftp_scheme(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("ftp://example.com/file")
        assert "http" in str(exc.value).lower()

    def test_validate_url_safety_warns_suspicious_login_path(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("https://evil.com/fake-login")
        assert "suspicious" in str(exc.value).lower()

    def test_validate_url_safety_warns_suspicious_password_path(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("https://evil.com/steal-password")
        assert "suspicious" in str(exc.value).lower()

    def test_validate_url_safety_blocks_own_domain(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("http://localhost:8000/abc123", own_domain="localhost:8000")
        assert "cannot shorten" in str(exc.value).lower()

    def test_validate_url_safety_blocks_own_domain_case_insensitive(self):
        with pytest.raises(URLValidationError) as exc:
            validate_url_safety("http://LOCALHOST:8000/abc123", own_domain="localhost:8000")
        assert "cannot shorten" in str(exc.value).lower()

    def test_validate_url_safety_allows_different_domain(self):
        validate_url_safety("https://example.com/page", own_domain="localhost:8000")
