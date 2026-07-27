# 🌌 Cosmora — Story-Driven Space Education & Exploration Platform

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![Version](https://img.shields.io/badge/Version-v1.0.0-success.svg)](https://github.com/utkarshofficial999/cosmora)
[![Tests](https://img.shields.io/badge/Tests-107%2F107%20Passing-brightgreen.svg)]()

Cosmora is a production-grade, story-driven space education platform built using modern async Python, PostgreSQL, Redis, and Retrieval-Augmented Generation (RAG) AI.

---

## 🌟 Key Modules & Capabilities

- 🌌 **Space History Timeline**: Era breakdown, milestone timeline events, rich media galleries.
- 🪐 **Interactive Solar System**: Planetary properties, moons, orbits, 3D asset links, trivia facts.
- 🚀 **Mission Tracking System**: Live countdown hub, agency portfolios (ISRO, NASA, ESA), flight milestones.
- 📖 **Story Engine Engine**: Story categories, tags, chapter progressions, reading status tracking.
- 🔍 **Universal Search & Discovery**: Multi-entity cross-domain search, autocomplete suggestions, trending queries.
- 🔖 **Personalization & Collections**: User bookmarks, custom collections, reading history activity logs.
- 🔔 **Notification System**: Real-time WebSockets, push notification feeds, admin broadcasts, scheduled jobs.
- 🤖 **AI Space Assistant (RAG)**: Grounded question answering based on Cosmora content, citations, token streaming.
- 🛠️ **Admin CMS & Moderation**: Single & bulk content publishing/archiving, audit trail (`AdminAuditLog`), operational metrics.
- 📊 **Analytics & Reports**: Telemetry event ingestion, DAU/MAU trends, CSV & JSON executive reports.
- ⚡ **Performance & Caching**: Redis-backed caching layer, background task queue workers, token bucket rate limiting.

---

## 🛠️ Technology Stack

- **Backend**: FastAPI, Async Python 3.13, Pydantic v2
- **Database**: PostgreSQL 16, SQLAlchemy 2.0 Async, Alembic
- **Caching & Queue**: Redis 7, In-Memory Async Fallback
- **Vector RAG**: Cosine Similarity Embeddings Engine
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD, Prometheus

---

## 🚀 Quickstart (Docker)

```bash
git clone https://github.com/utkarshofficial999/cosmora.git
cd cosmora
docker compose -f backend/docker-compose.yml up -d --build
```

Access Swagger Documentation at `http://localhost:8000/docs`.

---

## 🧪 Running Tests

```bash
docker compose -f backend/docker-compose.yml exec api pytest -v
```

All 107 test cases pass cleanly with 100% success rate.
