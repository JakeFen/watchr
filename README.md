# Watchr

## Structure

- `frontend/` — Next.js + TypeScript app
- `backend/` — Go HTTP API (`cmd/server`)
- `docker-compose.yml`
- `docs/schema.md` — database schema design notes

## Development

### With Docker

```
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/health
- Postgres: localhost:5432 (user/password/db: `watchr`)

### Without Docker

Frontend:

```
cd frontend
npm install
npm run dev
```

Backend:

```
cd backend
go run ./cmd/server
```
# watchr
