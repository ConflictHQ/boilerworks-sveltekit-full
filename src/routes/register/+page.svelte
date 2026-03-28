<script lang="ts">
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="bg-bw-surface border-bw-border w-full max-w-md rounded-lg border p-8">
		<h1 class="text-bw-text mb-6 text-2xl font-bold">Create an Account</h1>

		{#if form?.error}
			<div class="bg-bw-danger/10 text-bw-danger mb-4 rounded p-3 text-sm">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="display_name" class="text-bw-text-muted mb-1 block text-sm">Display Name</label>
				<input
					type="text"
					name="display_name"
					id="display_name"
					value={form?.displayName ?? ''}
					required
					class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
				/>
			</div>

			<div>
				<label for="email" class="text-bw-text-muted mb-1 block text-sm">Email</label>
				<input
					type="email"
					name="email"
					id="email"
					value={form?.email ?? ''}
					required
					class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
				/>
			</div>

			<div>
				<label for="password" class="text-bw-text-muted mb-1 block text-sm">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					required
					minlength="8"
					class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				class="bg-bw-accent hover:bg-bw-accent-hover w-full rounded px-4 py-2 font-medium text-white"
			>
				Create Account
			</button>
		</form>

		<p class="text-bw-text-muted mt-4 text-center text-sm">
			Already have an account? <a href="/login" class="text-bw-accent hover:underline">Sign in</a>
		</p>
	</div>
</div>
