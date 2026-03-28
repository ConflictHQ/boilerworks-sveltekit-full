import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { hashPassword, createSession } from '$lib/server/auth/index.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/dashboard');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = (formData.get('email') as string)?.trim();
		const password = formData.get('password') as string;
		const displayName = (formData.get('display_name') as string)?.trim();

		if (!email || !password || !displayName) {
			return fail(400, { error: 'All fields are required', email, displayName });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', email, displayName });
		}

		const passwordHash = await hashPassword(password);

		try {
			const [user] = await db
				.insert(users)
				.values({ email, passwordHash, displayName })
				.returning({ id: users.id });

			const token = await createSession(user.id);
			cookies.set('session', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false,
				maxAge: 30 * 24 * 60 * 60
			});

			throw redirect(303, '/dashboard');
		} catch (err) {
			if (err instanceof Error && err.message.includes('unique')) {
				return fail(400, { error: 'Email already in use', email, displayName });
			}
			throw err;
		}
	}
};
