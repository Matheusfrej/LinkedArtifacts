# LinkedArtifacts Web

Frontend web application for LinkedArtifacts, built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

The application allows users to explore academic papers, filter by artifact badges, search across paper metadata, and inspect linked artifacts.

## Table of contents

- [LinkedArtifacts Web](#linkedartifacts-web)
  - [Table of contents](#table-of-contents)
  - [Architecture](#architecture)
  - [Running the application](#running-the-application)
    - [Prerequisites](#prerequisites)
    - [Environment variables](#environment-variables)
    - [Connecting to the backend API vs. Mock data](#connecting-to-the-backend-api-vs-mock-data)
    - [Running locally in development](#running-locally-in-development)
  - [Production](#production)
  - [Code quality](#code-quality)

> **Note:** All commands below assume you are in the `/web` directory unless stated otherwise. On Windows CMD, replace `cp` with `copy` in any command shown.

## Architecture

The frontend follows the Next.js App Router structure and is organized into modular directories under `src/`:

```text
src/
├── app/
│   ├── @breadcrumb/          # Parallel route providing dynamic breadcrumbs per page
│   ├── api/                  # Built-in Next.js route handlers with mock paper/artifact data
│   ├── components/           # Layout-level components (Header, ThemeProvider)
│   ├── papers/               # Papers listing page with search, filters, and sort
│   ├── privacy/              # Privacy policy page for the companion browser extension
├── components/
│   ├── ThemeToggle.tsx       # Theme selector (Light / Dark / System mode)
│   └── ui/                   # Reusable UI primitives (Button, Input, Table, DropdownMenu, Skeleton)
├── lib/
│   ├── service/              # API service layer with Axios and typed endpoints
│   └── utils.ts              # Styling utilities (tailwind-merge, clsx)
├── types/                    # Global TypeScript declarations
└── utils/                    # Global utilities and application error classes (AppError)
```

## Running the application

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- [npm](https://www.npmjs.com/)

### Environment variables

Create a `.env` file from the provided example:

```bash
cp .env.example .env
```

The application uses the following environment variable:

| Variable               | Description                                                                                                                                   | Default / Example       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE` | Base URL of the LinkedArtifacts API. If left unset or empty, the application defaults to its internal mock API (`http://localhost:3000/api`). | `http://localhost:4000` |

### Connecting to the backend API vs. Mock data

You can run the web app in two different configurations:

1. **Connected to the local LinkedArtifacts API:**
   Ensure the API is running (see [API README](../api/README.md)) on port `4000`, and set in `.env`:

   ```env
   NEXT_PUBLIC_API_BASE=http://localhost:4000
   ```

2. **Connected to the remote API:**

   ```env
   NEXT_PUBLIC_API_BASE=https://linked-artifacts.duckdns.org
   ```

3. **Standalone mode (using internal mock data):**
   Leave `NEXT_PUBLIC_API_BASE` unset or commented out in `.env`. The app will automatically query its internal mock route handlers (`/api/papers` and `/api/artifacts`) with pre-populated test data.

### Running locally in development

Install dependencies and start the development server with Turbopack:

```bash
npm install
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Production

To build and run the application in production mode:

```bash
npm install
npm run build
npm start
```

## Code quality

- **Linting:**
  ```bash
  npm run lint
  ```
- **Formatting:**
  ```bash
  npm run format
  ```
