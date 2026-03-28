import type { PageServerLoad } from './$types';
import { requireSuperuser } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { groups } from '$lib/server/db/schema.js';
import { isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requireSuperuser(locals.user);

	const result = await db
		.select()
		.from(groups)
		.where(isNull(groups.deletedAt))
		.orderBy(groups.name);

	return { groups: result };
};
