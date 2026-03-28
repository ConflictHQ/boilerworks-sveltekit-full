<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	type SchemaProperty = {
		type: string;
		title?: string;
		format?: string;
	};

	let schema = $derived(data.form.schema as {
		properties: Record<string, SchemaProperty>;
		required?: string[];
	});

	function getFieldErrors(field: string): string[] {
		if (!form?.errors) return [];
		return form.errors
			.filter((e: { field: string; message: string }) => e.field === field)
			.map((e: { field: string; message: string }) => e.message);
	}
</script>

<svelte:head>
	<title>Submit {data.form.name} - Boilerworks</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-2 text-2xl font-bold">{data.form.name}</h1>
	{#if data.form.description}
		<p class="text-bw-text-muted mb-6 text-sm">{data.form.description}</p>
	{/if}

	<form method="POST" class="bg-bw-surface border-bw-border space-y-4 rounded-lg border p-6">
		{#each Object.entries(schema.properties) as [field, spec]}
			<div>
				<label for={field} class="text-bw-text-muted mb-1 block text-sm">
					{spec.title ?? field}
					{#if schema.required?.includes(field)}<span class="text-bw-danger">*</span>{/if}
				</label>

				{#if spec.type === 'string' && !spec.format}
					<input type="text" name={field} id={field}
						value={form?.data?.[field] ?? ''}
						class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none" />
				{:else if spec.format === 'email'}
					<input type="email" name={field} id={field}
						value={form?.data?.[field] ?? ''}
						class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none" />
				{:else}
					<input type="text" name={field} id={field}
						value={form?.data?.[field] ?? ''}
						class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none" />
				{/if}

				{#each getFieldErrors(field) as err}
					<p class="text-bw-danger mt-1 text-xs">{err}</p>
				{/each}
			</div>
		{/each}

		<div class="flex gap-3">
			<button type="submit" class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white">
				Submit
			</button>
			<a href="/forms/{data.form.id}" class="text-bw-text-muted hover:text-bw-text rounded px-4 py-2 text-sm">Cancel</a>
		</div>
	</form>
</div>
