<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children } = $props<{ data: LayoutData; children: any }>();
</script>

{#if data.user}
	<div class="flex min-h-screen">
		<!-- Sidebar -->
		<aside class="bg-bw-surface border-bw-border w-64 border-r">
			<div class="p-4">
				<a href="/dashboard" class="text-bw-accent text-xl font-bold">Boilerworks</a>
			</div>
			<nav class="mt-4 space-y-1 px-2">
				<a
					href="/dashboard"
					class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
				>
					Dashboard
				</a>
				<a
					href="/products"
					class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
				>
					Products
				</a>
				<a
					href="/categories"
					class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
				>
					Categories
				</a>
				<a
					href="/forms"
					class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
				>
					Forms
				</a>
				<a
					href="/workflows"
					class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
				>
					Workflows
				</a>

				{#if data.user.isSuperuser}
					<div class="border-bw-border my-3 border-t"></div>
					<span class="text-bw-text-muted px-3 text-xs font-semibold uppercase">Admin</span>
					<a
						href="/admin"
						class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
					>
						Admin Panel
					</a>
					<a
						href="/admin/users"
						class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
					>
						Users
					</a>
					<a
						href="/admin/groups"
						class="hover:bg-bw-surface-hover text-bw-text-muted hover:text-bw-text block rounded px-3 py-2 text-sm"
					>
						Groups
					</a>
				{/if}
			</nav>

			<div class="border-bw-border absolute bottom-0 w-64 border-t p-4">
				<div class="text-bw-text text-sm">{data.user.displayName}</div>
				<div class="text-bw-text-muted text-xs">{data.user.email}</div>
				<form method="POST" action="/logout" class="mt-2">
					<button
						type="submit"
						class="text-bw-text-muted hover:text-bw-danger text-xs"
					>
						Sign out
					</button>
				</form>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-auto p-8">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}
