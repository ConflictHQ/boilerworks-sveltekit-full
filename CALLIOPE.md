# Calliope — Boilerworks SvelteKit Full
<!-- Agent shim for https://github.com/calliopeai/calliope-cli -->

Primary conventions doc: [`bootstrap.md`](bootstrap.md)
Context seed: [`memory.md`](memory.md)

Read both before writing any code.

---

## Project-specific notes

- SvelteKit 2 + Svelte 5 in runes mode (`$props`, `$state`, `$derived`); Drizzle ORM + PostgreSQL.
- Session-based auth (httpOnly cookies, SHA-256 token hashing, argon2 passwords); group-based permissions.
- UUID primary keys via `gen_random_uuid()` — never expose integer IDs; soft delete via `deleted_at`/`deleted_by`, never hard delete.
- Permission check on every load/action function; audit trails (`created_by`, `updated_by`) on all base models.
- Tailwind CSS 4 dark admin theme; Vitest (unit) + Playwright (E2E).
- `make up` / `make dev` / `make seed` / `make migrate` / `make test` / `make check`.
