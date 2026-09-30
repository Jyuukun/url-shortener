# syntax=docker/dockerfile:1

# Build stage: resolve the venv
FROM python:3.12-slim AS build

COPY --from=ghcr.io/astral-sh/uv:0.12.20 /uv /usr/local/bin/uv

# The cache mount and /app live on different filesystems, so hard links are impossible.
ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=0

WORKDIR /app

# Dependencies only: the code is imported from /app, so the project itself is not installed.
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-dev --no-install-project

# Runtime stage: venv + code, no uv
FROM python:3.12-slim

RUN useradd -m appuser

WORKDIR /app

ENV PATH=/app/.venv/bin:$PATH

# Code stays root-owned: the app never writes to disk.
COPY --from=build /app/.venv ./.venv
COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
