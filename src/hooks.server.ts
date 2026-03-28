import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth/index.js';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (token) {
		try {
			event.locals.user = await validateSession(token);
		} catch {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	const response = await resolve(event);

	// Security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};
