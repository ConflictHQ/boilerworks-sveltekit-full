import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { products, categories } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'products.view');

	const result = await db
		.select({
			id: products.id,
			name: products.name,
			slug: products.slug,
			description: products.description,
			price: products.price,
			isPublished: products.isPublished,
			categoryName: categories.name,
			categoryId: products.categoryId,
			createdAt: products.createdAt,
			updatedAt: products.updatedAt
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.where(and(eq(products.id, params.id), isNull(products.deletedAt)))
		.limit(1);

	if (result.length === 0) throw error(404, 'Product not found');

	return { product: result[0] };
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		const user = requirePermission(locals.user, 'products.delete');

		await db
			.update(products)
			.set({ deletedAt: new Date(), deletedBy: user.id })
			.where(eq(products.id, params.id));

		return { deleted: true };
	}
};
