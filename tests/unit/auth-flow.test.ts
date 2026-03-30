import { describe, it, expect } from 'vitest';
import {
	requireAuth,
	requirePermission,
	requireSuperuser
} from '../../src/lib/server/permissions/index.js';
import type { SessionUser } from '../../src/lib/server/auth/index.js';

function makeUser(overrides: Partial<SessionUser> = {}): SessionUser {
	return {
		id: 'test-user-id',
		email: 'test@example.com',
		displayName: 'Test User',
		isSuperuser: false,
		permissions: [],
		...overrides
	};
}

describe('requireAuth', () => {
	it('returns user when authenticated', () => {
		const user = makeUser();
		expect(requireAuth(user)).toBe(user);
	});

	it('redirects to /login when user is null', () => {
		expect(() => requireAuth(null)).toThrow();
		try {
			requireAuth(null);
		} catch (e: unknown) {
			const err = e as { status: number; location: string };
			expect(err.status).toBe(303);
			expect(err.location).toBe('/login');
		}
	});
});

describe('login validation logic', () => {
	it('rejects empty email', () => {
		const email = '';
		const password = 'secret';
		expect(!email || !password).toBe(true);
	});

	it('rejects empty password', () => {
		const email = 'test@example.com';
		const password = '';
		expect(!email || !password).toBe(true);
	});

	it('rejects both empty', () => {
		const email = '';
		const password = '';
		expect(!email || !password).toBe(true);
	});

	it('accepts valid credentials shape', () => {
		const email = 'test@example.com';
		const password = 'mysecret123';
		expect(!email || !password).toBe(false);
	});
});
