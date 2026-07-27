#!/bin/bash
# Cosmora Database Automated Backup Script
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/cosmora_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "Starting Cosmora database backup..."
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres cosmora_db | gzip > "${BACKUP_FILE}"
echo "Backup created successfully: ${BACKUP_FILE}"
