import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { authenticateUser, createSession } from '$lib/server/auth/index.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/dashboard');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const user = await authenticateUser(email, password);
		if (!user) {
			return fail(400, { error: 'Invalid email or password', email });
		}

		const token = await createSession(user.id);
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false, // Set to true in production
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, '/dashboard');
	}
};
