# URL Shortener

A URL shortener service that turns long links into shorter ones with working redirection.

## Features

- Shorten any valid URL to a compact 6-character code
- Custom aliases support (e.g., `my-link` instead of `abc123`)
- Instant 307 redirects
- Rate limiting protection
- Interactive API documentation

## Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Docker | 24+ |
| Node.js | 18+ |
| Python | 3.12+ |
| [uv](https://docs.astral.sh/uv/) | 0.5+ |

### Setup

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and set POSTGRES_PASSWORD

# 2. Start database
docker compose up -d

# 3. Start backend
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload

# 4. Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Running Tests

```bash
# Backend
cd backend && uv run pytest -v

# Frontend
cd frontend && npm test
```

---

## Project Structure

```
├── backend/          # FastAPI + PostgreSQL
│   ├── app/          # API, models, services
│   └── tests/        # pytest tests
├── frontend/         # React 19 + TypeScript + Vite
│   └── src/          # Components, actions, services
└── docker-compose.yml
```

---

## Technical Choices

| Technology | Rationale |
|------------|-----------|
| **FastAPI** | Async support, auto-generated OpenAPI docs, excellent type hints |
| **React 19** | `useActionState` for simpler form handling, automatic pending states |
| **PostgreSQL** | Production-ready from day one, same DB in all environments |
| **Base62 codes** | 56 billion combinations with 6 characters (a-z, A-Z, 0-9) |
| **307 redirects** | Preserves HTTP method, respects `Cache-Control` headers (vs 301 cached indefinitely) |
| **Emotion CSS** | Scoped styles, no class conflicts, colocation with components |

