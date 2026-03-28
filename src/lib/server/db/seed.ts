import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from '@node-rs/argon2';
import * as schema from './schema.js';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error('DATABASE_URL is not set');
	process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

async function seed() {
	console.log('Seeding database...');

	// Create permissions
	const permissionCodes = [
		'products.view',
		'products.create',
		'products.edit',
		'products.delete',
		'categories.view',
		'categories.create',
		'categories.edit',
		'categories.delete',
		'forms.view',
		'forms.create',
		'forms.edit',
		'forms.delete',
		'forms.submit',
		'workflows.view',
		'workflows.create',
		'workflows.edit',
		'workflows.delete',
		'workflows.transition',
		'users.view',
		'users.create',
		'users.edit',
		'users.delete',
		'groups.view',
		'groups.create',
		'groups.edit',
		'groups.delete'
	];

	const insertedPermissions = await db
		.insert(schema.permissions)
		.values(permissionCodes.map((codename) => ({ codename, description: codename })))
		.onConflictDoNothing()
		.returning();
	console.log(`  ${insertedPermissions.length} permissions created`);

	// Fetch all permissions (including previously existing ones)
	const allPermissions = await db.select().from(schema.permissions);

	// Create groups
	const [adminGroup] = await db
		.insert(schema.groups)
		.values([
			{ name: 'Administrators', description: 'Full access to all resources' },
			{ name: 'Editors', description: 'Can manage products, categories, forms' },
			{ name: 'Viewers', description: 'Read-only access' }
		])
		.onConflictDoNothing()
		.returning();
	console.log('  Groups created');

	// Assign all permissions to admin group
	if (adminGroup) {
		await db
			.insert(schema.groupPermissions)
			.values(
				allPermissions.map((p) => ({
					groupId: adminGroup.id,
					permissionId: p.id
				}))
			)
			.onConflictDoNothing();
		console.log('  Admin group permissions assigned');
	}

	// Create admin user
	const passwordHash = await hash('admin123');
	const [adminUser] = await db
		.insert(schema.users)
		.values({
			email: 'admin@boilerworks.dev',
			passwordHash,
			displayName: 'Admin',
			isActive: true,
			isSuperuser: true
		})
		.onConflictDoNothing()
		.returning();

	if (adminUser && adminGroup) {
		await db
			.insert(schema.userGroups)
			.values({ userId: adminUser.id, groupId: adminGroup.id })
			.onConflictDoNothing();
	}
	console.log('  Admin user created (admin@boilerworks.dev / admin123)');

	// Create demo user
	const demoHash = await hash('demo123');
	await db
		.insert(schema.users)
		.values({
			email: 'demo@boilerworks.dev',
			passwordHash: demoHash,
			displayName: 'Demo User',
			isActive: true,
			isSuperuser: false
		})
		.onConflictDoNothing();
	console.log('  Demo user created (demo@boilerworks.dev / demo123)');

	// Create sample categories
	const [catElectronics, catClothing] = await db
		.insert(schema.categories)
		.values([
			{ name: 'Electronics', slug: 'electronics', description: 'Electronic devices' },
			{ name: 'Clothing', slug: 'clothing', description: 'Apparel and accessories' }
		])
		.onConflictDoNothing()
		.returning();
	console.log('  Categories created');

	// Create sample products
	if (catElectronics && catClothing) {
		await db
			.insert(schema.products)
			.values([
				{
					name: 'Wireless Headphones',
					slug: 'wireless-headphones',
					description: 'Noise-cancelling wireless headphones',
					price: 9999,
					categoryId: catElectronics.id,
					isPublished: true
				},
				{
					name: 'USB-C Cable',
					slug: 'usb-c-cable',
					description: 'Braided USB-C to USB-C cable',
					price: 1499,
					categoryId: catElectronics.id,
					isPublished: true
				},
				{
					name: 'Cotton T-Shirt',
					slug: 'cotton-t-shirt',
					description: 'Classic fit cotton t-shirt',
					price: 2499,
					categoryId: catClothing.id,
					isPublished: true
				}
			])
			.onConflictDoNothing();
		console.log('  Products created');
	}

	// Create sample form definition
	await db
		.insert(schema.formDefinitions)
		.values({
			name: 'Contact Form',
			slug: 'contact-form',
			description: 'General contact form',
			schema: {
				type: 'object',
				required: ['name', 'email', 'message'],
				properties: {
					name: { type: 'string', title: 'Name' },
					email: { type: 'string', format: 'email', title: 'Email' },
					message: { type: 'string', title: 'Message' }
				}
			},
			isPublished: true
		})
		.onConflictDoNothing();
	console.log('  Form definitions created');

	// Create sample workflow definition
	await db
		.insert(schema.workflowDefinitions)
		.values({
			name: 'Approval Workflow',
			slug: 'approval-workflow',
			description: 'Simple approval workflow',
			initialState: 'draft',
			states: {
				draft: {
					transitions: [{ to: 'pending_review', label: 'Submit for Review' }]
				},
				pending_review: {
					transitions: [
						{ to: 'approved', label: 'Approve' },
						{ to: 'rejected', label: 'Reject' },
						{ to: 'draft', label: 'Return to Draft' }
					]
				},
				approved: {
					transitions: [{ to: 'draft', label: 'Reopen' }]
				},
				rejected: {
					transitions: [{ to: 'draft', label: 'Reopen' }]
				}
			}
		})
		.onConflictDoNothing();
	console.log('  Workflow definitions created');

	console.log('Seed complete.');
	await client.end();
}

seed().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
