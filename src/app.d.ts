import type { SessionUser } from '$lib/server/auth/index.js';

declare global {
	namespace App {
		interface Locals {
			user: SessionUser | null;
		}
	}
}

export {};
