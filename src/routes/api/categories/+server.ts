import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/index.js';
import { categories } from '$lib/server/db/schema.js';
import { isNull } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	const result = await db
		.select()
		.from(categories)
		.where(isNull(categories.deletedAt))
		.orderBy(categories.name);

	return Response.json({ ok: true, data: result });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	if (!locals.user.isSuperuser && !locals.user.permissions.includes('categories.create')) {
		return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json();
	const { name, slug, description } = body;

	if (!name || !slug) {
		return Response.json({ ok: false, error: 'Name and slug are required' }, { status: 400 });
	}

	try {
		const [category] = await db
			.insert(categories)
			.values({
				name,
				slug,
				description: description || null,
				createdBy: locals.user.id,
				updatedBy: locals.user.id
			})
			.returning();

		return Response.json({ ok: true, data: category }, { status: 201 });
	} catch (err) {
		if (err instanceof Error && err.message.includes('unique')) {
			return Response.json({ ok: false, error: 'Slug already in use' }, { status: 409 });
		}
		throw err;
	}
};
