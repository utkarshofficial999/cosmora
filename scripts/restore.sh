#!/bin/bash
# Cosmora Database Disaster Recovery Script
set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <path_to_backup.sql.gz>"
    exit 1
fi

BACKUP_FILE="$1"
echo "Restoring Cosmora database from ${BACKUP_FILE}..."
gunzip -c "${BACKUP_FILE}" | docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres cosmora_db
echo "Database restoration completed successfully!"
