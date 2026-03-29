import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/index.js';
import { items, categories } from '$lib/server/db/schema.js';
import { isNull, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	const result = await db
		.select({
			id: items.id,
			name: items.name,
			slug: items.slug,
			description: items.description,
			price: items.price,
			isPublished: items.isPublished,
			categoryId: items.categoryId,
			categoryName: categories.name,
			createdAt: items.createdAt,
			updatedAt: items.updatedAt
		})
		.from(items)
		.leftJoin(categories, eq(items.categoryId, categories.id))
		.where(isNull(items.deletedAt))
		.orderBy(items.createdAt);

	return Response.json({ ok: true, data: result });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	if (!locals.user.isSuperuser && !locals.user.permissions.includes('items.create')) {
		return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json();
	const { name, slug, description, price, categoryId, isPublished } = body;

	if (!name || !slug) {
		return Response.json({ ok: false, error: 'Name and slug are required' }, { status: 400 });
	}

	try {
		const [item] = await db
			.insert(items)
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

		return Response.json({ ok: true, data: item }, { status: 201 });
	} catch (err) {
		if (err instanceof Error && err.message.includes('unique')) {
			return Response.json({ ok: false, error: 'Slug already in use' }, { status: 409 });
		}
		throw err;
	}
};
