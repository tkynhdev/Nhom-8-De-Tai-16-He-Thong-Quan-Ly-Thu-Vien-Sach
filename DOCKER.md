# Run with Docker

Build and start the whole project:

```bash
cp .env.example .env
docker compose up --build
```

Older Docker Compose:

```bash
docker-compose up --build
```

Open the frontend at:

```text
http://localhost:3000
```

The backend is also exposed at:

```text
http://localhost:8080
```

PostgreSQL is exposed at `localhost:5432` with these defaults:

```text
database: library
user: library
password: library_password
```

Override these values in `.env`.

Before production, change `POSTGRES_PASSWORD` and `JWT_SECRET` in `.env`.
Set `SPRINGDOC_ENABLED=false` to hide Swagger/OpenAPI in production.

Stop the containers:

```bash
docker compose down
```

Stop and remove the database volume:

```bash
docker compose down -v
```

Backup the database:

```powershell
.\scripts\backup-db.ps1
```

Restore a backup:

```powershell
.\scripts\restore-db.ps1 .\backups\library-YYYYMMDD-HHMMSS.sql
```

Seed login:

```text
member / member123
admin  / admin123
```
