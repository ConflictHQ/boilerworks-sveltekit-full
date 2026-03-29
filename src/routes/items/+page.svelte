<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	function formatPrice(cents: number): string {
		return (cents / 100).toFixed(2);
	}
</script>

<svelte:head>
	<title>Items - Boilerworks</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Items</h1>
	<a
		href="/items/new"
		class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white"
	>
		New Item
	</a>
</div>

<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Name</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Category</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Price</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Status</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium"></th>
			</tr>
		</thead>
		<tbody>
			{#each data.items as item}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="px-4 py-3 text-sm">{item.name}</td>
					<td class="text-bw-text-muted px-4 py-3 text-sm">{item.categoryName ?? '—'}</td>
					<td class="px-4 py-3 text-sm">${formatPrice(item.price)}</td>
					<td class="px-4 py-3 text-sm">
						{#if item.isPublished}
							<span class="bg-bw-success/10 text-bw-success rounded px-2 py-0.5 text-xs">Published</span>
						{:else}
							<span class="bg-bw-warning/10 text-bw-warning rounded px-2 py-0.5 text-xs">Draft</span>
						{/if}
					</td>
					<td class="px-4 py-3 text-right text-sm">
						<a href="/items/{item.id}" class="text-bw-accent hover:underline">View</a>
						<a href="/items/{item.id}/edit" class="text-bw-accent hover:underline ml-3">Edit</a>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="5" class="text-bw-text-muted px-4 py-8 text-center text-sm">No items yet</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
