import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { getWorkflowDefinitions, createWorkflowInstance } from '$lib/server/workflow/index.js';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'workflows.create');

	const definitions = await getWorkflowDefinitions();
	return { definitions };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = requirePermission(locals.user, 'workflows.create');
		const formData = await request.formData();
		const definitionId = formData.get('definition_id') as string;

		if (!definitionId) {
			return fail(400, { error: 'Workflow definition is required' });
		}

		try {
			const instance = await createWorkflowInstance(definitionId, user.id);
			throw redirect(303, `/workflows/${instance.id}`);
		} catch (err) {
			if (err instanceof Error && !('status' in err)) {
				return fail(400, { error: err.message });
			}
			throw err;
		}
	}
};
