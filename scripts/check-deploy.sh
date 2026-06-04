#!/bin/sh
set -eu

BASE_URL="${BASE_URL:-http://127.0.0.1:8888}"
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/docker-compose.yml}"
DB_NAME="${DB_NAME:-guisu}"
DB_USER="${DB_USER:-root}"

echo "Checking backend health"
curl -fsS "$BASE_URL/health" >/dev/null

echo "Checking database health endpoint"
curl -fsS "$BASE_URL/health/db" >/dev/null

if [ -n "${DB_PASSWORD:-}" ]; then
  echo "Checking required database tables"
  docker compose -f "$COMPOSE_FILE" exec -T mysql \
    mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e \
    "show tables; select count(*) rubbish_count from rubbish; select count(*) category_count from category;"
else
  echo "Skipping direct database check because DB_PASSWORD is not set"
fi

echo "Checking rubbish list API"
curl -fsS "$BASE_URL/rubbish/list?rubbishType=%E5%B9%B2%E5%9E%83%E5%9C%BE&page=0&pageSize=1" >/dev/null

echo "Deployment check completed"
