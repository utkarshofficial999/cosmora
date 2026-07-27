# Cosmora Backup & Disaster Recovery Policy

## Automated Daily Backups
Automated database snapshots are triggered daily via `./scripts/backup.sh`.

## Disaster Recovery Procedure
To restore database from snapshot:
```bash
./scripts/restore.sh ./backups/cosmora_backup_20260727_120000.sql.gz
```
