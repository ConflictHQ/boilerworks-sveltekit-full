import {
	pgTable,
	text,
	timestamp,
	boolean,
	uuid,
	jsonb,
	integer,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ── Base columns (audit trails, soft deletes) ──────────────────────

function baseColumns() {
	return {
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
		createdBy: uuid('created_by'),
		updatedBy: uuid('updated_by'),
		deletedAt: timestamp('deleted_at', { withTimezone: true }),
		deletedBy: uuid('deleted_by')
	};
}

// ── Users ──────────────────────────────────────────────────────────

export const users = pgTable('users', {
	...baseColumns(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	displayName: text('display_name').notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	isSuperuser: boolean('is_superuser').default(false).notNull()
});

// ── Sessions ───────────────────────────────────────────────────────

export const sessions = pgTable('sessions', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	tokenHash: text('token_hash').notNull().unique(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// ── Groups & Permissions ───────────────────────────────────────────

export const groups = pgTable('groups', {
	...baseColumns(),
	name: text('name').notNull().unique(),
	description: text('description')
});

export const permissions = pgTable('permissions', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	codename: text('codename').notNull().unique(),
	description: text('description')
});

export const groupPermissions = pgTable(
	'group_permissions',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		groupId: uuid('group_id')
			.notNull()
			.references(() => groups.id),
		permissionId: uuid('permission_id')
			.notNull()
			.references(() => permissions.id)
	},
	(table) => [uniqueIndex('group_perm_unique').on(table.groupId, table.permissionId)]
);

export const userGroups = pgTable(
	'user_groups',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		groupId: uuid('group_id')
			.notNull()
			.references(() => groups.id)
	},
	(table) => [uniqueIndex('user_group_unique').on(table.userId, table.groupId)]
);

// ── Items ───────────────────────────────────────────────────────

export const categories = pgTable('categories', {
	...baseColumns(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description')
});

export const items = pgTable('items', {
	...baseColumns(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	price: integer('price').notNull().default(0), // cents
	categoryId: uuid('category_id').references(() => categories.id),
	isPublished: boolean('is_published').default(false).notNull()
});

// ── Forms Engine ───────────────────────────────────────────────────

export const formDefinitions = pgTable('form_definitions', {
	...baseColumns(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	schema: jsonb('schema').notNull(), // JSON Schema
	isPublished: boolean('is_published').default(false).notNull()
});

export const formSubmissions = pgTable('form_submissions', {
	...baseColumns(),
	formDefinitionId: uuid('form_definition_id')
		.notNull()
		.references(() => formDefinitions.id),
	data: jsonb('data').notNull(),
	submittedBy: uuid('submitted_by').references(() => users.id)
});

// ── Workflow Engine ────────────────────────────────────────────────

export const workflowDefinitions = pgTable('workflow_definitions', {
	...baseColumns(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	states: jsonb('states').notNull(), // { stateName: { transitions: [...] } }
	initialState: text('initial_state').notNull()
});

export const workflowInstances = pgTable('workflow_instances', {
	...baseColumns(),
	workflowDefinitionId: uuid('workflow_definition_id')
		.notNull()
		.references(() => workflowDefinitions.id),
	currentState: text('current_state').notNull(),
	context: jsonb('context').default({})
});

export const transitionLogs = pgTable('transition_logs', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	workflowInstanceId: uuid('workflow_instance_id')
		.notNull()
		.references(() => workflowInstances.id),
	fromState: text('from_state').notNull(),
	toState: text('to_state').notNull(),
	triggeredBy: uuid('triggered_by').references(() => users.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});
