import { describe, it, expect } from 'vitest';
import { requirePermission, requireSuperuser, hasPermission } from '../../src/lib/server/permissions/index.js';
import type { SessionUser } from '../../src/lib/server/auth/index.js';

function makeUser(overrides: Partial<SessionUser> = {}): SessionUser {
	return {
		id: 'test-user-id',
		email: 'viewer@example.com',
		displayName: 'Viewer User',
		isSuperuser: false,
		permissions: ['products.view'],
		...overrides
	};
}

describe('permission denial - viewer blocked from create', () => {
	it('viewer cannot access products.create', () => {
		const user = makeUser({ permissions: ['products.view'] });
		expect(hasPermission(user, 'products.create')).toBe(false);
	});

	it('requirePermission throws 403 for viewer on products.create', () => {
		const user = makeUser({ permissions: ['products.view'] });
		expect(() => requirePermission(user, 'products.create')).toThrow();
		try {
			requirePermission(user, 'products.create');
		} catch (e: unknown) {
			const err = e as { status: number; body: { message: string } };
			expect(err.status).toBe(403);
		}
	});

	it('viewer cannot access products.edit', () => {
		const user = makeUser({ permissions: ['products.view'] });
		expect(hasPermission(user, 'products.edit')).toBe(false);
	});

	it('viewer cannot access products.delete', () => {
		const user = makeUser({ permissions: ['products.view'] });
		expect(hasPermission(user, 'products.delete')).toBe(false);
	});

	it('requirePermission throws 403 for viewer on admin routes', () => {
		const user = makeUser({ permissions: ['products.view'] });
		expect(() => requirePermission(user, 'admin.access')).toThrow();
	});

	it('requireSuperuser throws 403 for non-superuser', () => {
		const user = makeUser({ isSuperuser: false });
		expect(() => requireSuperuser(user)).toThrow();
		try {
			requireSuperuser(user);
		} catch (e: unknown) {
			const err = e as { status: number };
			expect(err.status).toBe(403);
		}
	});

	it('superuser bypasses all permission checks', () => {
		const user = makeUser({ isSuperuser: true, permissions: [] });
		expect(requirePermission(user, 'products.create')).toBe(user);
		expect(requirePermission(user, 'products.delete')).toBe(user);
		expect(requirePermission(user, 'admin.anything')).toBe(user);
	});
});
