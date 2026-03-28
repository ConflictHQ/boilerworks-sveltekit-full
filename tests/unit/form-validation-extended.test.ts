import { describe, it, expect } from 'vitest';
import { validateFormData } from '../../src/lib/server/forms/index.js';

describe('form validation - number type', () => {
	const schema = {
		type: 'object' as const,
		required: ['quantity'],
		properties: {
			quantity: { type: 'number' as const, title: 'Quantity' }
		}
	};

	it('accepts valid number', () => {
		const errors = validateFormData(schema, { quantity: 5 });
		expect(errors).toHaveLength(0);
	});

	it('rejects string for number field', () => {
		const errors = validateFormData(schema, { quantity: 'five' });
		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe('quantity');
		expect(errors[0].message).toContain('number');
	});

	it('rejects missing required number', () => {
		const errors = validateFormData(schema, {});
		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe('quantity');
		expect(errors[0].message).toContain('required');
	});
});

describe('form validation - combined constraints', () => {
	const schema = {
		type: 'object' as const,
		required: ['username', 'email'],
		properties: {
			username: { type: 'string' as const, title: 'Username', minLength: 3, maxLength: 20 },
			email: { type: 'string' as const, format: 'email' as const, title: 'Email' },
			bio: { type: 'string' as const, title: 'Bio', maxLength: 200 },
			role: { type: 'string' as const, title: 'Role', enum: ['admin', 'editor', 'viewer'] }
		}
	};

	it('accepts fully valid data', () => {
		const errors = validateFormData(schema, {
			username: 'alice',
			email: 'alice@example.com',
			bio: 'Hello world',
			role: 'editor'
		});
		expect(errors).toHaveLength(0);
	});

	it('returns multiple errors for multiple violations', () => {
		const errors = validateFormData(schema, {
			username: 'ab',
			email: 'not-email',
			role: 'superadmin'
		});
		expect(errors.length).toBeGreaterThanOrEqual(3);
		expect(errors.find((e) => e.field === 'username')).toBeDefined();
		expect(errors.find((e) => e.field === 'email')).toBeDefined();
		expect(errors.find((e) => e.field === 'role')).toBeDefined();
	});

	it('validates username minLength', () => {
		const errors = validateFormData(schema, {
			username: 'ab',
			email: 'alice@example.com'
		});
		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe('username');
		expect(errors[0].message).toContain('at least 3');
	});

	it('validates username maxLength', () => {
		const errors = validateFormData(schema, {
			username: 'a'.repeat(21),
			email: 'alice@example.com'
		});
		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe('username');
		expect(errors[0].message).toContain('at most 20');
	});

	it('allows optional fields to be omitted', () => {
		const errors = validateFormData(schema, {
			username: 'alice',
			email: 'alice@example.com'
		});
		expect(errors).toHaveLength(0);
	});

	it('validates enum for role', () => {
		const errors = validateFormData(schema, {
			username: 'alice',
			email: 'alice@example.com',
			role: 'manager'
		});
		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe('role');
		expect(errors[0].message).toContain('one of');
	});
});
