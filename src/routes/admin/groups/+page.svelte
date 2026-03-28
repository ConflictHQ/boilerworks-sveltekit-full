<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Groups - Admin - Boilerworks</title>
</svelte:head>

<h1 class="mb-6 text-2xl font-bold">Groups</h1>

<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Name</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Description</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium"></th>
			</tr>
		</thead>
		<tbody>
			{#each data.groups as group}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="px-4 py-3 text-sm font-medium">{group.name}</td>
					<td class="text-bw-text-muted px-4 py-3 text-sm">{group.description ?? '—'}</td>
					<td class="px-4 py-3 text-right text-sm">
						<a href="/admin/groups/{group.id}" class="text-bw-accent hover:underline">Manage</a>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="3" class="text-bw-text-muted px-4 py-8 text-center text-sm">No groups</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
