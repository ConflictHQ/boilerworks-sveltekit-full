import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { items, categories } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'items.view');

	const result = await db
		.select({
			id: items.id,
			name: items.name,
			slug: items.slug,
			description: items.description,
			price: items.price,
			isPublished: items.isPublished,
			categoryName: categories.name,
			categoryId: items.categoryId,
			createdAt: items.createdAt,
			updatedAt: items.updatedAt
		})
		.from(items)
		.leftJoin(categories, eq(items.categoryId, categories.id))
		.where(and(eq(items.id, params.id), isNull(items.deletedAt)))
		.limit(1);

	if (result.length === 0) throw error(404, 'Item not found');

	return { item: result[0] };
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		const user = requirePermission(locals.user, 'items.delete');

		await db
			.update(items)
			.set({ deletedAt: new Date(), deletedBy: user.id })
			.where(eq(items.id, params.id));

		return { deleted: true };
	}
};
