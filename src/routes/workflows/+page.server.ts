import type { PageServerLoad } from './$types';
import { requirePermission } from '$lib/server/permissions/index.js';
import { getWorkflowDefinitions, getWorkflowInstances } from '$lib/server/workflow/index.js';

export const load: PageServerLoad = async ({ locals }) => {
	requirePermission(locals.user, 'workflows.view');

	const definitions = await getWorkflowDefinitions();
	const instances = await getWorkflowInstances();

	return {
		definitions,
		instances: instances.map((row) => ({
			...row.workflow_instances,
			definitionName: row.workflow_definitions.name
		}))
	};
};
