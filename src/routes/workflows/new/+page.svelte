<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<svelte:head>
	<title>New Workflow Instance - Boilerworks</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-6 text-2xl font-bold">Start New Workflow Instance</h1>

	{#if form?.error}
		<div class="bg-bw-danger/10 text-bw-danger mb-4 rounded p-3 text-sm">{form.error}</div>
	{/if}

	<form method="POST" class="bg-bw-surface border-bw-border space-y-4 rounded-lg border p-6">
		<div>
			<label for="definition_id" class="text-bw-text-muted mb-1 block text-sm"
				>Workflow Definition</label
			>
			<select
				name="definition_id"
				id="definition_id"
				required
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			>
				<option value="">Select a workflow...</option>
				{#each data.definitions as def}
					<option value={def.id}>{def.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex gap-3">
			<button
				type="submit"
				class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white"
			>
				Start Instance
			</button>
			<a href="/workflows" class="text-bw-text-muted hover:text-bw-text rounded px-4 py-2 text-sm"
				>Cancel</a
			>
		</div>
	</form>
</div>
