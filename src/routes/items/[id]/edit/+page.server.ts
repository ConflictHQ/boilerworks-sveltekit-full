import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { items, categories } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'items.edit');

	const result = await db
		.select()
		.from(items)
		.where(and(eq(items.id, params.id), isNull(items.deletedAt)))
		.limit(1);

	if (result.length === 0) throw error(404, 'Item not found');

	const cats = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.where(isNull(categories.deletedAt))
		.orderBy(categories.name);

	return { item: result[0], categories: cats };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const user = requirePermission(locals.user, 'items.edit');
		const formData = await request.formData();

		const name = (formData.get('name') as string)?.trim();
		const slug = (formData.get('slug') as string)?.trim();
		const description = (formData.get('description') as string)?.trim() || null;
		const priceStr = formData.get('price') as string;
		const categoryId = (formData.get('category_id') as string) || null;
		const isPublished = formData.get('is_published') === 'on';

		if (!name || !slug) {
			return fail(400, { error: 'Name and slug are required' });
		}

		const price = Math.round(parseFloat(priceStr || '0') * 100);

		try {
			await db
				.update(items)
				.set({ name, slug, description, price, categoryId, isPublished, updatedAt: new Date(), updatedBy: user.id })
				.where(eq(items.id, params.id));

			throw redirect(303, `/items/${params.id}`);
		} catch (err) {
			if (err instanceof Error && err.message.includes('unique')) {
				return fail(400, { error: 'Slug already in use' });
			}
			throw err;
		}
	}
};
