# Final Disposal Node

Koa API service for the HomeToReturn rubbish classification app.

## Environment

Copy `.env.example` to `.env` for local use, or provide the same values through Docker Compose.

Required production variables:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `CORS_ORIGIN`

The compose file in the parent directory also requires `MYSQL_ROOT_PASSWORD` and `DB_PASSWORD`.

## Database Initialization

MySQL only runs files in `/docker-entrypoint-initdb.d` when its data directory is empty. If the Docker volume already exists, import the SQL files manually:

```sh
DB_PASSWORD=your_password pnpm db:init
```

This imports the SQL files from `../sql` in the required order.

## Deployment Checks

After deploying, run:

```sh
BASE_URL=http://127.0.0.1:8888 DB_PASSWORD=your_password pnpm deploy:check
```

When checking through the public reverse proxy, set `BASE_URL` to the API prefix, for example:

```sh
BASE_URL=https://zhouzixuan.me/api DB_PASSWORD=your_password pnpm deploy:check
```

Useful endpoints:

- `/health` checks the Node service.
- `/health/db` checks database connectivity.
