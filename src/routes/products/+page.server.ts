import type { PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { products, categories } from '$lib/server/db/schema.js';
import { isNull, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'products.view');

	const result = await db
		.select({
			id: products.id,
			name: products.name,
			slug: products.slug,
			price: products.price,
			isPublished: products.isPublished,
			categoryName: categories.name,
			createdAt: products.createdAt
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.where(isNull(products.deletedAt))
		.orderBy(products.createdAt);

	return { products: result };
};
