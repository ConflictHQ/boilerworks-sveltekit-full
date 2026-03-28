import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/index.js';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		await db.execute(sql`SELECT 1`);
		return Response.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
	} catch (err) {
		return Response.json(
			{ ok: false, status: 'unhealthy', error: 'Database connection failed' },
			{ status: 503 }
		);
	}
};
