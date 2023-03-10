<script lang="ts">
	import { onMount } from 'svelte';

	import { t } from '$lib/stores/i18n';
	import { registerSwipeGestures } from '$lib/swipe';
	import { gameStore } from '$lib/stores/game';
	import { mountWakeLock } from '$lib/stores/wakelock';

	import Forest from '../components/forest.svelte';
	import Settings from '../components/settings.svelte';
	import Setup from '../components/setup.svelte';
	import Narrator from '../components/narrator.svelte';
	import Toast from '../components/toast.svelte';

	import '../app.css';

	type Tab = 'game' | 'settings';

	let tabs: Tab[] = ['game', 'settings'];
	let activeTab = 0;

	onMount(() => {
		mountWakeLock();

		registerSwipeGestures({
			handleLeft: () => {
				if ($gameStore.isNarratorVisible) {
					gameStore.updateStore({ isNarratorVisible: false });
					return;
				}

				if (activeTab === 0) {
					activeTab = 1;
					return;
				}
			},
			handleRight: () => {
				if (activeTab === 0 && !$gameStore.isNarratorVisible) {
					gameStore.updateStore({ isNarratorVisible: true });
					return;
				}

				if (activeTab === 1) {
					activeTab = 0;
				}
			}
		});
	});
</script>

<div class="drawer">
	<input
		id="my-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={$gameStore.isNarratorVisible}
	/>
	<div class="drawer-content">
		<div class="content gap-5">
			<header>
				<div class="flex justify-around py-5">
					<h1 class="text-5xl font-bold">{$t('game.name')}</h1>
				</div>
			</header>

			<main>
				{#if activeTab === 0}
					<Setup />
				{:else if activeTab === 1}
					<Settings />
				{/if}
			</main>

			<Forest />

			<div class="btm-nav navigation theme">
				{#each tabs as tab, index}
					<button
						class="theme"
						on:click={() => (activeTab = index)}
						class:active={index === activeTab}
					>
						{$t(tab)}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay" />

		<div class="w-screen bg-base-100">
			<Narrator />
		</div>
	</div>
</div>

<Toast />

<style>
	.content {
		display: grid;
		width: 100vw;
		/* Substract height of bottom nav */
		height: calc(100dvh - 9rem);
		grid-template-rows: auto 1fr;
		position: relative;
		overflow-y: scroll;
	}

	.navigation {
		margin: auto;
		/* Safe space for mobile devices with home bar */
		bottom: 1rem;
	}
</style>
