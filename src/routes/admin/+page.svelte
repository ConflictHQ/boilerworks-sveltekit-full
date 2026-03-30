<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Admin - Boilerworks</title>
</svelte:head>

<h1 class="mb-8 text-2xl font-bold">Admin Panel</h1>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
	<a
		href="/admin/users"
		class="bg-bw-surface border-bw-border hover:border-bw-accent rounded-lg border p-6 transition"
	>
		<div class="text-bw-text-muted text-sm">Users</div>
		<div class="text-3xl font-bold">{data.stats.users}</div>
	</a>

	<a
		href="/admin/groups"
		class="bg-bw-surface border-bw-border hover:border-bw-accent rounded-lg border p-6 transition"
	>
		<div class="text-bw-text-muted text-sm">Groups</div>
		<div class="text-3xl font-bold">{data.stats.groups}</div>
	</a>

	<div class="bg-bw-surface border-bw-border rounded-lg border p-6">
		<div class="text-bw-text-muted text-sm">Active Sessions</div>
		<div class="text-3xl font-bold">{data.stats.sessions}</div>
	</div>
</div>
