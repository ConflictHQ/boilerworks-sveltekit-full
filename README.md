# Boilerworks SvelteKit Full

> Full-stack SvelteKit application with Svelte 5, Drizzle ORM, PostgreSQL, session-based auth, group permissions, and a dark admin theme.

## Features

- **SvelteKit 2 + Svelte 5** -- Runes, SSR, form actions, API routes
- **Drizzle ORM + PostgreSQL** -- Type-safe queries, UUID PKs, soft deletes
- **Session auth** -- httpOnly cookies, SHA-256 token hashing, argon2 passwords
- **Group-based permissions** -- Users belong to groups, groups have permissions
- **Products + Categories CRUD** -- Full create/read/update/soft-delete
- **Forms engine** -- JSON Schema-driven form definitions with validation
- **Workflow engine** -- State machine with transitions and audit log
- **Admin panel** -- Superuser-gated user and group management
- **Tailwind CSS 4** -- Dark admin theme (Boilerworks branding)
- **Vitest + Playwright** -- Unit and E2E test suites
- **Docker Compose** -- PostgreSQL for local development
- **GitHub Actions CI** -- Lint, test, audit

## Quick Start

```bash
# Install dependencies
npm install

# Start PostgreSQL via Docker
cd docker && docker compose up -d && cd ..

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed

# Start dev server
npm run dev
```

Open http://localhost:5173 and sign in:

| Account | Email | Password |
|---------|-------|----------|
| Admin (superuser) | admin@boilerworks.dev | admin123 |
| Demo (regular) | demo@boilerworks.dev | demo123 |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | ESLint + Prettier check |
| `npm run format` | Auto-format with Prettier |
| `npm run check` | TypeScript + Svelte type checking |
| `npm run db:push` | Push Drizzle schema to database |
| `npm run db:seed` | Seed database with sample data |

## Architecture

```
SvelteKit (Node.js / adapter-node)
  |-- src/routes/       SSR pages + API routes
  |-- src/lib/server/   Auth, DB, permissions, forms, workflow
  |-- Drizzle ORM       PostgreSQL via postgres.js
  |-- Tailwind CSS 4    Dark admin theme
  +-- Docker Compose    PostgreSQL on port 5448
```

## License

MIT

---

Boilerworks is a [Conflict](https://weareconflict.com) brand. CONFLICT is a registered trademark of Conflict LLC.
