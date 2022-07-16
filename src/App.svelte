<script>
	import { basicSpells, specialSpells } from './spells.js';
	import CardManager from './CardManager.svelte';
	import Card from './Card.svelte';

	const getRandomDiceVal = (max = 6) => {
		return Math.floor(Math.random() * max) + 1;
	};

	const getBiggerResult = (max = 6) => {
		return Math.floor(Math.random() * max) + 1;
	};

	let rounds = 0;
	let maxSpells = 0;
	let startingHp = 0;
	let startingPlayer = 0; // 1 is 1 - 2 is 2

	const decideStartingPlayer = () => {
		startingPlayer = getBiggerResult();
	};

	const selectSpells = () => {

	};

	function* gameStep() {
		// Show intro animation "Start"
		console.log('Show intro animation "Start"');
		yield;

		// Show "Rounds" animation
		console.log('Show "Rounds" animation');
		yield;

		// Roll dice for rounds
		console.log('Roll dice for rounds');
		rounds = getRandomDiceVal();
		yield;

		// Show round decision animation
		console.log('Show round decision animation');
		yield;

		// Show "Spells" animation
		console.log('Show "Spells" animation');
		yield;

		// Roll dice for spells
		maxSpells = getRandomDiceVal();
		console.log('Roll dice for spells');
		yield;

		// Show spells decision animation
		console.log('Show spells decision animation');
		yield;

		// Show "starting Hp" animation
		console.log('Show "starting Hp" animation');
		yield;

		// Roll dice for startring hp
		startingHp = getRandomDiceVal();
		console.log('Roll dice for startring hp');
		yield;

		// Show hp decision animation
		console.log('Show hp decision animation');
		yield;
	}

	const events = [];

	const basePlayer = {
		// Game props
		hp: startingHp,
		selectedSpells: [
			{
				name: 'Hack',
				level: 5,
				disabled: false
			},
			{
				name: 'Hack',
				level: 5,
				disabled: false
			},
			{
				name: 'Hack',
				level: 5,
				disabled: false
			},
			{
				name: 'Hack',
				level: 5,
				disabled: false
			},
			{
				name: 'Hack',
				level: 5,
				disabled: false
			},
			{
				name: 'Hack',
				level: 5,
				disabled: false
			},
		],
		activeBuffs: [],
		log: [],
		// Other cosmetic props
	};

	const currentStep = gameStep();

	let gameStarted = false;

	const goNextStep = () => {
		gameStarted = currentStep.next().done;
	};
</script>

<div class="grid grid-rows-[12fr_8fr] w-full h-screen">
	<div class="w-full h-full bg-red-300 grid grid-cols-[4fr_8fr_4fr]">
		<div class="bg-red-200 p-2 grid gap-2">
			{#each basePlayer.selectedSpells as spell, i}
				<button class="bg-white rounded-4 border border-gray-500 active:bg-gray-100 text-12 p-2 w-full">
					{i+1}. {spell.name} ({spell.level})
				</button>
			{/each}
		</div>
		<div class="bg-blue-200 relative">
			<div class="bg-gray-600 absolute top-0 left-1/2 -translate-x-1/2 py-4 px-10 flex gap-5 whitespace-nowrap text-white">
				<div>Rounds: {rounds}</div>
				<div>Spells: {maxSpells}</div>
				<div>HP: {startingHp}</div>
			</div>
			<div class="absolute bottom-6 bg-red-400 left-[6%] w-1/4 h-1/2">
				p1 body
				<div class="absolute -right-10 w-14 h-14 bg-blue-500 bottom-5">
					p1 dice
				</div>
			</div>
			<div class="absolute bottom-6 bg-red-400 right-[6%] w-1/4 h-1/2">
				p2 body

				<div class="absolute -left-10 w-14 h-14 bg-blue-500 bottom-5">
					p2 dice
				</div>
			</div>
			<div class="absolute top-20 left-1/2 -translate-x-1/2 bg-blue-500 w-14 h-14">
				god dice
			</div>
		</div>
		<div class="bg-red-200 p-2 grid gap-2">
			{#each basePlayer.selectedSpells as spell, i}
				<button class="bg-white rounded-4 border border-gray-500 active:bg-gray-100 text-12 p-2 w-full">
					{i+1}. {spell.name} ({spell.level})
				</button>
			{/each}
		</div>
	</div>
	<div class="w-full h-full bg-blue-300 grid grid-cols-[4fr_5fr_4fr]">
		<div class="bg-green-200 relative">
			<div class="flex items-center justify-center w-full h-full">char</div>
			<div class="absolute w-10 h-full bg-gray-600/50 left-0 top-0">
				buffs
			</div>
		</div>
		<div class="bg-orange-200">
			<div>log</div>
		</div>
		<div class="bg-green-200 relative">
			<div class="flex items-center justify-center w-full h-full">char</div>
			<div class="absolute w-10 h-full bg-gray-600/50 right-0 top-0">
				buffs
			</div>
		</div>
	</div>
</div>
<CardManager>
	<Card x={16} y={window.innerHeight - 148} classes="grid gap-2">
		<button
			non-draggable
			on:click={() => goNextStep()}
			class="bg-blue-600 text-white px-2 py-1.5 rounded-8 active:bg-blue-700 cursor-auto">
			Next Step
		</button>
	</Card>
	<!-- {#each HOLONS as h, index}
		{#if h.ui.visible}
			<Card bind:x={h.ui.x} bind:y={h.ui.y} classes="grid gap-2" cardId={h.ui.id}>
				<div class="font-medium pb-2 border-b border-gray-200 flex justify-between gap-4 items-center">
					{h.name}
					<p class="rounded-8 px-2 py-1 {h.relations['canBePartOf'] && h.relations['canBePartOf'].length > 1 ? 'bg-yellow-300' : 'bg-green-300'}">
						{#if h.relations['canBePartOf'] && h.relations['canBePartOf'].length > 1}
							Could be 1 in {h.relations['canBePartOf'].length} identities
						{:else}
							1 Possible Identity
						{/if}
					</p>
				</div>
				{#each Object.keys(h.relations) as r}
					<div>
						<p class="text-14">{r}</p>
						<ul class="grid">
							{#each h.relations[r] as link}
								<li
									non-draggable
									on:click={() => showUI(link)}
									class="inline-block w-fit text-blue-600 font-medium hover:underline cursor-auto">
									- {link}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
				<div>
					<p class="text-14 mb-1 pt-1 mt-1 border-t border-gray-200">Neighboring Rules</p>
					<pre class="w-full overflow-auto bg-gray-800 text-white font-mono p-2 rounded-4">{`V <- H -> S\n---\nV = CH_VOID\nH = CH_HASH\nS = CH_SPACE`}</pre>
				</div>
			</Card>
		{/if}
	{/each} -->
</CardManager>

<style>
</style>