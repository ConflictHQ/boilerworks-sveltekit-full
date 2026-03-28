<script lang="ts">
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();

	const defaultSchema = JSON.stringify({
		type: 'object',
		required: ['name', 'email'],
		properties: {
			name: { type: 'string', title: 'Name' },
			email: { type: 'string', format: 'email', title: 'Email' }
		}
	}, null, 2);
</script>

<svelte:head>
	<title>New Form - Boilerworks</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-6 text-2xl font-bold">New Form Definition</h1>

	{#if form?.error}
		<div class="bg-bw-danger/10 text-bw-danger mb-4 rounded p-3 text-sm">{form.error}</div>
	{/if}

	<form method="POST" class="bg-bw-surface border-bw-border space-y-4 rounded-lg border p-6">
		<div>
			<label for="name" class="text-bw-text-muted mb-1 block text-sm">Name</label>
			<input type="text" name="name" id="name" required value={form?.name ?? ''}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none" />
		</div>

		<div>
			<label for="slug" class="text-bw-text-muted mb-1 block text-sm">Slug</label>
			<input type="text" name="slug" id="slug" required value={form?.slug ?? ''}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none" />
		</div>

		<div>
			<label for="description" class="text-bw-text-muted mb-1 block text-sm">Description</label>
			<textarea name="description" id="description" rows="2"
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			>{form?.description ?? ''}</textarea>
		</div>

		<div>
			<label for="schema" class="text-bw-text-muted mb-1 block text-sm">JSON Schema</label>
			<textarea name="schema" id="schema" rows="12" required
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 font-mono text-sm focus:outline-none"
			>{form?.schema ?? defaultSchema}</textarea>
		</div>

		<div class="flex items-center gap-2">
			<input type="checkbox" name="is_published" id="is_published" class="rounded" />
			<label for="is_published" class="text-bw-text-muted text-sm">Published</label>
		</div>

		<div class="flex gap-3">
			<button type="submit" class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white">
				Create Form
			</button>
			<a href="/forms" class="text-bw-text-muted hover:text-bw-text rounded px-4 py-2 text-sm">Cancel</a>
		</div>
	</form>
</div>
