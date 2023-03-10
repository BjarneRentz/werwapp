<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { playerStore } from '$lib/stores/player';
	import { gameStore, type GameRole } from '$lib/stores/game';
	import { startFirstNightPhase } from '$lib/game';
	import { isUtility, roleAddable, roleRemovable, rolesValid } from '$lib/roles';

	import RoleListItem from './role-list-item.svelte';
	import RoleImage from './role-image.svelte';

	$: ({ currentPhaseSong } = $playerStore);

	$: buttonLabel = currentPhaseSong ? $t('game.start') : $t('game.load');

	const removeRole = (role: GameRole) => () => {
		if (!role.amount || role.amount === 0) {
			return;
		}

		role.amount = role.amount - 1;
		$gameStore.roles.add(role);

		gameStore.updateStore({ roles: $gameStore.roles });
	};

	const addRole = (role: GameRole) => () => {
		role.amount = (role.amount ?? 0) + 1;
		$gameStore.roles.add(role);

		gameStore.updateStore({ roles: $gameStore.roles });
	};

	$: rolesArray = [...$gameStore.roles].filter((role): role is GameRole => !isUtility(role));

	$: addableRoles = rolesArray.filter(({ name }) => roleAddable(rolesArray, name));
	$: usedRoles = rolesArray.filter(({ amount }) => amount > 0);
</script>

<!-- This is needed because daisy ui requires the tabindex -->
<!-- svelte-ignore a11y-label-has-associated-control -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->

<div class="h-full flex flex-col items-center justify-between">
	<div>
		<h2 class="mb-3">{$t('narrator.selected')}</h2>

		<div class="grid grid-cols-3 sm:grid-cols-4 gap-5">
			{#each usedRoles as role}
				<button disabled={!roleRemovable(rolesArray, role.name)} on:click={removeRole(role)}>
					<RoleImage {role} />
				</button>
			{/each}
		</div>
	</div>

	<div class="flex gap-5">
		<button
			class="btn btn-primary"
			disabled={!$playerStore.currentPhaseSong || !rolesValid(rolesArray)}
			on:click={startFirstNightPhase}
		>
			{buttonLabel}
		</button>

		<div class="dropdown dropdown-top dropdown-end">
			<label tabindex="0" class="btn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill={'hsl(var(--nc) / var(--tw-text-opacity))'}
				>
					<path
						d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm2-10h4V7h2v4h4v2h-4v4h-2v-4H7v-2z"
					/>
				</svg>
			</label>

			<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box mb-1">
				{#each addableRoles as role}
					<li class="mb-1">
						<RoleListItem on:click={addRole(role)} {role} />
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
