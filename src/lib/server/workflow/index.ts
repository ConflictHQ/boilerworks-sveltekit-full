import { db } from '$lib/server/db/index.js';
import {
	workflowDefinitions,
	workflowInstances,
	transitionLogs
} from '$lib/server/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

type WorkflowStates = Record<
	string,
	{
		transitions: Array<{ to: string; label: string }>;
	}
>;

export async function getWorkflowDefinitions() {
	return db
		.select()
		.from(workflowDefinitions)
		.where(isNull(workflowDefinitions.deletedAt));
}

export async function getWorkflowDefinitionById(id: string) {
	const result = await db
		.select()
		.from(workflowDefinitions)
		.where(and(eq(workflowDefinitions.id, id), isNull(workflowDefinitions.deletedAt)))
		.limit(1);
	return result[0] ?? null;
}

export async function createWorkflowInstance(definitionId: string, userId?: string) {
	const definition = await getWorkflowDefinitionById(definitionId);
	if (!definition) throw new Error('Workflow definition not found');

	const [instance] = await db
		.insert(workflowInstances)
		.values({
			workflowDefinitionId: definitionId,
			currentState: definition.initialState,
			context: {},
			createdBy: userId ?? null
		})
		.returning();

	return instance;
}

export async function getWorkflowInstance(id: string) {
	const result = await db
		.select()
		.from(workflowInstances)
		.innerJoin(
			workflowDefinitions,
			eq(workflowInstances.workflowDefinitionId, workflowDefinitions.id)
		)
		.where(and(eq(workflowInstances.id, id), isNull(workflowInstances.deletedAt)))
		.limit(1);

	if (result.length === 0) return null;

	return {
		instance: result[0].workflow_instances,
		definition: result[0].workflow_definitions
	};
}

export async function getWorkflowInstances() {
	return db
		.select()
		.from(workflowInstances)
		.innerJoin(
			workflowDefinitions,
			eq(workflowInstances.workflowDefinitionId, workflowDefinitions.id)
		)
		.where(isNull(workflowInstances.deletedAt));
}

export function getAvailableTransitions(states: WorkflowStates, currentState: string) {
	const state = states[currentState];
	if (!state) return [];
	return state.transitions;
}

export async function transitionWorkflow(
	instanceId: string,
	toState: string,
	userId?: string
): Promise<{ ok: boolean; error?: string }> {
	const data = await getWorkflowInstance(instanceId);
	if (!data) return { ok: false, error: 'Instance not found' };

	const { instance, definition } = data;
	const states = definition.states as WorkflowStates;
	const available = getAvailableTransitions(states, instance.currentState);

	const transition = available.find((t) => t.to === toState);
	if (!transition) {
		return {
			ok: false,
			error: `Cannot transition from "${instance.currentState}" to "${toState}"`
		};
	}

	const fromState = instance.currentState;

	await db
		.update(workflowInstances)
		.set({ currentState: toState, updatedAt: new Date(), updatedBy: userId ?? null })
		.where(eq(workflowInstances.id, instanceId));

	await db.insert(transitionLogs).values({
		workflowInstanceId: instanceId,
		fromState,
		toState,
		triggeredBy: userId ?? null
	});

	return { ok: true };
}

export async function getTransitionHistory(instanceId: string) {
	return db
		.select()
		.from(transitionLogs)
		.where(eq(transitionLogs.workflowInstanceId, instanceId))
		.orderBy(transitionLogs.createdAt);
}
