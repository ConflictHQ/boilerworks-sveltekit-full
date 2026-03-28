import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { invalidateSession } from '$lib/server/auth/index.js';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await invalidateSession(token);
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/login');
	}
};
