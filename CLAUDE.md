# Claude -- Boilerworks SvelteKit Full

Primary conventions doc: [`bootstrap.md`](bootstrap.md)

Read it before writing any code.

## Stack

- **Framework**: SvelteKit
- **UI**: Svelte 5
- **Styling**: Tailwind CSS
- **Database**: D1 or Turso
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages

## Edge Template

This is an edge template. Full-stack in one framework -- SSR + client + API routes. Production deployment targets Cloudflare Pages, not Docker. Local development uses `vite dev`.

## Status

This template is planned. See the [stack primer](../primers/sveltekit-full/PRIMER.md) for architecture decisions and build order.
