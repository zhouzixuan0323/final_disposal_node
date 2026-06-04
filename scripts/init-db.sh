#!/bin/sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/docker-compose.yml}"
DB_NAME="${DB_NAME:-guisu}"
DB_USER="${DB_USER:-root}"

if [ -z "${DB_PASSWORD:-}" ]; then
  echo "DB_PASSWORD is required"
  exit 1
fi

for file in \
  createTable.sql \
  category.sql \
  garbagedisposal.sql \
  question.sql \
  rubbish.sql \
  users.sql \
  ranking.sql
do
  echo "Importing $file"
  docker compose -f "$COMPOSE_FILE" exec -T mysql \
    mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$ROOT_DIR/sql/$file"
done

echo "Database import completed"
