import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireSuperuser } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { groups, groupPermissions, permissions } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requireSuperuser(locals.user);

	const result = await db
		.select()
		.from(groups)
		.where(and(eq(groups.id, params.id), isNull(groups.deletedAt)))
		.limit(1);

	if (result.length === 0) throw error(404, 'Group not found');

	const groupPerms = await db
		.select({ codename: permissions.codename, description: permissions.description })
		.from(groupPermissions)
		.innerJoin(permissions, eq(groupPermissions.permissionId, permissions.id))
		.where(eq(groupPermissions.groupId, params.id));

	return { group: result[0], permissions: groupPerms };
};
