# LinkedArtifacts API (Boilerplate)

Boilerplate REST API with DDD structure using TypeScript, Express and Drizzle ORM.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. From `/api` run:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

Folder structure

- `src/domain` — entities, repository interfaces
- `src/application` — use-cases
- `src/infrastructure` — HTTP, DB, repositories
- `src/index.ts` — entrypoint
