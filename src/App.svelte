<script>
	import { basicSpells, specialSpells } from './spells.js';
	import { scale } from 'svelte/transition';
	import { quintOut } from "svelte/easing";
	import CardManager from './CardManager.svelte';
	import Dice from './Dice.svelte';
	import Card from './Card.svelte';

	const getRandomDiceVal = (max = 6) => {
		return Math.floor(Math.random() * max) + 1;
	};

	const getBiggerResult = (max = 6) => {
		return Math.floor(Math.random() * max) + 1;
	};

	const messageDuration = 500;

	let rounds = 0;
	let maxSpells = 0;
	let startingHp = 0;
	let startingPlayer = 0; // 1 is 1 - 2 is 2
	let godNumber = 0;

	let bigMessage = '';

	let background = 'back-darker.png';

	const decideStartingPlayer = () => {
		startingPlayer = getBiggerResult();
	};

	const selectSpells = () => {

	};

	const sounds = {
		death: [
			new Audio('/death0.mp3'),
			new Audio('/death1.mp3')
		],
		burn: [
			new Audio('/burn0.mp3'),
			new Audio('/burn1.mp3')
		],
		shortpain: [
			new Audio('/shortpain0.mp3'),
			new Audio('/shortpain1.mp3'),
			new Audio('/shortpain2.mp3'),
			new Audio('/shortpain3.mp3')
		],
	}

	function* gameStep() {
		bigMessage = '';
		sounds.burn[0].play();
		setTimeout(() => {
			bigMessage = 'Start Game';
		}, messageDuration);
		yield;

		// Roll dice for rounds
		godNumber = getRandomDiceVal();
		rounds = godNumber;
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `${rounds} Rounds`;
		}, messageDuration);
		yield;

		// Roll dice for Spells
		godNumber = getRandomDiceVal();
		maxSpells = godNumber;
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `Pick ${maxSpells} Spells`;
		}, messageDuration);
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

<div
	class="grid w-full h-screen bg-cover"
	style="background-image: url(/{background})">
	<div
		class="top-0 left-0 absolute w-full h-full bg-cover pointer-events-none"
		style="background-image: url(/clouds.png)">
	</div>
	<div
		class="top-0 left-0 absolute w-full h-full bg-cover pointer-events-none"
		style="background-image: url(/mist.png)">
	</div>
	<div class="w-full h-full grid grid-cols-[4fr_8fr_4fr]">
		<div class="p-2 grid grid-rows-[1fr_auto] gap-2">
			<div class="overflow-scroll p-2 text-black">
				
			</div>
			<div class="bg-stone-800 grid gap-2 p-2">
				{#each basePlayer.selectedSpells as spell, i}
					<button
						class="text-white text-16 w-full text-left bg-black/20 z-[20] relative p-2 hover:bg-black/40 active:bg-black/80">
						{i+1}. {spell.name} ({spell.level})
					</button>
				{/each}
			</div>
		</div>
		<div class="relative">
			<div class="bg-gray-600 absolute top-0 left-1/2 -translate-x-1/2 py-4 px-10 flex gap-5 whitespace-nowrap text-white">
				<div>Rounds: {rounds}</div>
				<div>Spells: {maxSpells}</div>
				<div>HP: {startingHp}</div>
			</div>
			<div class="absolute bottom-3 left-[6%] w-[35%] h-3/4 flex items-center justify-center">
				<img src="/p1.png" alt="" class="object-bottom w-full h-full object-contain"/>
				<div class="absolute -right-4 w-14 h-14 bottom-5">
					<Dice />
				</div>
			</div>
			<div class="absolute bottom-3 right-[6%] w-[35%] h-3/4 flex items-center justify-center">
				<img src="/p2.png" alt="" class="object-bottom w-full h-full object-contain"/>

				<div class="absolute -left-4 w-14 h-14 bottom-5">
					<Dice />
				</div>
			</div>
			<div class="absolute top-20 left-1/2 -translate-x-1/2 w-14 h-14">
				<Dice show={godNumber} />
			</div>
		</div>
		<div class="p-2 grid grid-rows-[1fr_auto] gap-2">
			<div class="overflow-scroll p-2 text-black">
				
			</div>
			<div class="bg-stone-800 grid gap-2 p-2">
				{#each basePlayer.selectedSpells as spell, i}
					<button
						class="text-white text-16 w-full text-left bg-black/20 z-[20] relative p-2 hover:bg-black/40 active:bg-black/80">
						{i+1}. {spell.name} ({spell.level})
					</button>
				{/each}
			</div>
		</div>
	</div>
	{#if bigMessage}
		<div transition:scale={{ duration: 150, easing: quintOut }} class="text-64 font-bold absolute top-0 left-0 w-full h-full pointer-events-none font-verga text-azulioto flex items-center justify-center z-[50]">
			<!-- <div class="bg-white rounded-full absolute w-full mt-2 h-full top-0 left-0 blur opacity-50"></div> -->
			<div class="relative whitespace-nowrap">
				{bigMessage}
			</div>
		</div>
	{/if}
</div>
<CardManager>
	<Card x={48} y={48} classes="grid gap-2">
		<button
			non-draggable
			on:click={() => goNextStep()}
			class="bg-blue-600 text-white px-2 py-1.5 rounded-8 active:bg-blue-700 cursor-auto">
			Next Step
		</button>
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