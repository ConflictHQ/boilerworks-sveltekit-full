<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>{data.form.name} - Boilerworks</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">{data.form.name}</h1>
	<div class="flex gap-3">
		<a href="/forms/{data.form.id}/submit"
			class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white">
			Submit Entry
		</a>
		<form method="POST" action="?/delete">
			<button type="submit" class="bg-bw-danger/10 text-bw-danger hover:bg-bw-danger/20 rounded px-4 py-2 text-sm font-medium"
				onclick={(e) => { if (!confirm('Are you sure?')) e.preventDefault(); }}>
				Delete
			</button>
		</form>
	</div>
</div>

<div class="bg-bw-surface border-bw-border mb-6 rounded-lg border p-6">
	<dl class="grid grid-cols-2 gap-4">
		<div>
			<dt class="text-bw-text-muted text-sm">Slug</dt>
			<dd class="font-mono text-sm">{data.form.slug}</dd>
		</div>
		<div>
			<dt class="text-bw-text-muted text-sm">Status</dt>
			<dd>
				{#if data.form.isPublished}
					<span class="bg-bw-success/10 text-bw-success rounded px-2 py-0.5 text-xs">Published</span>
				{:else}
					<span class="bg-bw-warning/10 text-bw-warning rounded px-2 py-0.5 text-xs">Draft</span>
				{/if}
			</dd>
		</div>
		<div class="col-span-2">
			<dt class="text-bw-text-muted text-sm">Description</dt>
			<dd class="text-sm">{data.form.description ?? '—'}</dd>
		</div>
		<div class="col-span-2">
			<dt class="text-bw-text-muted mb-1 text-sm">Schema</dt>
			<dd class="bg-bw-bg rounded p-3 font-mono text-xs">
				<pre>{JSON.stringify(data.form.schema, null, 2)}</pre>
			</dd>
		</div>
	</dl>
</div>

<h2 class="mb-4 text-lg font-bold">Submissions ({data.submissions.length})</h2>

<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">ID</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Data</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Submitted At</th>
			</tr>
		</thead>
		<tbody>
			{#each data.submissions as sub}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="text-bw-text-muted px-4 py-3 font-mono text-xs">{sub.id.slice(0, 8)}...</td>
					<td class="px-4 py-3 font-mono text-xs">{JSON.stringify(sub.data)}</td>
					<td class="text-bw-text-muted px-4 py-3 text-sm">{new Date(sub.createdAt).toLocaleString()}</td>
				</tr>
			{:else}
				<tr>
					<td colspan="3" class="text-bw-text-muted px-4 py-8 text-center text-sm">No submissions yet</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<a href="/forms" class="text-bw-text-muted hover:text-bw-text mt-4 inline-block text-sm">&larr; Back to Forms</a>
