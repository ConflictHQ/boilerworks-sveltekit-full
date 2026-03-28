import { describe, it, expect } from 'vitest';
import { hasPermission } from '../../src/lib/server/permissions/index.js';
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

describe('hasPermission', () => {
	it('returns false for null user', () => {
		expect(hasPermission(null, 'products.view')).toBe(false);
	});

	it('returns true for superuser regardless of permissions', () => {
		const user = makeUser({ isSuperuser: true, permissions: [] });
		expect(hasPermission(user, 'products.view')).toBe(true);
		expect(hasPermission(user, 'anything.whatever')).toBe(true);
	});

	it('returns true when user has the specific permission', () => {
		const user = makeUser({ permissions: ['products.view', 'products.create'] });
		expect(hasPermission(user, 'products.view')).toBe(true);
	});

	it('returns false when user lacks the specific permission', () => {
		const user = makeUser({ permissions: ['products.view'] });
		expect(hasPermission(user, 'products.delete')).toBe(false);
	});

	it('returns false for empty permissions array', () => {
		const user = makeUser({ permissions: [] });
		expect(hasPermission(user, 'products.view')).toBe(false);
	});
});
