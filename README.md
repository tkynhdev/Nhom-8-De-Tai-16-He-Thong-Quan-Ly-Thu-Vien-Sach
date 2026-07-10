# LibSys

Library management system with Spring Boot, PostgreSQL, React, and Docker.

## Run with Docker

Create local environment config:

```bash
cp .env.example .env
```

Start the stack:

```bash
docker compose up --build
```

Before production, change `POSTGRES_PASSWORD` and `JWT_SECRET` in `.env`.
If frontend and backend use different domains, set `CORS_ALLOWED_ORIGINS`.
Set `SPRINGDOC_ENABLED=false` to hide Swagger/OpenAPI in production.

If your machine has the older Compose CLI:

```bash
docker-compose up --build
```

Open:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080
Swagger:  http://localhost:8080/swagger-ui.html
```

Stop:

```bash
docker compose down
```

Reset the local database:

```bash
docker compose down -v
```

Backup and restore the database:

```powershell
.\scripts\backup-db.ps1
.\scripts\restore-db.ps1 .\backups\library-YYYYMMDD-HHMMSS.sql
```

## Local Development

Backend:

```bash
cd backend
mvn test
mvn spring-boot:run
```

Requires JDK 21 and Maven 3.9+.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Requires Node.js 20+.

Default frontend API base URL:

```text
http://localhost:8080/api/v1
```

## Role Areas

```text
MEMBER:    /member
LIBRARIAN: /librarian
ADMIN:     /admin
```

Backend still enforces role access. Frontend routes are only the user experience layer.

Admin settings for fines, loan period, and renewal limits are stored in the database.

Seed login:

```text
member / member123
admin  / admin123
```
