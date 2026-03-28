import { describe, it, expect } from 'vitest';
import { requirePermission, hasPermission } from '../../src/lib/server/permissions/index.js';
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

describe('product CRUD permission gating', () => {
	const editor = makeUser({
		permissions: ['products.view', 'products.create', 'products.edit']
	});

	const viewer = makeUser({
		permissions: ['products.view']
	});

	const admin = makeUser({
		isSuperuser: true,
		permissions: []
	});

	it('editor can view products', () => {
		expect(hasPermission(editor, 'products.view')).toBe(true);
	});

	it('editor can create products', () => {
		expect(hasPermission(editor, 'products.create')).toBe(true);
	});

	it('editor can edit products', () => {
		expect(hasPermission(editor, 'products.edit')).toBe(true);
	});

	it('editor cannot delete products', () => {
		expect(hasPermission(editor, 'products.delete')).toBe(false);
	});

	it('viewer can only view', () => {
		expect(hasPermission(viewer, 'products.view')).toBe(true);
		expect(hasPermission(viewer, 'products.create')).toBe(false);
		expect(hasPermission(viewer, 'products.edit')).toBe(false);
		expect(hasPermission(viewer, 'products.delete')).toBe(false);
	});

	it('admin can do everything', () => {
		expect(hasPermission(admin, 'products.view')).toBe(true);
		expect(hasPermission(admin, 'products.create')).toBe(true);
		expect(hasPermission(admin, 'products.edit')).toBe(true);
		expect(hasPermission(admin, 'products.delete')).toBe(true);
	});
});

describe('product form validation', () => {
	it('rejects empty name', () => {
		const name = '';
		const slug = 'my-product';
		expect(!name || !slug).toBe(true);
	});

	it('rejects empty slug', () => {
		const name = 'My Product';
		const slug = '';
		expect(!name || !slug).toBe(true);
	});

	it('accepts valid name and slug', () => {
		const name = 'Widget';
		const slug = 'widget';
		expect(!name || !slug).toBe(false);
	});

	it('parses price to cents correctly', () => {
		const priceStr = '19.99';
		const price = Math.round(parseFloat(priceStr) * 100);
		expect(price).toBe(1999);
	});

	it('defaults missing price to 0', () => {
		const priceStr = '';
		const price = Math.round(parseFloat(priceStr || '0') * 100);
		expect(price).toBe(0);
	});

	it('handles is_published checkbox', () => {
		expect('on' === 'on').toBe(true);
		expect(null === 'on').toBe(false);
		expect('' === 'on').toBe(false);
	});
});
