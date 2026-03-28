import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { getFormById } from '$lib/server/forms/index.js';
import { db } from '$lib/server/db/index.js';
import { formDefinitions, formSubmissions } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'forms.view');

	const form = await getFormById(params.id);
	if (!form) throw error(404, 'Form not found');

	const submissions = await db
		.select()
		.from(formSubmissions)
		.where(eq(formSubmissions.formDefinitionId, params.id))
		.orderBy(formSubmissions.createdAt);

	return { form, submissions };
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		const user = requirePermission(locals.user, 'forms.delete');

		await db
			.update(formDefinitions)
			.set({ deletedAt: new Date(), deletedBy: user.id })
			.where(eq(formDefinitions.id, params.id));

		return { deleted: true };
	}
};
