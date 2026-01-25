#!/bin/bash
set -e

echo "╔══════════════════════════════════════════════════╗"
echo "║   URL Shortener - Docker Deployment              ║"
echo "╚══════════════════════════════════════════════════╝"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Check .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo ""
    echo "Create it:"
    echo "  cp .env.prod.example .env"
    echo "  nano .env"
    exit 1
fi

# Check required variables
for var in DOMAIN POSTGRES_PASSWORD; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=$" .env; then
        echo "❌ ${var} not set in .env"
        exit 1
    fi
done

# Check password is not default
if grep -q "CHANGE_THIS" .env; then
    echo "❌ Update placeholder values in .env"
    exit 1
fi

echo -e "\n📦 Building images..."
docker compose -f docker-compose.prod.yml build

echo -e "\n🗄️  Running migrations..."
docker compose -f docker-compose.prod.yml run --rm migrate

echo -e "\n🚀 Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo -e "\n⏳ Waiting for services..."
sleep 5

echo -e "\n✅ Docker services running!"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "Commands:"
echo "  Logs:    docker compose -f docker-compose.prod.yml logs -f"
echo "  Stop:    docker compose -f docker-compose.prod.yml down"
echo "  Restart: docker compose -f docker-compose.prod.yml restart"
