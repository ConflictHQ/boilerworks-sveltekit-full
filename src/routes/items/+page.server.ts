import type { PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { items, categories } from '$lib/server/db/schema.js';
import { isNull, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'items.view');

	const result = await db
		.select({
			id: items.id,
			name: items.name,
			slug: items.slug,
			price: items.price,
			isPublished: items.isPublished,
			categoryName: categories.name,
			createdAt: items.createdAt
		})
		.from(items)
		.leftJoin(categories, eq(items.categoryId, categories.id))
		.where(isNull(items.deletedAt))
		.orderBy(items.createdAt);

	return { items: result };
};
