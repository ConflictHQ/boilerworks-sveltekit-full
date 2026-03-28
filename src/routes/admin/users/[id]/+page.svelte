<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<svelte:head>
	<title>Edit User - Admin - Boilerworks</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-6 text-2xl font-bold">Edit User: {data.targetUser.displayName}</h1>

	{#if form?.error}
		<div class="bg-bw-danger/10 text-bw-danger mb-4 rounded p-3 text-sm">{form.error}</div>
	{/if}

	<form method="POST" action="?/update" class="bg-bw-surface border-bw-border space-y-4 rounded-lg border p-6">
		<div>
			<label for="display_name" class="text-bw-text-muted mb-1 block text-sm">Display Name</label>
			<input type="text" name="display_name" id="display_name" required value={data.targetUser.displayName}
				class="bg-bw-bg border-bw-border text-bw-text focus:border-bw-accent w-full rounded border px-3 py-2 focus:outline-none" />
		</div>

		<div>
			<label for="email" class="text-bw-text-muted mb-1 block text-sm">Email</label>
			<input type="email" id="email" disabled value={data.targetUser.email}
				class="bg-bw-bg border-bw-border text-bw-text-muted w-full rounded border px-3 py-2" />
		</div>

		<div class="flex items-center gap-4">
			<div class="flex items-center gap-2">
				<input type="checkbox" name="is_active" id="is_active" checked={data.targetUser.isActive} class="rounded" />
				<label for="is_active" class="text-bw-text-muted text-sm">Active</label>
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" name="is_superuser" id="is_superuser" checked={data.targetUser.isSuperuser} class="rounded" />
				<label for="is_superuser" class="text-bw-text-muted text-sm">Superuser</label>
			</div>
		</div>

		<div>
			<span class="text-bw-text-muted mb-2 block text-sm">Groups</span>
			<div class="space-y-1">
				{#each data.groups as group}
					<div class="flex items-center gap-2">
						<input type="checkbox" name="group_ids" value={group.id}
							checked={data.memberGroupIds.includes(group.id)} class="rounded" />
						<span class="text-sm">{group.name}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex gap-3">
			<button type="submit" class="bg-bw-accent hover:bg-bw-accent-hover rounded px-4 py-2 text-sm font-medium text-white">
				Save Changes
			</button>
			<a href="/admin/users" class="text-bw-text-muted hover:text-bw-text rounded px-4 py-2 text-sm">Cancel</a>
		</div>
	</form>

	<form method="POST" action="?/deactivate" class="mt-6">
		<button type="submit" class="bg-bw-danger/10 text-bw-danger hover:bg-bw-danger/20 rounded px-4 py-2 text-sm font-medium"
			onclick={(e) => { if (!confirm('Are you sure you want to deactivate this user?')) e.preventDefault(); }}>
			Deactivate User
		</button>
	</form>
</div>
