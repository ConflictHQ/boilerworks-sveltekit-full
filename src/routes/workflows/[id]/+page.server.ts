import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import {
	getWorkflowInstance,
	getAvailableTransitions,
	transitionWorkflow,
	getTransitionHistory
} from '$lib/server/workflow/index.js';

export const load: PageServerLoad = async ({ locals, params }) => {
	requirePermission(locals.user, 'workflows.view');

	const data = await getWorkflowInstance(params.id);
	if (!data) throw error(404, 'Workflow instance not found');

	const { instance, definition } = data;
	type WorkflowStates = Record<string, { transitions: Array<{ to: string; label: string }> }>;
	const states = definition.states as WorkflowStates;
	const transitions = getAvailableTransitions(states, instance.currentState);
	const history = await getTransitionHistory(params.id);

	return { instance, definition, transitions, history };
};

export const actions: Actions = {
	transition: async ({ request, locals, params }) => {
		const user = requirePermission(locals.user, 'workflows.transition');
		const formData = await request.formData();
		const toState = formData.get('to_state') as string;

		if (!toState) {
			return fail(400, { error: 'Target state is required' });
		}

		const result = await transitionWorkflow(params.id, toState, user.id);
		if (!result.ok) {
			return fail(400, { error: result.error });
		}

		return { transitioned: true };
	}
};
