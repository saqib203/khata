# PumpERP

PumpERP is a cloud business management system for water pump manufacturing, repair, sales, installments, inventory, suppliers, and khata ledgers.

This repository is structured as a production monorepo:

- `docs/` product, architecture, database, ERD, and API documentation.
- `src/backend/` ASP.NET Core clean architecture backend.
- `apps/web/` Next.js web dashboard.
- `apps/mobile/` Expo React Native mobile app.
- `infra/` database and deployment assets.
- `.github/workflows/` CI pipeline.

## Target Stack

- Backend: ASP.NET Core 9, CQRS, MediatR, Entity Framework Core, PostgreSQL, Redis, JWT auth.
- Web: Next.js, TypeScript, Tailwind CSS, shadcn/ui-compatible component structure.
- Mobile: React Native with Expo, offline-first sync.
- Infrastructure: Docker, PostgreSQL, Redis, CI/CD, daily backups.

## Local Development Shape

1. Start infrastructure with Docker Compose.
2. Run backend API from `src/backend/PumpErp.Api`.
3. Run web dashboard from `apps/web`.
4. Run mobile app from `apps/mobile`.

This first foundation includes contracts, schema, core backend domain entities, API surface, and frontend/mobile application shells. It is intentionally modular so each module can be completed without rewriting the platform.

## Browser Preview

Open this file directly in your browser for a no-install preview:

```text
apps/preview/index.html
```

If you want API-style endpoints active as well, run:

```powershell
& "C:\Users\AK\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" apps/preview/server.mjs
```

Then open `http://127.0.0.1:4300`.
