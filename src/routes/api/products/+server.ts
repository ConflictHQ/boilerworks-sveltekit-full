import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/index.js';
import { products, categories } from '$lib/server/db/schema.js';
import { isNull, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	const result = await db
		.select({
			id: products.id,
			name: products.name,
			slug: products.slug,
			description: products.description,
			price: products.price,
			isPublished: products.isPublished,
			categoryId: products.categoryId,
			categoryName: categories.name,
			createdAt: products.createdAt,
			updatedAt: products.updatedAt
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.where(isNull(products.deletedAt))
		.orderBy(products.createdAt);

	return Response.json({ ok: true, data: result });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	if (!locals.user.isSuperuser && !locals.user.permissions.includes('products.create')) {
		return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json();
	const { name, slug, description, price, categoryId, isPublished } = body;

	if (!name || !slug) {
		return Response.json({ ok: false, error: 'Name and slug are required' }, { status: 400 });
	}

	try {
		const [product] = await db
			.insert(products)
			.values({
				name,
				slug,
				description: description || null,
				price: Math.round((price || 0) * 100),
				categoryId: categoryId || null,
				isPublished: isPublished ?? false,
				createdBy: locals.user.id,
				updatedBy: locals.user.id
			})
			.returning();

		return Response.json({ ok: true, data: product }, { status: 201 });
	} catch (err) {
		if (err instanceof Error && err.message.includes('unique')) {
			return Response.json({ ok: false, error: 'Slug already in use' }, { status: 409 });
		}
		throw err;
	}
};
