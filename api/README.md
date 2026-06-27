# LinkedArtifacts API

REST API with DDD structure using TypeScript, Express and Drizzle ORM.

## Folder structure

- `src/domain` — Entities and repository interfaces.
- `src/application` — Application use cases.
- `src/infrastructure` — HTTP layer, database, and repository implementations.
- `src/index.ts` — Application entry point.

## Quick start

### Running with Docker Compose

1. Copy `.env.example` to `.env` and configure the environment variables.
2. From the `/api` directory, run:

```bash
docker compose up --build
```

### Running with npm

**Requirements:**

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

1. Have a Postgres database running.
2. Copy `.env.example` to `.env` and set the `DATABASE_URL` environment variable.
3. From the `/api` directory, run:

```bash
npm install
npm run drizzle:migrate
npm run dev
```

### Populate the database with `dev_scripts/import_papers.js`

**Requirements:**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A running PostgreSQL database.

1. Run `npm install` to install the dependencies required by the script.
2. Change to the `dev_scripts` directory:
   ```sh
   cd dev_scripts
   ```
3. Copy `.env.example` to `.env` and set the `DATABASE_URL` environment variable.
4. Run the script:
   ```sh
   node import_papers.js
   ```
5. If the API endpoints do not appear to be updated after running the script, the Redis cache may need to be cleared. If Redis is running in Docker, execute:
   ```sh
   docker exec -it redis redis-cli FLUSHALL
   ```

## Build for production

To build and run the api for production, run the following:

```bash
npm install
npm run build
npm run drizzle:migrate
npm start
```