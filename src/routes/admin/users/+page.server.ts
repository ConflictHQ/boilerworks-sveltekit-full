import type { PageServerLoad } from './$types';
import { requireSuperuser } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requireSuperuser(locals.user);

	const result = await db
		.select({
			id: users.id,
			email: users.email,
			displayName: users.displayName,
			isActive: users.isActive,
			isSuperuser: users.isSuperuser,
			createdAt: users.createdAt
		})
		.from(users)
		.where(isNull(users.deletedAt))
		.orderBy(users.createdAt);

	return { users: result };
};
