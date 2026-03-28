<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>{data.group.name} - Admin - Boilerworks</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-2 text-2xl font-bold">{data.group.name}</h1>
	<p class="text-bw-text-muted mb-6 text-sm">{data.group.description ?? ''}</p>

	<h2 class="mb-3 text-lg font-semibold">Permissions ({data.permissions.length})</h2>
	<div class="bg-bw-surface border-bw-border rounded-lg border">
		{#each data.permissions as perm}
			<div class="border-bw-border border-b px-4 py-2 last:border-0">
				<span class="font-mono text-sm">{perm.codename}</span>
			</div>
		{:else}
			<div class="text-bw-text-muted px-4 py-8 text-center text-sm">No permissions assigned</div>
		{/each}
	</div>

	<a href="/admin/groups" class="text-bw-text-muted hover:text-bw-text mt-4 inline-block text-sm">&larr; Back to Groups</a>
</div>
