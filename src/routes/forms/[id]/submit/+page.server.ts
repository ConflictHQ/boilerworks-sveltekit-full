import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { getFormById, validateFormData, submitForm } from '$lib/server/forms/index.js';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'forms.submit');

	const form = await getFormById(params.id);
	if (!form) throw error(404, 'Form not found');
	if (!form.isPublished) throw error(400, 'Form is not published');

	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const user = requirePermission(locals.user, 'forms.submit');

		const form = await getFormById(params.id);
		if (!form) throw error(404, 'Form not found');

		const formData = await request.formData();
		const data: Record<string, unknown> = {};

		const schema = form.schema as {
			properties: Record<string, { type: string }>;
			required?: string[];
		};

		for (const field of Object.keys(schema.properties)) {
			const value = formData.get(field);
			if (value !== null) {
				data[field] = String(value);
			}
		}

		const errors = validateFormData(schema as Parameters<typeof validateFormData>[0], data);

		if (errors.length > 0) {
			return fail(400, { errors, data });
		}

		await submitForm(params.id, data, user.id);
		throw redirect(303, `/forms/${params.id}`);
	}
};
