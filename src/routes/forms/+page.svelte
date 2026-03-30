<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Forms - Boilerworks</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Form Definitions</h1>
	<a
		href="/forms/new"
		class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white"
	>
		New Form
	</a>
</div>

<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Name</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Slug</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Status</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium"></th>
			</tr>
		</thead>
		<tbody>
			{#each data.forms as form}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="px-4 py-3 text-sm">{form.name}</td>
					<td class="text-bw-text-muted px-4 py-3 font-mono text-sm">{form.slug}</td>
					<td class="px-4 py-3 text-sm">
						{#if form.isPublished}
							<span class="bg-bw-success/10 text-bw-success rounded px-2 py-0.5 text-xs"
								>Published</span
							>
						{:else}
							<span class="bg-bw-warning/10 text-bw-warning rounded px-2 py-0.5 text-xs">Draft</span
							>
						{/if}
					</td>
					<td class="px-4 py-3 text-right text-sm">
						<a href="/forms/{form.id}" class="text-bw-accent hover:underline">View</a>
						<a href="/forms/{form.id}/submit" class="text-bw-accent hover:underline ml-3">Submit</a>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="4" class="text-bw-text-muted px-4 py-8 text-center text-sm">No forms yet</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
