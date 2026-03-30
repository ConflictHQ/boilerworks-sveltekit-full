<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Categories - Boilerworks</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Categories</h1>
	<a
		href="/categories/new"
		class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white"
	>
		New Category
	</a>
</div>

<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Name</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Slug</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Description</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium"></th>
			</tr>
		</thead>
		<tbody>
			{#each data.categories as category}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="px-4 py-3 text-sm">{category.name}</td>
					<td class="text-bw-text-muted px-4 py-3 font-mono text-sm">{category.slug}</td>
					<td class="text-bw-text-muted px-4 py-3 text-sm">{category.description ?? '—'}</td>
					<td class="px-4 py-3 text-right text-sm">
						<a href="/categories/{category.id}" class="text-bw-accent hover:underline">View</a>
						<a href="/categories/{category.id}/edit" class="text-bw-accent hover:underline ml-3"
							>Edit</a
						>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="4" class="text-bw-text-muted px-4 py-8 text-center text-sm"
						>No categories yet</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
