.PHONY: up down logs dev seed migrate test lint check clean

up:
	cd docker && docker compose up -d --build

down:
	cd docker && docker compose down

logs:
	cd docker && docker compose logs -f

dev:
	npm run dev

seed:
	npx tsx src/lib/server/db/seed.ts

migrate:
	npx drizzle-kit push

generate:
	npx drizzle-kit generate

test:
	npx vitest run

test-watch:
	npx vitest

test-e2e:
	npx playwright test

lint:
	npx eslint .
	npx prettier --check .

lint-fix:
	npx eslint --fix .
	npx prettier --write .

check:
	npx svelte-kit sync && npx svelte-check --tsconfig ./tsconfig.json

clean:
	rm -rf .svelte-kit build node_modules
