import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { items, categories } from '$lib/server/db/schema.js';
import { isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'items.create');

	const cats = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.where(isNull(categories.deletedAt))
		.orderBy(categories.name);

	return { categories: cats };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = requirePermission(locals.user, 'items.create');
		const formData = await request.formData();

		const name = (formData.get('name') as string)?.trim();
		const slug = (formData.get('slug') as string)?.trim();
		const description = (formData.get('description') as string)?.trim() || null;
		const priceStr = formData.get('price') as string;
		const categoryId = (formData.get('category_id') as string) || null;
		const isPublished = formData.get('is_published') === 'on';

		if (!name || !slug) {
			return fail(400, { error: 'Name and slug are required', name, slug, description, price: priceStr, categoryId });
		}

		const price = Math.round(parseFloat(priceStr || '0') * 100);

		try {
			const [item] = await db
				.insert(items)
				.values({
					name,
					slug,
					description,
					price,
					categoryId,
					isPublished,
					createdBy: user.id,
					updatedBy: user.id
				})
				.returning({ id: items.id });

			throw redirect(303, `/items/${item.id}`);
		} catch (err) {
			if (err instanceof Error && err.message.includes('unique')) {
				return fail(400, { error: 'Slug already in use', name, slug, description, price: priceStr, categoryId });
			}
			throw err;
		}
	}
};
