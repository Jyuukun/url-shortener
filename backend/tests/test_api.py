from fastapi.testclient import TestClient


class TestShortenEndpoint:
    def test_shorten_valid_url(self, client: TestClient):
        response = client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com/long/path"},
        )
        assert response.status_code == 201
        data = response.json()
        assert "short_url" in data
        assert "short_code" in data
        assert data["original_url"] == "https://example.com/long/path"
        assert data["is_custom"] is False
        assert len(data["short_code"]) == 6

    def test_shorten_with_custom_alias(self, client: TestClient):
        response = client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com", "custom_alias": "my-link"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["short_code"] == "my-link"
        assert data["is_custom"] is True
        assert "my-link" in data["short_url"]

    def test_shorten_duplicate_alias_returns_409(self, client: TestClient):
        client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com", "custom_alias": "taken"},
        )
        response = client.post(
            "/api/v1/shorten",
            json={"url": "https://other.com", "custom_alias": "taken"},
        )
        assert response.status_code == 409
        assert "already taken" in response.json()["detail"]

    def test_shorten_invalid_url(self, client: TestClient):
        response = client.post(
            "/api/v1/shorten",
            json={"url": "not-a-valid-url"},
        )
        assert response.status_code == 422

    def test_shorten_reserved_alias(self, client: TestClient):
        response = client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com", "custom_alias": "api"},
        )
        assert response.status_code == 400
        assert "reserved" in response.json()["detail"].lower()

    def test_shorten_alias_too_short(self, client: TestClient):
        response = client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com", "custom_alias": "ab"},
        )
        assert response.status_code == 422

    def test_shorten_alias_invalid_chars(self, client: TestClient):
        response = client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com", "custom_alias": "my link!"},
        )
        assert response.status_code == 422

    def test_shorten_own_domain_blocked(self, client: TestClient):
        response = client.post(
            "/api/v1/shorten",
            json={"url": "http://localhost:8000/abc123"},
        )
        assert response.status_code == 400
        assert "cannot shorten" in response.json()["detail"].lower()


class TestRedirectEndpoint:
    def test_redirect_valid_code(self, client: TestClient):
        create_response = client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com/redirect-test"},
        )
        short_code = create_response.json()["short_code"]

        response = client.get(f"/{short_code}", follow_redirects=False)
        assert response.status_code == 307
        assert response.headers["location"] == "https://example.com/redirect-test"

    def test_redirect_custom_alias(self, client: TestClient):
        client.post(
            "/api/v1/shorten",
            json={"url": "https://example.com/custom", "custom_alias": "custom-test"},
        )

        response = client.get("/custom-test", follow_redirects=False)
        assert response.status_code == 307
        assert response.headers["location"] == "https://example.com/custom"

    def test_redirect_not_found(self, client: TestClient):
        response = client.get("/nonexistent", follow_redirects=False)
        assert response.status_code == 404

    def test_redirect_reserved_path_favicon(self, client: TestClient):
        response = client.get("/favicon.ico", follow_redirects=False)
        assert response.status_code == 404

    def test_robots_txt_endpoint(self, client: TestClient):
        response = client.get("/robots.txt", follow_redirects=False)
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/plain; charset=utf-8"
        assert "User-agent: *" in response.text
        assert "Disallow: /" in response.text

    def test_redirect_reserved_path_sitemap(self, client: TestClient):
        response = client.get("/sitemap.xml", follow_redirects=False)
        assert response.status_code == 404
