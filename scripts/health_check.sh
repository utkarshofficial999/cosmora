#!/bin/bash
# Cosmora Production Health Verification Script
set -e

API_URL="${API_URL:-http://localhost:8000}"

echo "Checking API health at ${API_URL}..."
curl -s -f "${API_URL}/api/v1/health" | grep -q '"status":"healthy"' && echo "API Health: OK" || echo "API Health: FAILED"
curl -s -f "${API_URL}/api/v1/health/db" | grep -q '"status":"healthy"' && echo "DB Health: OK" || echo "DB Health: FAILED"
curl -s -f "${API_URL}/api/v1/health/cache" | grep -q '"status":"healthy"' && echo "Cache Health: OK" || echo "Cache Health: FAILED"
curl -s -f "${API_URL}/api/v1/health/ai" | grep -q '"status":"healthy"' && echo "AI Vector Store: OK" || echo "AI Vector Store: FAILED"
