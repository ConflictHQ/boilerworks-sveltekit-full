<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<svelte:head>
	<title>New Item - Boilerworks</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-6 text-2xl font-bold">New Item</h1>

	{#if form?.error}
		<div class="bg-bw-danger/10 text-bw-danger mb-4 rounded p-3 text-sm">{form.error}</div>
	{/if}

	<form method="POST" class="bg-bw-surface border-bw-border space-y-4 rounded-lg border p-6">
		<div>
			<label for="name" class="text-bw-text-muted mb-1 block text-sm">Name</label>
			<input
				type="text"
				name="name"
				id="name"
				required
				value={form?.name ?? ''}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			/>
		</div>

		<div>
			<label for="slug" class="text-bw-text-muted mb-1 block text-sm">Slug</label>
			<input
				type="text"
				name="slug"
				id="slug"
				required
				value={form?.slug ?? ''}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			/>
		</div>

		<div>
			<label for="description" class="text-bw-text-muted mb-1 block text-sm">Description</label>
			<textarea
				name="description"
				id="description"
				rows="3"
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
				>{form?.description ?? ''}</textarea
			>
		</div>

		<div>
			<label for="price" class="text-bw-text-muted mb-1 block text-sm">Price ($)</label>
			<input
				type="number"
				name="price"
				id="price"
				step="0.01"
				min="0"
				value={form?.price ?? '0.00'}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			/>
		</div>

		<div>
			<label for="category_id" class="text-bw-text-muted mb-1 block text-sm">Category</label>
			<select
				name="category_id"
				id="category_id"
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none"
			>
				<option value="">— None —</option>
				{#each data.categories as cat}
					<option value={cat.id} selected={form?.categoryId === cat.id}>{cat.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center gap-2">
			<input type="checkbox" name="is_published" id="is_published" class="rounded" />
			<label for="is_published" class="text-bw-text-muted text-sm">Published</label>
		</div>

		<div class="flex gap-3">
			<button
				type="submit"
				class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white"
			>
				Create Item
			</button>
			<a href="/items" class="text-bw-text-muted hover:text-bw-text rounded px-4 py-2 text-sm"
				>Cancel</a
			>
		</div>
	</form>
</div>
