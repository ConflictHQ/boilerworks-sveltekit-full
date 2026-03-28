import { db } from '$lib/server/db/index.js';
import { formDefinitions, formSubmissions } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

type JsonSchema = {
	type: string;
	required?: string[];
	properties: Record<
		string,
		{
			type: string;
			title?: string;
			format?: string;
			minLength?: number;
			maxLength?: number;
			minimum?: number;
			maximum?: number;
			enum?: string[];
		}
	>;
};

export type ValidationError = { field: string; message: string };

export function validateFormData(
	schema: JsonSchema,
	data: Record<string, unknown>
): ValidationError[] {
	const errors: ValidationError[] = [];

	// Check required fields
	for (const field of schema.required ?? []) {
		const value = data[field];
		if (value === undefined || value === null || value === '') {
			errors.push({ field, message: `${schema.properties[field]?.title ?? field} is required` });
		}
	}

	// Validate field types
	for (const [field, spec] of Object.entries(schema.properties)) {
		const value = data[field];
		if (value === undefined || value === null || value === '') continue;

		if (spec.type === 'string' && typeof value !== 'string') {
			errors.push({ field, message: `${spec.title ?? field} must be a string` });
			continue;
		}

		if (spec.type === 'number' && typeof value !== 'number') {
			errors.push({ field, message: `${spec.title ?? field} must be a number` });
			continue;
		}

		if (spec.format === 'email' && typeof value === 'string') {
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
				errors.push({ field, message: `${spec.title ?? field} must be a valid email` });
			}
		}

		if (spec.minLength && typeof value === 'string' && value.length < spec.minLength) {
			errors.push({
				field,
				message: `${spec.title ?? field} must be at least ${spec.minLength} characters`
			});
		}

		if (spec.maxLength && typeof value === 'string' && value.length > spec.maxLength) {
			errors.push({
				field,
				message: `${spec.title ?? field} must be at most ${spec.maxLength} characters`
			});
		}

		if (spec.enum && !spec.enum.includes(String(value))) {
			errors.push({
				field,
				message: `${spec.title ?? field} must be one of: ${spec.enum.join(', ')}`
			});
		}
	}

	return errors;
}

export async function getPublishedForms() {
	return db
		.select()
		.from(formDefinitions)
		.where(and(eq(formDefinitions.isPublished, true), isNull(formDefinitions.deletedAt)));
}

export async function getFormById(id: string) {
	const result = await db
		.select()
		.from(formDefinitions)
		.where(and(eq(formDefinitions.id, id), isNull(formDefinitions.deletedAt)))
		.limit(1);
	return result[0] ?? null;
}

export async function submitForm(formId: string, data: Record<string, unknown>, userId?: string) {
	const [submission] = await db
		.insert(formSubmissions)
		.values({
			formDefinitionId: formId,
			data,
			submittedBy: userId ?? null
		})
		.returning();
	return submission;
}
