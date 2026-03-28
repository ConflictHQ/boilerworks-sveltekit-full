import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireSuperuser } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { users, userGroups, groups } from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requireSuperuser(locals.user);

	const result = await db
		.select()
		.from(users)
		.where(and(eq(users.id, params.id), isNull(users.deletedAt)))
		.limit(1);

	if (result.length === 0) throw error(404, 'User not found');

	const allGroups = await db
		.select()
		.from(groups)
		.where(isNull(groups.deletedAt))
		.orderBy(groups.name);

	const memberGroups = await db
		.select({ groupId: userGroups.groupId })
		.from(userGroups)
		.where(eq(userGroups.userId, params.id));

	return {
		targetUser: result[0],
		groups: allGroups,
		memberGroupIds: memberGroups.map((g) => g.groupId)
	};
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		requireSuperuser(locals.user);
		const formData = await request.formData();

		const displayName = (formData.get('display_name') as string)?.trim();
		const isActive = formData.get('is_active') === 'on';
		const isSuperuser = formData.get('is_superuser') === 'on';
		const groupIds = formData.getAll('group_ids') as string[];

		if (!displayName) {
			return fail(400, { error: 'Display name is required' });
		}

		await db
			.update(users)
			.set({ displayName, isActive, isSuperuser, updatedAt: new Date(), updatedBy: locals.user!.id })
			.where(eq(users.id, params.id));

		// Update group memberships
		await db.delete(userGroups).where(eq(userGroups.userId, params.id));
		if (groupIds.length > 0) {
			await db
				.insert(userGroups)
				.values(groupIds.map((groupId) => ({ userId: params.id, groupId })));
		}

		throw redirect(303, '/admin/users');
	},

	deactivate: async ({ locals, params }) => {
		requireSuperuser(locals.user);

		await db
			.update(users)
			.set({ deletedAt: new Date(), deletedBy: locals.user!.id, isActive: false })
			.where(eq(users.id, params.id));

		throw redirect(303, '/admin/users');
	}
};
