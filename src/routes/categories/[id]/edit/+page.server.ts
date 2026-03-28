import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { categories } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'categories.edit');

	const result = await db
		.select()
		.from(categories)
		.where(and(eq(categories.id, params.id), isNull(categories.deletedAt)))
		.limit(1);

	if (result.length === 0) throw error(404, 'Category not found');

	return { category: result[0] };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const user = requirePermission(locals.user, 'categories.edit');
		const formData = await request.formData();

		const name = (formData.get('name') as string)?.trim();
		const slug = (formData.get('slug') as string)?.trim();
		const description = (formData.get('description') as string)?.trim() || null;

		if (!name || !slug) {
			return fail(400, { error: 'Name and slug are required' });
		}

		try {
			await db
				.update(categories)
				.set({ name, slug, description, updatedAt: new Date(), updatedBy: user.id })
				.where(eq(categories.id, params.id));

			throw redirect(303, `/categories/${params.id}`);
		} catch (err) {
			if (err instanceof Error && err.message.includes('unique')) {
				return fail(400, { error: 'Slug already in use' });
			}
			throw err;
		}
	}
};
