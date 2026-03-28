import { describe, it, expect } from 'vitest';
import { validateFormData } from '../../src/lib/server/forms/index.js';

describe('validateFormData', () => {
	const schema = {
		type: 'object' as const,
		required: ['name', 'email'],
		properties: {
			name: { type: 'string' as const, title: 'Name' },
			email: { type: 'string' as const, format: 'email' as const, title: 'Email' },
			message: { type: 'string' as const, title: 'Message' }
		}
	};

	it('returns no errors for valid data', () => {
		const errors = validateFormData(schema, {
			name: 'Alice',
			email: 'alice@example.com',
			message: 'Hello'
		});
		expect(errors).toHaveLength(0);
	});

	it('returns errors for missing required fields', () => {
		const errors = validateFormData(schema, { message: 'Hello' });
		expect(errors).toHaveLength(2);
		expect(errors.find((e) => e.field === 'name')).toBeDefined();
		expect(errors.find((e) => e.field === 'email')).toBeDefined();
	});

	it('returns error for invalid email format', () => {
		const errors = validateFormData(schema, {
			name: 'Alice',
			email: 'not-an-email'
		});
		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe('email');
		expect(errors[0].message).toContain('valid email');
	});

	it('allows optional fields to be empty', () => {
		const errors = validateFormData(schema, {
			name: 'Alice',
			email: 'alice@example.com'
		});
		expect(errors).toHaveLength(0);
	});

	it('returns error for empty required string', () => {
		const errors = validateFormData(schema, {
			name: '',
			email: 'alice@example.com'
		});
		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe('name');
	});

	it('validates minLength constraint', () => {
		const schemaWithMin = {
			type: 'object' as const,
			required: [] as string[],
			properties: {
				code: { type: 'string' as const, title: 'Code', minLength: 3 }
			}
		};
		const errors = validateFormData(schemaWithMin, { code: 'AB' });
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain('at least 3');
	});

	it('validates maxLength constraint', () => {
		const schemaWithMax = {
			type: 'object' as const,
			required: [] as string[],
			properties: {
				code: { type: 'string' as const, title: 'Code', maxLength: 5 }
			}
		};
		const errors = validateFormData(schemaWithMax, { code: 'ABCDEF' });
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain('at most 5');
	});

	it('validates enum constraint', () => {
		const schemaWithEnum = {
			type: 'object' as const,
			required: [] as string[],
			properties: {
				color: { type: 'string' as const, title: 'Color', enum: ['red', 'green', 'blue'] }
			}
		};
		const errors = validateFormData(schemaWithEnum, { color: 'yellow' });
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain('one of');
	});
});
