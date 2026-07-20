# 🚀 Cosmos Platform

A story-driven space exploration platform.

## Architecture

```text
cosmos-platform/
├── backend/     # FastAPI backend service
├── frontend/    # Frontend application (planned)
└── docs/        # Project documentation
```

## Quick Start

```bash
cd backend
docker compose up --build
```

The API will be available at `http://localhost:8000`.

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| API         | FastAPI + Uvicorn       |
| Database    | PostgreSQL 16           |
| ORM         | SQLAlchemy 2.0          |
| Migrations  | Alembic                 |
| Validation  | Pydantic v2             |
| Container   | Docker + Docker Compose |
| Language    | Python 3.13+            |

## Documentation

See the [`docs/`](docs/) directory for detailed documentation.

## License

Proprietary — All rights reserved.
