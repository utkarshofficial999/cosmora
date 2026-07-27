# Cosmora Architecture & System Design

Cosmora is architected following **Clean Architecture** principles, enforcing decoupling between data persistence, domain logic, and API presentation layers.

```text
┌─────────────────────────────────────────────────────────┐
│                   API Presentation Layer                │
│       FastAPI Routers / Middlewares / Dependencies       │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                       │
│     Business Logic / RAG / Moderation / Analytics       │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Repository Layer                     │
│      SQLAlchemy 2.0 Async / Redis Caching / Vector DB   │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Database & Infrastructure               │
│        PostgreSQL 16 / Redis 7 / Vector Storage         │
└─────────────────────────────────────────────────────────┘
```

---

## Domain Separation
- `app/models/`: SQLAlchemy 2.0 ORM Entities
- `app/repositories/`: Asynchronous Data Access Layer
- `app/services/`: Pure Business Logic Engine
- `app/api/`: REST API Versioned Endpoints (`/api/v1`)
- `app/schemas/`: Pydantic v2 Request/Response Data Transfer Objects
