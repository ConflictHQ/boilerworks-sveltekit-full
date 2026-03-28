import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { categories } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'categories.view');

	const result = await db
		.select()
		.from(categories)
		.where(and(eq(categories.id, params.id), isNull(categories.deletedAt)))
		.limit(1);

	if (result.length === 0) throw error(404, 'Category not found');

	return { category: result[0] };
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		const user = requirePermission(locals.user, 'categories.delete');

		await db
			.update(categories)
			.set({ deletedAt: new Date(), deletedBy: user.id })
			.where(eq(categories.id, params.id));

		return { deleted: true };
	}
};
