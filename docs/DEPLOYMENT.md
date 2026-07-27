# Cosmora Deployment Guide

This guide outlines production deployment procedures for AWS, GCP, DigitalOcean, and Kubernetes using Docker Compose and Helm.

## Production Docker Compose Setup

```bash
# 1. Environment configuration
cp .env.example .env.production

# 2. Spin up production stack
docker compose -f docker-compose.prod.yml up -d --build

# 3. Apply Alembic migrations
docker compose -f docker-compose.prod.yml exec api alembic upgrade head
```
