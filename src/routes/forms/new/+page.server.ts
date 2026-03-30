import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { formDefinitions } from '$lib/server/db/schema.js';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'forms.create');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = requirePermission(locals.user, 'forms.create');
		const formData = await request.formData();

		const name = (formData.get('name') as string)?.trim();
		const slug = (formData.get('slug') as string)?.trim();
		const description = (formData.get('description') as string)?.trim() || null;
		const schemaStr = (formData.get('schema') as string)?.trim();
		const isPublished = formData.get('is_published') === 'on';

		if (!name || !slug || !schemaStr) {
			return fail(400, {
				error: 'Name, slug, and schema are required',
				name,
				slug,
				description,
				schema: schemaStr
			});
		}

		let schema: unknown;
		try {
			schema = JSON.parse(schemaStr);
		} catch {
			return fail(400, {
				error: 'Schema must be valid JSON',
				name,
				slug,
				description,
				schema: schemaStr
			});
		}

		try {
			const [form] = await db
				.insert(formDefinitions)
				.values({
					name,
					slug,
					description,
					schema,
					isPublished,
					createdBy: user.id,
					updatedBy: user.id
				})
				.returning({ id: formDefinitions.id });

			throw redirect(303, `/forms/${form.id}`);
		} catch (err) {
			if (err instanceof Error && err.message.includes('unique')) {
				return fail(400, {
					error: 'Slug already in use',
					name,
					slug,
					description,
					schema: schemaStr
				});
			}
			throw err;
		}
	}
};
