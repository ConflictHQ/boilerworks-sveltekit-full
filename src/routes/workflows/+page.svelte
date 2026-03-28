<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Workflows - Boilerworks</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Workflows</h1>
	<a href="/workflows/new" class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white">
		New Instance
	</a>
</div>

<h2 class="mb-3 text-lg font-semibold">Definitions</h2>
<div class="bg-bw-surface border-bw-border mb-8 overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Name</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Slug</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Initial State</th>
			</tr>
		</thead>
		<tbody>
			{#each data.definitions as def}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="px-4 py-3 text-sm">{def.name}</td>
					<td class="text-bw-text-muted px-4 py-3 font-mono text-sm">{def.slug}</td>
					<td class="px-4 py-3 text-sm">
						<span class="bg-bw-accent/10 text-bw-accent rounded px-2 py-0.5 text-xs">{def.initialState}</span>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="3" class="text-bw-text-muted px-4 py-8 text-center text-sm">No workflow definitions</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<h2 class="mb-3 text-lg font-semibold">Instances</h2>
<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">ID</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Workflow</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Current State</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium"></th>
			</tr>
		</thead>
		<tbody>
			{#each data.instances as inst}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="text-bw-text-muted px-4 py-3 font-mono text-xs">{inst.id.slice(0, 8)}...</td>
					<td class="px-4 py-3 text-sm">{inst.definitionName}</td>
					<td class="px-4 py-3 text-sm">
						<span class="bg-bw-accent/10 text-bw-accent rounded px-2 py-0.5 text-xs">{inst.currentState}</span>
					</td>
					<td class="px-4 py-3 text-right text-sm">
						<a href="/workflows/{inst.id}" class="text-bw-accent hover:underline">Manage</a>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="4" class="text-bw-text-muted px-4 py-8 text-center text-sm">No workflow instances</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
