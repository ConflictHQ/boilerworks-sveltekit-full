## Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm

---

# Claude -- Boilerworks SvelteKit Full

Primary conventions doc: [`bootstrap.md`](bootstrap.md)

Read it before writing any code.

## Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes)
- **ORM**: Drizzle ORM + PostgreSQL
- **Auth**: Session-based (httpOnly cookies, SHA-256 token hashing, argon2 passwords)
- **Permissions**: Group-based (users -> groups -> permissions)
- **Styling**: Tailwind CSS 4 (dark admin theme)
- **Testing**: Vitest (unit) + Playwright (E2E)

## Quick Reference

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| Health | http://localhost:3000/api/health |
| Postgres | localhost:5432 |

## Commands

```bash
make up          # Start Docker Compose stack
make dev         # Run dev server locally
make seed        # Seed database
make migrate     # Push schema to database
make test        # Run unit tests
make test-e2e    # Run Playwright E2E tests
make lint        # ESLint + Prettier check
make check       # svelte-check type checking
```

## Structure

```
src/
  lib/
    server/
      db/         # Drizzle schema, connection, seed
      auth/       # Session auth (create, validate, invalidate)
      permissions/ # requireAuth, requirePermission, requireSuperuser
      forms/      # Form validation engine (JSON Schema)
      workflow/   # State machine workflow engine
    components/   # Shared Svelte components
  routes/
    login/        # Login page
    register/     # Registration page
    logout/       # Logout action
    dashboard/    # Dashboard with stats
    products/     # Products CRUD
    categories/   # Categories CRUD
    forms/        # Form definitions + submissions
    workflows/    # Workflow definitions + instances + transitions
    admin/        # Superuser-only admin panel (users, groups)
    api/          # REST API endpoints (health, products, categories)
```

## Rules

- UUID primary keys via `gen_random_uuid()` -- never expose integer IDs
- Soft delete via `deleted_at`/`deleted_by` -- never hard delete
- Audit trails: `created_by`, `updated_by` on all base models
- Permission check on every load/action function
- Svelte 5 runes mode (`$props`, `$state`, `$derived`)
- No co-authorship messages in commits
