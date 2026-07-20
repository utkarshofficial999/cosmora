# 🚀 Cosmos Platform — Backend

Production-grade FastAPI backend for the Cosmos Platform.

## Architecture

```text
app/
├── api/            # Route handlers (controllers)
├── config/         # Application settings & logging
├── core/           # Cross-cutting concerns (DI, shared logic)
├── db/             # Database engine, session, base model
├── middleware/      # HTTP middleware (CORS, etc.)
├── models/         # SQLAlchemy ORM models
├── repositories/   # Data access layer
├── schemas/        # Pydantic request/response models
├── services/       # Business logic layer
├── utils/          # Shared utility functions
└── main.py         # Application entry point
```

## Quick Start

### 1. Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
```

### 2. Run with Docker Compose (Recommended)

```bash
docker compose up --build
```

This starts both the FastAPI application and PostgreSQL database. The API will be available at:

| Resource       | URL                                  |
|----------------|--------------------------------------|
| API            | http://localhost:8000                 |
| Swagger UI     | http://localhost:8000/docs            |
| ReDoc          | http://localhost:8000/redoc           |
| Health Check   | http://localhost:8000/health          |
| OpenAPI JSON   | http://localhost:8000/openapi.json    |

### 3. Run Without Docker

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> **Note**: You'll need a running PostgreSQL instance. Update `POSTGRES_HOST` in `.env` to point to it.

## Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Testing

```bash
pytest
```

## Project Conventions

- **Clean Architecture**: API → Service → Repository → Database
- **Type hints** on all function signatures
- **Pydantic v2** for all request/response validation
- **Async-first**: All database operations use `asyncpg`
- **Environment variables** for all secrets and configuration
