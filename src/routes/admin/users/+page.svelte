<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Users - Admin - Boilerworks</title>
</svelte:head>

<h1 class="mb-6 text-2xl font-bold">Users</h1>

<div class="bg-bw-surface border-bw-border overflow-hidden rounded-lg border">
	<table class="w-full">
		<thead>
			<tr class="border-bw-border border-b">
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Name</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Email</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Status</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium">Role</th>
				<th class="text-bw-text-muted px-4 py-3 text-left text-sm font-medium"></th>
			</tr>
		</thead>
		<tbody>
			{#each data.users as user}
				<tr class="border-bw-border hover:bg-bw-surface-hover border-b last:border-0">
					<td class="px-4 py-3 text-sm">{user.displayName}</td>
					<td class="text-bw-text-muted px-4 py-3 text-sm">{user.email}</td>
					<td class="px-4 py-3 text-sm">
						{#if user.isActive}
							<span class="bg-bw-success/10 text-bw-success rounded px-2 py-0.5 text-xs">Active</span>
						{:else}
							<span class="bg-bw-danger/10 text-bw-danger rounded px-2 py-0.5 text-xs">Inactive</span>
						{/if}
					</td>
					<td class="px-4 py-3 text-sm">
						{#if user.isSuperuser}
							<span class="bg-bw-warning/10 text-bw-warning rounded px-2 py-0.5 text-xs">Superuser</span>
						{:else}
							<span class="text-bw-text-muted text-xs">User</span>
						{/if}
					</td>
					<td class="px-4 py-3 text-right text-sm">
						<a href="/admin/users/{user.id}" class="text-bw-accent hover:underline">Edit</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
