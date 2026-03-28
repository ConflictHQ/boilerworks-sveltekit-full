import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/permissions/index.js';
import { db } from '$lib/server/db/index.js';
import { products, categories, formDefinitions, workflowInstances } from '$lib/server/db/schema.js';
import { isNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	requireAuth(locals.user);

	const [productCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(products)
		.where(isNull(products.deletedAt));

	const [categoryCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(categories)
		.where(isNull(categories.deletedAt));

	const [formCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(formDefinitions)
		.where(isNull(formDefinitions.deletedAt));

	const [workflowCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(workflowInstances)
		.where(isNull(workflowInstances.deletedAt));

	return {
		stats: {
			products: Number(productCount.count),
			categories: Number(categoryCount.count),
			forms: Number(formCount.count),
			workflows: Number(workflowCount.count)
		}
	};
};
