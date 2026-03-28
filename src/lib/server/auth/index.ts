import { db } from '$lib/server/db/index.js';
import { sessions, users, userGroups, groupPermissions, permissions } from '$lib/server/db/schema.js';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';
import crypto from 'node:crypto';

export type SessionUser = {
	id: string;
	email: string;
	displayName: string;
	isSuperuser: boolean;
	permissions: string[];
};

async function sha256Hex(input: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string): Promise<string> {
	return hash(password);
}

export async function verifyPassword(hashed: string, password: string): Promise<boolean> {
	return verify(hashed, password);
}

export async function createSession(userId: string): Promise<string> {
	const token = crypto.randomUUID();
	const tokenHash = await sha256Hex(token);
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

	await db.insert(sessions).values({
		userId,
		tokenHash,
		expiresAt
	});

	return token;
}

export async function validateSession(token: string): Promise<SessionUser | null> {
	const tokenHash = await sha256Hex(token);

	const result = await db
		.select()
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
		.limit(1);

	if (result.length === 0) return null;

	const user = result[0].users;
	if (!user.isActive) return null;

	// Load permissions
	const userPerms = await db
		.select({ codename: permissions.codename })
		.from(userGroups)
		.innerJoin(groupPermissions, eq(userGroups.groupId, groupPermissions.groupId))
		.innerJoin(permissions, eq(groupPermissions.permissionId, permissions.id))
		.where(eq(userGroups.userId, user.id));

	return {
		id: user.id,
		email: user.email,
		displayName: user.displayName,
		isSuperuser: user.isSuperuser,
		permissions: userPerms.map((p) => p.codename)
	};
}

export async function invalidateSession(token: string): Promise<void> {
	const tokenHash = await sha256Hex(token);
	await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function authenticateUser(
	email: string,
	password: string
): Promise<{ id: string } | null> {
	const result = await db
		.select()
		.from(users)
		.where(and(eq(users.email, email), eq(users.isActive, true), isNull(users.deletedAt)))
		.limit(1);

	if (result.length === 0) return null;

	const user = result[0];
	const valid = await verifyPassword(user.passwordHash, password);
	if (!valid) return null;

	return { id: user.id };
}
