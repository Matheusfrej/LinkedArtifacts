# LinkedArtifacts API

REST API for LinkedArtifacts, built with TypeScript, Express, and Drizzle ORM.

The project follows a Domain-Driven Design (DDD) architecture.

## Table of contents

- [LinkedArtifacts API](#linkedartifacts-api)
  - [Table of contents](#table-of-contents)
  - [Architecture](#architecture)
  - [Running the application](#running-the-application)
    - [Running with Docker Compose](#running-with-docker-compose)
      - [Environment variables](#environment-variables)
      - [Run](#run)
    - [Running locally with npm](#running-locally-with-npm)
      - [Environment variables](#environment-variables-1)
      - [Database setup](#database-setup)
      - [Run](#run-1)
  - [Populating the database](#populating-the-database)
    - [Requirements](#requirements)
    - [Running the script](#running-the-script)
  - [Troubleshooting](#troubleshooting)
    - [Stale data from Redis cache](#stale-data-from-redis-cache)
  - [Production](#production)

> **Note:** All commands below assume you are in the `/api` directory unless stated otherwise. On Windows CMD, replace `cp` with `copy` in any command shown.

## Architecture

The application is organized into three main layers:

* `src/domain` — Domain entities, business rules, and repository interfaces.
* `src/application` — Application use cases and business logic.
* `src/infrastructure` — External concerns, including HTTP controllers/routes, database configuration, and repository implementations.
* `src/index.ts` — Application entry point.

## Running the application

The API can be run in two ways:

* **Docker Compose** — runs the API and its supporting services in containers.
* **Locally with npm** — runs the API directly on the host machine.

### Running with Docker Compose

Docker Compose is the recommended way to run the complete application environment.

#### Environment variables

Create the Docker environment file from the provided example:

```bash
cp .env.docker.example .env
```

The Docker configuration uses the following environment variables:

| Variable              | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `POSTGRES_DB`         | PostgreSQL database name.                                            |
| `POSTGRES_USER`       | PostgreSQL username.                                                 |
| `POSTGRES_PASSWORD`   | PostgreSQL password.                                                 |
| `DATABASE_URL_DOCKER` | PostgreSQL connection URL used by the API inside the Docker network. |
| `GRAFANA_USER`        | Grafana username.                                                    |
| `GRAFANA_PASSWORD`    | Grafana password.                                                    |
| `CACHE_PROVIDER`      | Cache provider used by the API.                                      |
| `REDIS_URL`           | Redis connection URL.                                                |
| `METRICS_ENABLED`     | Enables or disables application metrics.                             |

#### Run

```bash
docker compose up --build
```

### Running locally with npm

To run the API directly on the host machine, you need:

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* [PostgreSQL](https://www.postgresql.org/)

#### Environment variables

Create the local environment file from the provided example:

```bash
cp .env.local.example .env
```

See `.env.local.example` for the full list of variables and their descriptions.

#### Database setup

Make sure a PostgreSQL server is running, then create a database:

```bash
createdb -h <HOST> -p <PORT> -U <USERNAME> <DATABASE_NAME>
```

Set `DATABASE_URL` in your `.env` file with the matching connection string:

```env
DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>
```

> If you already have a PostgreSQL database available, skip the step above and just point `DATABASE_URL` to it.
>
> If your password contains special characters such as `@`, `:`, `/`, or `#`, make sure they are URL-encoded in the connection string.
>
> If PostgreSQL is running in Docker, use the host and port exposed on your machine (e.g. if container port `5432` is mapped to `5433`, use `localhost:5433`).

You can verify the connection with:

```bash
psql -h <HOST> -p <PORT> -U <USERNAME> -d <DATABASE_NAME>
```

If successful, this opens the `psql` interactive terminal.

#### Run

```bash
npm install
npm run drizzle:migrate
npm run dev
```

## Populating the database

The `dev_scripts/import_papers.js` script can be used to populate the database with paper data.

### Requirements

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* A running PostgreSQL database

### Running the script

```bash
npm install
cd dev_scripts
cp .env.example .env
```

Make sure `DATABASE_URL` in `dev_scripts/.env` points to the database you want to populate, then run:

```bash
node import_papers.js
```

## Troubleshooting

### Stale data from Redis cache

If imported or updated data does not appear to be reflected by the API, the Redis cache may contain stale data. When Redis is running in Docker, clear it with:

```bash
docker exec -it redis redis-cli FLUSHALL
```

## Production

To build and run the API in production:

```bash
npm install
npm run build
npm run drizzle:migrate
npm start
```

Make sure all required environment variables (see the tables/files above) are set in the production environment before starting the app.