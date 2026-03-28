import type { PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { formDefinitions } from '$lib/server/db/schema.js';
import { isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'forms.view');

	const result = await db
		.select()
		.from(formDefinitions)
		.where(isNull(formDefinitions.deletedAt))
		.orderBy(formDefinitions.name);

	return { forms: result };
};
