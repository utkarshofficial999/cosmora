# Cosmora API Guide

Cosmora exposes a complete RESTful API served under `/api/v1`.

Interactive OpenAPI Swagger UI is accessible at `http://localhost:8000/docs`.

## Core Endpoint Modules
- `/api/v1/auth/*`: Registration, Login, Token Refresh, Password Reset
- `/api/v1/timeline/*`: Space eras and timeline milestone events
- `/api/v1/planets/*`: Solar system planets, moons, and trivia facts
- `/api/v1/missions/*`: Space agency missions, countdown hub, milestones
- `/api/v1/stories/*`: Story engine chapters, tags, categories, progress
- `/api/v1/ai/*`: RAG AI assistant chat and token streaming
- `/api/v1/admin/*`: CMS moderation, bulk actions, performance metrics
- `/api/v1/admin/analytics/*`: Platform analytics and CSV reports
