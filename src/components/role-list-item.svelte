<script lang="ts">
	import type { GameRole } from '$lib/stores/game';
	import { t } from '$lib/stores/i18n';

	export let role: GameRole;

	$: name = $t(`narrator.${role.name}.name`);
</script>

<button class="avatar indicator w-full" on:click>
	<div class="rounded w-8">
		<img alt="char" src={`/chars/${role.name}.png`} />
	</div>

	<span>
		{name}
	</span>
</button>
