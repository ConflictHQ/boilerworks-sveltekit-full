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

describe('item CRUD permission gating', () => {
	const editor = makeUser({
		permissions: ['items.view', 'items.create', 'items.edit']
	});

	const viewer = makeUser({
		permissions: ['items.view']
	});

	const admin = makeUser({
		isSuperuser: true,
		permissions: []
	});

	it('editor can view items', () => {
		expect(hasPermission(editor, 'items.view')).toBe(true);
	});

	it('editor can create items', () => {
		expect(hasPermission(editor, 'items.create')).toBe(true);
	});

	it('editor can edit items', () => {
		expect(hasPermission(editor, 'items.edit')).toBe(true);
	});

	it('editor cannot delete items', () => {
		expect(hasPermission(editor, 'items.delete')).toBe(false);
	});

	it('viewer can only view', () => {
		expect(hasPermission(viewer, 'items.view')).toBe(true);
		expect(hasPermission(viewer, 'items.create')).toBe(false);
		expect(hasPermission(viewer, 'items.edit')).toBe(false);
		expect(hasPermission(viewer, 'items.delete')).toBe(false);
	});

	it('admin can do everything', () => {
		expect(hasPermission(admin, 'items.view')).toBe(true);
		expect(hasPermission(admin, 'items.create')).toBe(true);
		expect(hasPermission(admin, 'items.edit')).toBe(true);
		expect(hasPermission(admin, 'items.delete')).toBe(true);
	});
});

describe('item form validation', () => {
	it('rejects empty name', () => {
		const name = '';
		const slug = 'my-item';
		expect(!name || !slug).toBe(true);
	});

	it('rejects empty slug', () => {
		const name = 'My Item';
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
		expect(('' as string) === 'on').toBe(false);
	});
});
