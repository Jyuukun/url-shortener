# Deployment Guide - URL Shortener

Docker Compose with Caddy reverse proxy (label-based routing, no config file).

## Deployment Modes

| Mode | Caddy Ports | SSL | Use Case |
|------|-------------|-----|----------|
| **Standalone** | 80/443 | Auto (Let's Encrypt) | New servers |
| **Behind Apache** | 8080/8443 | Apache handles | Existing servers |

## Requirements

- Docker & Docker Compose
- Domain pointing to server
- (Standalone) Ports 80/443 available
- (Behind Apache) Apache with mod_proxy

---

## Quick Deploy

```bash
git clone <repo> /opt/url-shortener
cd /opt/url-shortener

cp .env.prod.example .env
nano .env  # Set DOMAIN, POSTGRES_PASSWORD, CADDY ports

./deploy/docker-deploy.sh
```

---

## Configuration

### Standalone Mode (Auto-SSL)

```bash
# .env
DOMAIN=s.example.com
POSTGRES_PASSWORD=your_secure_password
CADDY_HTTP_PORT=80
CADDY_HTTPS_PORT=443
```

Caddy handles SSL automatically via Let's Encrypt.

### Behind Apache Mode

```bash
# .env
DOMAIN=s.example.com
POSTGRES_PASSWORD=your_secure_password
CADDY_HTTP_PORT=8080
CADDY_HTTPS_PORT=8443
CADDY_SCHEME=http
```

Apache config (add to existing vhost):

```apache
<VirtualHost *:443>
    ServerName s.example.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/

    RequestHeader set X-Forwarded-Proto "https"
</VirtualHost>
```

---

## Daily Operations

### Update

```bash
cd /opt/url-shortener
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Commands

```bash
# Logs
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs caddy

# Restart
docker compose -f docker-compose.prod.yml restart

# Stop
docker compose -f docker-compose.prod.yml down

# Database shell
docker compose -f docker-compose.prod.yml exec db psql -U urlshortener
```

### Rollback

```bash
docker compose -f docker-compose.prod.yml down
git checkout <previous-commit>
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Architecture

### Standalone Mode
```
Internet
    |
    v
+-------+
| Caddy | <- SSL + routing (ports 80/443)
+-------+
    |
    +-- /api/* ---------> Backend (FastAPI)
    |                          |
    +-- /{short_code} --->     v
    |                     +----------+
    |                     | Postgres |
    |                     +----------+
    |
    +-- /* -------------> Frontend (Nginx)
```

### Behind Apache Mode
```
Internet
    |
    v
+---------+
| Apache  | <- SSL termination (port 443)
+---------+
    |
    v
+-------+
| Caddy | <- Routing only (port 8080)
+-------+
    |
    +-- /api/* ---------> Backend (FastAPI)
    |                          |
    +-- /{short_code} --->     v
    |                     +----------+
    |                     | Postgres |
    |                     +----------+
    |
    +-- /* -------------> Frontend (Nginx)
```

## Configuration Reference

| Variable | Description |
|----------|-------------|
| `DOMAIN` | Your domain (e.g., `s.example.com`) |
| `POSTGRES_PASSWORD` | Database password (avoid special URL chars: `@ : / # ? &`) |
| `CADDY_HTTP_PORT` | HTTP port (default: 80, use 8080 behind Apache) |
| `CADDY_HTTPS_PORT` | HTTPS port (default: 443, use 8443 behind Apache) |
| `CADDY_SCHEME` | `https` (default, auto-SSL) or `http` (behind Apache) |

## Verification

```bash
# Check Caddy discovered services
docker compose -f docker-compose.prod.yml logs caddy
```
