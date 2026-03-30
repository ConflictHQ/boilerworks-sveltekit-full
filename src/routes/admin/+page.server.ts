import type { PageServerLoad } from './$types';
import { requireSuperuser } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { users, groups, sessions } from '$lib/server/db/schema.js';
import { isNull, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requireSuperuser(locals.user);

	const [userCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(users)
		.where(isNull(users.deletedAt));

	const [groupCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(groups)
		.where(isNull(groups.deletedAt));

	const [sessionCount] = await db.select({ count: sql<number>`count(*)` }).from(sessions);

	return {
		stats: {
			users: Number(userCount.count),
			groups: Number(groupCount.count),
			sessions: Number(sessionCount.count)
		}
	};
};
