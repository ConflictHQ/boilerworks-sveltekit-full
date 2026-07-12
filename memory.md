# Boilerworks Memory

This file is the **AI context seed** for the Boilerworks SvelteKit Full template. It captures decisions, constraints, and non-obvious facts that are not derivable from reading the code.

For conventions and patterns, see [`bootstrap.md`](bootstrap.md).

---

## Platform purpose

Full-stack single-app template: SvelteKit 2 + Svelte 5 (runes) with server-side rendering, Drizzle ORM on PostgreSQL, and a dark Tailwind CSS 4 admin theme. No separate API service — pages, form actions, and REST endpoints all live in `src/routes/`.

---

## Key architectural decisions

| Decision                                   | Why                                                                                                                                                                                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session auth with no external IdP          | Random session tokens hashed with SHA-256 and stored server-side; passwords hashed with argon2 (`@node-rs/argon2`); httpOnly cookie. There is deliberately **no session secret** — nothing signs the cookie, the token itself is the credential |
| Group-based permissions                    | Users → groups → permissions; enforced with `requireAuth` / `requirePermission` / `requireSuperuser` from `src/lib/server/permissions/` in every load/action                                                                                    |
| UUID PKs via `gen_random_uuid()`           | Integer IDs are never exposed                                                                                                                                                                                                                   |
| Soft deletes via `deleted_at`/`deleted_by` | Never hard-delete business objects; audit trail via `created_by`/`updated_by` on all base models                                                                                                                                                |
| Drizzle schema push (`npm run db:push`)    | Template uses `drizzle-kit push` rather than checked-in migration files                                                                                                                                                                         |
| Forms engine driven by JSON Schema         | Form definitions live in the database and are validated server-side (`src/lib/server/forms/`)                                                                                                                                                   |
| Workflow engine                            | State machine with explicit transitions and an audit log (`src/lib/server/workflow/`)                                                                                                                                                           |

---

## Things that bite newcomers

- **`npm run db:seed` does not load `.env`** — it runs `tsx src/lib/server/db/seed.ts` and nothing imports dotenv, so `DATABASE_URL` must be exported in the shell (or the loading fixed). Tracked in #15.
- **The configured deploy adapter is `adapter-cloudflare`**, but the stack uses a native Node argon2 addon and a direct-TCP postgres.js connection, which do not run on Workers as-is. Adapter decision tracked in #15.
- **Local dev serves on 5173** (`npm run dev`); port 3000 exists only via the Docker app container mapping `3000:5173` (`make up`).
- **Permission check on every load/action** — nothing enforces this automatically; forgetting it is a security bug, not a style issue.
- **Svelte 5 runes mode** — use `$props`, `$state`, `$derived`; no legacy `export let` / stores-by-default patterns.

---

## Infrastructure topology

```
Docker Compose (docker/)
  app (Dockerfile.dev, vite dev, 3000:5173) ──► db (postgres:16-alpine, 5432:5432)
```

Local path: run Postgres in Docker (`docker compose up -d db`), everything else on the host with `npm run dev`.

---

## Seed data

`npm run db:seed` creates two accounts: `admin@boilerworks.dev` / `admin123` (superuser) and `demo@boilerworks.dev` / `demo123` (regular). Change or remove them before any real deployment.
