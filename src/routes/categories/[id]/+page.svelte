<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>{data.category.name} - Boilerworks</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">{data.category.name}</h1>
	<div class="flex gap-3">
		<a
			href="/categories/{data.category.id}/edit"
			class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white"
		>
			Edit
		</a>
		<form method="POST" action="?/delete">
			<button
				type="submit"
				class="bg-bw-danger/10 text-bw-danger hover:bg-bw-danger/20 rounded px-4 py-2 text-sm font-medium"
				onclick={(e) => {
					if (!confirm('Are you sure?')) e.preventDefault();
				}}
			>
				Delete
			</button>
		</form>
	</div>
</div>

<div class="bg-bw-surface border-bw-border rounded-lg border p-6">
	<dl class="grid grid-cols-2 gap-4">
		<div>
			<dt class="text-bw-text-muted text-sm">Slug</dt>
			<dd class="font-mono text-sm">{data.category.slug}</dd>
		</div>
		<div class="col-span-2">
			<dt class="text-bw-text-muted text-sm">Description</dt>
			<dd class="text-sm">{data.category.description ?? '—'}</dd>
		</div>
	</dl>
</div>

<a href="/categories" class="text-bw-text-muted hover:text-bw-text mt-4 inline-block text-sm"
	>&larr; Back to Categories</a
>
