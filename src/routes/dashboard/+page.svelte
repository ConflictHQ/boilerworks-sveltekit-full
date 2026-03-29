<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Dashboard - Boilerworks</title>
</svelte:head>

<h1 class="mb-8 text-2xl font-bold">Dashboard</h1>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
	<a href="/items" class="bg-bw-surface border-bw-border hover:border-bw-accent rounded-lg border p-6 transition">
		<div class="text-bw-text-muted text-sm">Items</div>
		<div class="text-3xl font-bold">{data.stats.items}</div>
	</a>

	<a href="/categories" class="bg-bw-surface border-bw-border hover:border-bw-accent rounded-lg border p-6 transition">
		<div class="text-bw-text-muted text-sm">Categories</div>
		<div class="text-3xl font-bold">{data.stats.categories}</div>
	</a>

	<a href="/forms" class="bg-bw-surface border-bw-border hover:border-bw-accent rounded-lg border p-6 transition">
		<div class="text-bw-text-muted text-sm">Forms</div>
		<div class="text-3xl font-bold">{data.stats.forms}</div>
	</a>

	<a href="/workflows" class="bg-bw-surface border-bw-border hover:border-bw-accent rounded-lg border p-6 transition">
		<div class="text-bw-text-muted text-sm">Workflow Instances</div>
		<div class="text-3xl font-bold">{data.stats.workflows}</div>
	</a>
</div>
