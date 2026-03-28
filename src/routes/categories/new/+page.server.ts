import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { categories } from '$lib/server/db/schema.js';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'categories.create');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = requirePermission(locals.user, 'categories.create');
		const formData = await request.formData();

		const name = (formData.get('name') as string)?.trim();
		const slug = (formData.get('slug') as string)?.trim();
		const description = (formData.get('description') as string)?.trim() || null;

		if (!name || !slug) {
			return fail(400, { error: 'Name and slug are required', name, slug, description });
		}

		try {
			const [category] = await db
				.insert(categories)
				.values({ name, slug, description, createdBy: user.id, updatedBy: user.id })
				.returning({ id: categories.id });

			throw redirect(303, `/categories/${category.id}`);
		} catch (err) {
			if (err instanceof Error && err.message.includes('unique')) {
				return fail(400, { error: 'Slug already in use', name, slug, description });
			}
			throw err;
		}
	}
};
