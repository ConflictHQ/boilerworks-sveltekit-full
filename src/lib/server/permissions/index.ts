import { error, redirect } from '@sveltejs/kit';
import type { SessionUser } from '$lib/server/auth/index.js';

export function requireAuth(user: SessionUser | null): SessionUser {
	if (!user) {
		throw redirect(303, '/login');
	}
	return user;
}

export function requirePermission(user: SessionUser | null, permission: string): SessionUser {
	const authed = requireAuth(user);
	if (authed.isSuperuser) return authed;
	if (!authed.permissions.includes(permission)) {
		throw error(403, 'Forbidden');
	}
	return authed;
}

export function requireSuperuser(user: SessionUser | null): SessionUser {
	const authed = requireAuth(user);
	if (!authed.isSuperuser) {
		throw error(403, 'Forbidden');
	}
	return authed;
}

export function hasPermission(user: SessionUser | null, permission: string): boolean {
	if (!user) return false;
	if (user.isSuperuser) return true;
	return user.permissions.includes(permission);
}
