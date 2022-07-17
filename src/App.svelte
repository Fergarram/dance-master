<script>
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { quintOut } from "svelte/easing";
	import CardManager from './CardManager.svelte';
	import Dado from './Dice.svelte';
	import Dice from './utils/Dice';
	import Card from './Card.svelte';
	import BasePlayer from "./game/BasePlayer";
	import { basicSpells, specialSpells } from "./utils/spells";
	import firebase from "./utils/firebase";
	import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
	import { room } from './store';

	const gameRoom = Room;
	
	const player1 = {
	  // Game props
	  hp: 1,
	  selectedSpells: [],
	  activeBuffs: [],
	  log: [],
	  // Other cosmetic props
	};
	const player2 = {
	  // Game props
	  hp: 1,
	  selectedSpells: [],
	  activeBuffs: [],
	  log: [],
	  // Other cosmetic props
	};

	const messageDuration = 1000;
	const auth = getAuth();

	const allSpells = [ ...basicSpells, ...specialSpells ];

	let mounted = false;
	let gameStarted = false;
	let rounds = 0;
	let godSpeaks = true;
	let maxSpells = 0;
	let startingHp = 0;
	let startingPlayer = 0; // 1 is 1 - 2 is 2
	let shouldPickSpells = false;
	let finishedSelectingSpells = false;
	let godNumber = 0;
	let player1Number = 0;
	let player2Number = 0;
	let player1IsRolling = false;
	let player2IsRolling = false;
	let bigMessage = '';
	let background = 'back-darker.png';
	let userId = '';
	let roomId = '';

	const sounds = {
		godroll: [
			new Audio('/godroll0.mp3'),
			new Audio('/godroll1.mp3'),
			new Audio('/godroll2.mp3'),
		],
		click: [
			new Audio('/click0.mp3'),
			new Audio('/click1.mp3'),
		],
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
	let timerCall = () => {};
	let pauseTimer = false;
	let timer = null;

	async function* gameStep() {
		// Sign-in to Firebase
		console.log('Sign-in to Firebase');
		signInAnonymously(auth)
				.then(() => {
					console.log('Anon Auth Successfully!');
				});
		onAuthStateChanged(auth, (user) => {
			if (user) {
				userId = user.uid;
				gameRoom.hostId = userId;
				console.log('User Signed In');
			} else {
				console.log('User Signed Out');
			}
		});

		// Start Game Message
		bigMessage = '';
		sounds.godroll[0].currentTime = 0;
		sounds.godroll[0].play();
		bigMessage = 'Start Game';
		// Start timer
		timer = setInterval(timerCall, 3000);
		yield;

		// Roll dice for rounds
		// @TODO: Only Host rolls as God
		// 	      Mover state inicial fuera del generator
			godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
			setTimeout(() => {
				godNumber = Dice.roll();
				gameRoom.rounds = godNumber;
				rounds = gameRoom.rounds;
				sounds.godroll[1].currentTime = 0;
				sounds.godroll[1].play();
			}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `${rounds} Rounds`;
		}, messageDuration);
		yield;

		// Roll dice for Spells
		// @TODO: Only Host rolls as God
		// 	      Mover state inicial fuera del generator
			godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
			setTimeout(() => {
				godNumber = Dice.roll();
				gameRoom.spells = godNumber;
				maxSpells = gameRoom.spells;
				sounds.godroll[1].currentTime = 0;
				sounds.godroll[1].play();
			}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `Max ${maxSpells} Spells`;
		}, messageDuration);
		yield;

		// Roll dice for HP
		// @TODO: Only Host rolls as God
		// 	      Mover state inicial fuera del generator
			godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
			setTimeout(() => {
				godNumber = Dice.roll();
				gameRoom.hp = godNumber;
				startingHp = gameRoom.hp;
				player1.hp = gameRoom.hp;
				player2.hp = gameRoom.hp;
				sounds.godroll[1].currentTime = 0;
				sounds.godroll[1].play();
			}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `With ${startingHp} HP`;
		}, messageDuration);
		yield;

		// Pick Spells
		bigMessage = '';
		shouldPickSpells = true;
		sounds.click[1].currentTime = 0;
		sounds.click[1].play();
		pauseTimer = true;
		yield;

		// See who starts
		// @TODO: Only Host rolls as God
		// 	      Mover state inicial fuera del generator
			godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
			setTimeout(() => {
				let tempNumber = Dice.roll();
				godNumber = (tempNumber > 3) ? 1 : 2;
				gameRoom.current_turn = godNumber;
				startingPlayer = gameRoom.current_turn;
				sounds.godroll[1].currentTime = 0;
				sounds.godroll[1].play();
			}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `Player ${startingPlayer} starts`;
			setTimeout(async () => {
				bigMessage = '';
				godSpeaks = false;
				gameStarted = true;

				// Assign GameRoom ID
				console.log('Assigning GameRoom ID');
				await gameRoom.getId();
				await gameRoom.setTurn(gameRoom.current_turn)
				console.log('Current Turn:', gameRoom.current_turn);
				yield;
			}, 3000);
		}, messageDuration);

		while(player1.hp > 0 && player2.hp > 0) {
			console.log('Current Turn:', gameRoom.current_turn);
			// gameRoom.switchTurn();
			yield;
		}
	}

	const currentStep = gameStep();

	timerCall = () => {
		if (!pauseTimer) currentStep.next();
	};

	onMount(() => {
		mounted = true;
	});

	$: if (maxSpells > 0 && player1.selectedSpells.length >= maxSpells && mounted) {
		finishedSelectingSpells = true;
		shouldPickSpells = false;
		currentStep.next();
	}

	const playerRollDice = () => {
		if (player1IsRolling) return;

		player1IsRolling = true;
		sounds.godroll[2].currentTime = 0;
		sounds.godroll[2].play();
		// @FIXME: 1 and 5 is not synched with audio
		player1Number = (player1Number > 1) ? player1Number - 1 : player1Number + 1;
		setTimeout(() => {
			player1Number = Dice.roll();
		}, 500);
		setTimeout(() => {
			player1IsRolling = false;
		}, 2000);
	};

	const selectSpell = (spell) => {
		if (player1.selectedSpells.length >= maxSpells) return;

		sounds.click[0].currentTime = 0;
		sounds.click[0].play();

		player1.selectedSpells.push(spell);
		player1.selectedSpells = player1.selectedSpells; // Trigger reactivity, no borres
		// @TODO: no se todabvia
		player2.selectedSpells.push(spell);
		player2.selectedSpells = player2.selectedSpells; // Trigger reactivity, no borres
	};
