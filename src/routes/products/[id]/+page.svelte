<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	function formatPrice(cents: number): string {
		return (cents / 100).toFixed(2);
	}
</script>

<svelte:head>
	<title>{data.product.name} - Boilerworks</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">{data.product.name}</h1>
	<div class="flex gap-3">
		<a href="/products/{data.product.id}/edit"
			class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white">
			Edit
		</a>
		<form method="POST" action="?/delete">
			<button type="submit" class="bg-bw-danger/10 text-bw-danger hover:bg-bw-danger/20 rounded px-4 py-2 text-sm font-medium"
				onclick={(e) => { if (!confirm('Are you sure?')) e.preventDefault(); }}>
				Delete
			</button>
		</form>
	</div>
</div>

<div class="bg-bw-surface border-bw-border rounded-lg border p-6">
	<dl class="grid grid-cols-2 gap-4">
		<div>
			<dt class="text-bw-text-muted text-sm">Slug</dt>
			<dd class="font-mono text-sm">{data.product.slug}</dd>
		</div>
		<div>
			<dt class="text-bw-text-muted text-sm">Price</dt>
			<dd>${formatPrice(data.product.price)}</dd>
		</div>
		<div>
			<dt class="text-bw-text-muted text-sm">Category</dt>
			<dd>{data.product.categoryName ?? '—'}</dd>
		</div>
		<div>
			<dt class="text-bw-text-muted text-sm">Status</dt>
			<dd>
				{#if data.product.isPublished}
					<span class="bg-bw-success/10 text-bw-success rounded px-2 py-0.5 text-xs">Published</span>
				{:else}
					<span class="bg-bw-warning/10 text-bw-warning rounded px-2 py-0.5 text-xs">Draft</span>
				{/if}
			</dd>
		</div>
		<div class="col-span-2">
			<dt class="text-bw-text-muted text-sm">Description</dt>
			<dd class="text-sm">{data.product.description ?? '—'}</dd>
		</div>
	</dl>
</div>

<a href="/products" class="text-bw-text-muted hover:text-bw-text mt-4 inline-block text-sm">&larr; Back to Products</a>
