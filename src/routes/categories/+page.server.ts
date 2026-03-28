import type { PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { categories } from '$lib/server/db/schema.js';
import { isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'categories.view');

	const result = await db
		.select()
		.from(categories)
		.where(isNull(categories.deletedAt))
		.orderBy(categories.name);

	return { categories: result };
};
