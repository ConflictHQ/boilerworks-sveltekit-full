<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<svelte:head>
	<title>Edit {data.category.name} - Boilerworks</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-6 text-2xl font-bold">Edit Category</h1>

	{#if form?.error}
		<div class="bg-bw-danger/10 text-bw-danger mb-4 rounded p-3 text-sm">{form.error}</div>
	{/if}

	<form method="POST" class="bg-bw-surface border-bw-border space-y-4 rounded-lg border p-6">
		<div>
			<label for="name" class="text-bw-text-muted mb-1 block text-sm">Name</label>
			<input
				type="text"
				name="name"
				id="name"
				required
				value={data.category.name}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			/>
		</div>

		<div>
			<label for="slug" class="text-bw-text-muted mb-1 block text-sm">Slug</label>
			<input
				type="text"
				name="slug"
				id="slug"
				required
				value={data.category.slug}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			/>
		</div>

		<div>
			<label for="description" class="text-bw-text-muted mb-1 block text-sm">Description</label>
			<textarea
				name="description"
				id="description"
				rows="3"
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
				>{data.category.description ?? ''}</textarea
			>
		</div>

		<div class="flex gap-3">
			<button
				type="submit"
				class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white"
			>
				Save Changes
			</button>
			<a
				href="/categories/{data.category.id}"
				class="text-bw-text-muted hover:text-bw-text rounded px-4 py-2 text-sm">Cancel</a
			>
		</div>
	</form>
</div>