</script>

<div
	class="w-full h-screen bg-cover overflow-hidden"
	style="background-image: url(/{background})">
	<div
		class="top-0 left-0 absolute w-full h-full bg-cover pointer-events-none"
		style="background-image: url(/clouds.png)">
	</div>
	<div class="w-full h-full grid grid-cols-[4fr_8fr_4fr]">
		<div class="p-2 grid grid-rows-[1fr_auto] gap-2">
			<div class="overflow-scroll p-2 text-black">
				
			</div>
			<div class="bg-stone-800 grid gap-2 p-2">
				{#each player1.selectedSpells as spell, i}
					<button
						class="text-white text-16 w-full text-left bg-black/20 z-[20] relative p-2 hover:bg-black/40 active:bg-black/80">
						{spell.name}
					</button>
				{/each}
			</div>
		</div>
		<div class="relative">
			{#if godSpeaks}
				<div class="absolute top-0 left-1/2 -translate-x-1/2 flex gap-5 whitespace-nowrap text-white text-64">
					God Says:
				</div>
			{/if}
			<div class="absolute bottom-3 left-[6%] w-[35%] h-3/4 flex items-center justify-center">
				<img src="/p1.png" alt="" class="object-bottom w-full h-full object-contain"/>
				{#if gameStarted}
					<button class="absolute -right-4 w-14 h-14 bottom-5 z-[10]" on:click={() => playerRollDice()} disabled={player1IsRolling ? true : null}>
						<Dado show={player1Number} throwDuration={1000} />
					</button>
				{/if}
			</div>
			<div class="absolute bottom-3 right-[6%] w-[35%] h-3/4 flex items-center justify-center">
				<img src="/p2.png" alt="" class="object-bottom w-full h-full object-contain"/>
				{#if gameStarted}
					<button class="absolute -left-4 w-14 h-14 bottom-5 z-[10]" on:click={() => playerRollDice()} disabled={player2IsRolling ? true : null}>
						<Dado show={player2Number} throwDuration={1000} />
					</button>
				{/if}
			</div>
			{#if godSpeaks}
				<div class="absolute top-28 left-1/2 -translate-x-1/2 w-14 h-14">
					<Dado show={godNumber} />
				</div>
			{/if}
		</div>
		<div class="p-2 grid grid-rows-[1fr_auto] gap-2">
			<div class="overflow-scroll p-2 text-black">
				
			</div>
			<div class="bg-stone-800 grid gap-2 p-2">
				{#each player2.selectedSpells as spell, i}
					<button
						class="text-white text-16 w-full text-left bg-black/20 z-[20] relative p-2 hover:bg-black/40 active:bg-black/80">
						{spell.name}
					</button>
				{/each}
			</div>
		</div>
	</div>
	<div
		class="top-0 left-0 absolute w-full h-full bg-cover pointer-events-none animate-mist opacity-50"
		style="background-image: url(/mist.png)">
	</div>
	{#if bigMessage || shouldPickSpells}
		<div transition:scale={{ duration: 150, easing: quintOut }} class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-[50]">
			<!-- <div class="bg-white rounded-full absolute w-full mt-2 h-full top-0 left-0 blur opacity-50"></div> -->
			<div class="relative whitespace-nowrap text-64 text-white pointer-events-none">
				{bigMessage}
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
	<Card x={48} y={48} classes="grid gap-2">
		<button
			non-draggable
			on:click={() => currentStep.next()}
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
