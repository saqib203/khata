# Deployment Guide

## Environments

- Development: local Docker Compose.
- Staging: production-like cloud environment with test data.
- Production: isolated cloud environment with managed PostgreSQL, Redis, object storage, and backups.

## Required Services

- ASP.NET Core API container.
- PostgreSQL database.
- Redis cache.
- Web frontend hosting.
- Mobile distribution through app stores or enterprise distribution.
- Object storage for invoices, exports, and backups.

## Backup Policy

- Full PostgreSQL backup daily.
- Point-in-time recovery enabled in production.
- Export storage retained for at least 30 days.
- Restore procedure tested before launch and monthly after launch.

## Release Flow

1. Merge to main after review and passing CI.
2. Build immutable backend and frontend artifacts.
3. Deploy to staging.
4. Run smoke tests for auth, customer search, sale creation, payment, and reports.
5. Promote the same artifacts to production.
6. Run production smoke tests and monitor logs.
