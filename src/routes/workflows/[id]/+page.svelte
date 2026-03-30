<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<svelte:head>
	<title>Workflow: {data.definition.name} - Boilerworks</title>
</svelte:head>

<h1 class="mb-2 text-2xl font-bold">{data.definition.name}</h1>
<p class="text-bw-text-muted mb-6 text-sm">Instance: {data.instance.id.slice(0, 8)}...</p>

{#if form?.error}
	<div class="bg-bw-danger/10 text-bw-danger mb-4 rounded p-3 text-sm">{form.error}</div>
{/if}

<div class="bg-bw-surface border-bw-border mb-6 rounded-lg border p-6">
	<div class="mb-4">
		<span class="text-bw-text-muted text-sm">Current State:</span>
		<span class="bg-bw-accent/10 text-bw-accent ml-2 rounded px-3 py-1 text-sm font-medium"
			>{data.instance.currentState}</span
		>
	</div>

	{#if data.transitions.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each data.transitions as transition}
				<form method="POST" action="?/transition" class="inline">
					<input type="hidden" name="to_state" value={transition.to} />
					<button
						type="submit"
						class="bg-bw-surface-hover border-bw-border hover:border-bw-accent rounded border px-4 py-2 text-sm transition"
					>
						{transition.label}
					</button>
				</form>
			{/each}
		</div>
	{:else}
		<p class="text-bw-text-muted text-sm">No transitions available from this state.</p>
	{/if}
</div>

<h2 class="mb-3 text-lg font-semibold">Transition History</h2>
<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">From</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">To</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">When</th>
			</tr>
		</thead>
		<tbody>
			{#each data.history as log}
				<tr class="border-bw-border border-b last:border-0">
					<td class="px-4 py-3 text-sm">
						<span class="bg-bw-surface-hover rounded px-2 py-0.5 text-xs">{log.fromState}</span>
					</td>
					<td class="px-4 py-3 text-sm">
						<span class="bg-bw-accent/10 text-bw-accent rounded px-2 py-0.5 text-xs"
							>{log.toState}</span
						>
					</td>
					<td class="text-bw-text-muted px-4 py-3 text-sm"
						>{new Date(log.createdAt).toLocaleString()}</td
					>
				</tr>
			{:else}
				<tr>
					<td colspan="3" class="text-bw-text-muted px-4 py-8 text-center text-sm"
						>No transitions yet</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<a href="/workflows" class="text-bw-text-muted hover:text-bw-text mt-4 inline-block text-sm"
	>&larr; Back to Workflows</a
>
