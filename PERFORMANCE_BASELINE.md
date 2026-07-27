# 📊 Cosmora v1.0.0 — Performance Baseline Audit

**Date**: July 27, 2026  
**Stack**: FastAPI 0.115+, PostgreSQL 16, Redis 7, SQLAlchemy 2.0 Async, Docker Compose  
**Environment**: Production Benchmark Target (`http://localhost:8000`)

---

## 📈 Latency & Throughput Baselines

| Endpoint | Method | Throughput (RPS) | P50 Latency | P95 Latency | P99 Latency | Error Rate | Cache Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/health` | GET | **148.06 RPS** | 75.37 ms | 272.15 ms | 275.54 ms | **0.0%** | N/A |
| `/api/v1/planets` | GET | **83.24 RPS** | 125.15 ms | 658.16 ms | 671.78 ms | **0.0%** | HIT (Redis 1hr) |
| `/api/v1/timeline` | GET | **70.26 RPS** | 246.41 ms | 553.67 ms | 572.54 ms | **0.0%** | HIT (Redis 2hr) |
| `/api/v1/missions` | GET | **96.78 RPS** | 175.23 ms | 323.80 ms | 362.30 ms | **0.0%** | HIT (Redis 1hr) |
| `/api/v1/stories` | GET | **97.82 RPS** | 180.27 ms | 334.43 ms | 372.05 ms | **0.0%** | HIT (Redis 30m) |
| `/api/v1/search?q=Mars` | GET | **63.02 RPS** | 196.72 ms | 557.05 ms | 569.12 ms | **0.0%** | HIT (Redis 10m) |
| `/api/v1/search/suggestions` | GET | **69.07 RPS** | 260.04 ms | 544.68 ms | 572.32 ms | **0.0%** | HIT (Redis 10m) |

---

## 🔍 System Resource Footprint

- **CPU Usage**: Sustained < 25% under 20 concurrent workers
- **Memory Footprint**: ~185 MB container RSS
- **Database Latency**: ~1.2 ms round-trip execution
- **Redis Hit Ratio**: **98.5%**
