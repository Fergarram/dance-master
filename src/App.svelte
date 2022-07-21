<script>
	import { scale, blur } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { quintOut } from "svelte/easing";
	import CardManager from './CardManager.svelte';
	import Dice from './Dice.svelte';
	import Card from './Card.svelte';
	import { basicSpells, specialSpells } from "./utils/spells";
	import { shuffle } from './utils';
	// import firebase from "./utils/firebase";
	// import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
	// import Room from './utils/Room';

	// const gameRoom = Room;
	const messageDelay = 1000;
	// const auth = getAuth();

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

	let mounted = false;
	let game = null;
	let gameStarted = false;
	let localPickingPlayer = 0; // 0 is p1 1 is p2
	let godNumber = 0;
	let godSpeaks = false;
	let godMessage = 'God Says:';
	let shouldPickSpells = false;
	let finishedSelectingSpells = false;
	let bigMessage = '';
	let background = 'back-darker.png';
	// let userId = '';
	// let roomId = '';
	let timerCall = () => {};
	let pauseTimer = false;
	let timer = null;
	let allSpells = [
		...basicSpells,
		...specialSpells
	];

	let debug = {
		diceNumber: -1,
	};

	function diceRoll(sides = 6) {
		if (debug.diceNumber > 0) return debug.diceNumber;
		return Math.floor(Math.random() * sides) + 1;
	}

	const setupGame = () => {
		const game = {
			started: true,
			currentRound: 1,
			activePlayer: 0,
			rounds: diceRoll(),
			maxSpells: diceRoll(),
			startingHp: diceRoll(),
			startingPlayer: (diceRoll() % 2 === 0) ? 2 : 1,
			players: [
				{
					hp: 0,
					selectedSpells: [],
					activeBuffs: [],
					isRolling: false,
					canRoll: false,
					diceNumber: 0,
					canUseSpell: false,
					godPlaying: true,
					activeSpell: -1,
				},
				{
					hp: 0,
					selectedSpells: [],
					activeBuffs: [],
					isRolling: false,
					canRoll: false,
					diceNumber: 0,
					canUseSpell: false,
					godPlaying: true,
					activeSpell: -1,
				}
			]
		};
		game.players.forEach(p => p.hp = game.startingHp);
		return game;
	};

	async function* gameStep() {
		// Start Game Message
		game = setupGame();
		godSpeaks = true;
		bigMessage = '';
		sounds.godroll[0].currentTime = 0;
		sounds.godroll[0].play();
		bigMessage = 'Start Game';

		// Start timer
		timer = setInterval(timerCall, 3000);
		yield;

		// Roll dice for rounds
		godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
		setTimeout(() => {
			godNumber = game.rounds;
			sounds.godroll[1].currentTime = 0;
			sounds.godroll[1].play();
		}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `${game.rounds} Rounds`;
		}, messageDelay);
		yield;

		// Roll dice for spells
		godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
		setTimeout(() => {
			godNumber = game.maxSpells;
			sounds.godroll[1].currentTime = 0;
			sounds.godroll[1].play();
		}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `Max ${game.maxSpells} Spells`;
		}, messageDelay);
		yield;

		// Roll dice for HP
		godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
		setTimeout(() => {
			godNumber = game.startingHp;
			sounds.godroll[1].currentTime = 0;
			sounds.godroll[1].play();
		}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `With ${game.startingHp} HP`;
		}, messageDelay);
		yield;

		// Pick Spells
		bigMessage = '';
		shouldPickSpells = true;
		sounds.click[1].currentTime = 0;
		sounds.click[1].play();
		pauseTimer = true;
		yield;

		// See who starts
		godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
		setTimeout(() => {
			godNumber = game.startingPlayer;
			sounds.godroll[1].currentTime = 0;
			sounds.godroll[1].play();
		}, 500);
		bigMessage = '';
		setTimeout(() => {
			bigMessage = `Player ${game.startingPlayer} starts`;
			setTimeout(() => {
				bigMessage = '';
				godSpeaks = false;
				gameStarted = true;
				game.activePlayer = game.startingPlayer;
				game.players[game.activePlayer-1].canRoll = true;
				game = game;

				console.log('Active Player:', game.activePlayer);
			}, 3000);
		}, messageDelay);
		yield;
	}

	const currentStep = gameStep();

	timerCall = () => {
		if (!pauseTimer) currentStep.next();
	};

	onMount(() => {
		mounted = true;
	});

	const playerRollDice = () => {
		const cp = game.activePlayer - 1;
		if (game.players[cp].isRolling || !game.players[cp].canRoll) return;

		game.players[cp].isRolling = true;
		sounds.godroll[2].currentTime = 0;
		sounds.godroll[2].play();
		game.players[cp].diceNumber = (game.players[cp].diceNumber > 1) ? game.players[cp].diceNumber - 1 : game.players[cp].diceNumber + 1; // @FIXME: 1 and 5 is not synched with audio
		game = game;
		setTimeout(() => {
			game.players[cp].diceNumber = diceRoll();
			game = game;
		}, 500);
		setTimeout(() => {
			game.players[cp].isRolling = false;
			game = game;

			// Player Plays
			if (game.players[cp].diceNumber % 2 === 0) {
				setTimeout(() => {
					bigMessage = "Player picks";
					console.log('Player plays');
					game.players[cp].godPlaying = false;
					game.players[cp].canUseSpell = true;
					game.players[cp].canRoll = false;
					game = game;
					setTimeout(() => {
						bigMessage = "";
					}, 2000);
				}, 500);

			// God Plays
			} else {
				console.log('God plays');
				let tempNumber = diceRoll(game.maxSpells);
				godSpeaks = true;
				godMessage = 'God Plays:';
				godNumber = (godNumber > 1) ? godNumber - 1 : godNumber + 1;
				setTimeout(() => {
					godNumber = tempNumber;
					sounds.godroll[1].currentTime = 0;
					sounds.godroll[1].play();
				}, 500);
				setTimeout(() => {
					game.players[cp].activeSpell = tempNumber;
					bigMessage = `Use ${game.players[cp].selectedSpells[game.players[cp].activeSpell-1].name}`;
					game.players[cp].godPlaying = true;
					game.players[cp].canUseSpell = false;
					game.players[cp].canRoll = false;
					game = game;
					setTimeout(() => {
						bigMessage = '';
						godSpeaks = false;
						godMessage = '';
						useSpell(cp, game.players[cp].selectedSpells[game.players[cp].activeSpell-1], game.players[cp].activeSpell-1);
					}, 2000);
				}, messageDelay);
			}
		}, 2000);
	};

	const useSpell = (playerNo, spell, spellIndex) => {
		game.players[playerNo].canUseSpell = false;
		console.log('Player', playerNo, 'using spell:', spell.name, `(${spellIndex})`);
		sounds.shortpain[1].currentTime = 0;
		sounds.shortpain[1].play();
	};

	const selectSpell = (spell) => {
		sounds.click[0].currentTime = 0;
		sounds.click[0].play();
		game.players[localPickingPlayer].selectedSpells.push(spell);
		game = game;

		if (game.players[localPickingPlayer].selectedSpells.length >= game.maxSpells) {
			localPickingPlayer += 1;
			allSpells = shuffle(allSpells);
			// @TODO: Add correct sound
			// sounds.godroll[1].currentTime = 0;
			// sounds.godroll[1].play();
		}
	};

	$: if (game && game.players && game.maxSpells > 0 && game.players[1].selectedSpells.length >= game.maxSpells && mounted) {
		finishedSelectingSpells = true;
		shouldPickSpells = false;
		currentStep.next();
	}
</script>

<div
	class="w-full h-screen bg-cover overflow-hidden font-verga"
	style="background-image: url(/{background})">
	<div
		class="top-0 left-0 absolute w-full h-full bg-cover pointer-events-none"
		style="background-image: url(/clouds.png)">
	</div>
	{#if game}
		<div class="w-full h-full grid grid-cols-[4fr_8fr_4fr]">
			<div class="p-2 grid grid-rows-[1fr_auto] gap-2">
				<div class="overflow-scroll p-2 text-black">
					
				</div>
				<div class="bg-stone-800 grid gap-2 p-2">
					{#each game.players[0].selectedSpells as spell, i}
						<button
							on:click={() => useSpell(0, spell, i)}
							disabled={!game.players[0].canUseSpell ? true : null}
							class="text-white text-16 w-full text-left bg-black/20 z-[20] relative p-2 {game.players[0].canUseSpell ? 'hover:bg-black/40 active:bg-black/80' : 'opacity-50'}">
							{spell.name}
						</button>
					{/each}
				</div>
			</div>
			<div class="relative">
				{#if godSpeaks}
					<div class="absolute top-0 left-1/2 -translate-x-1/2 flex gap-5 whitespace-nowrap text-white text-64">
						{godMessage}
					</div>
				{/if}
				<div transition:blur class="absolute bottom-3 left-[6%] w-[35%] h-3/4 flex items-center justify-center">
					<img draggable="false" src="/p1.png" alt="" class="object-bottom w-full h-full object-contain"/>
					{#if gameStarted && game.activePlayer === 1}
						<button
							class="absolute -right-4 w-14 h-14 bottom-5 z-[10] {!game.players[0].canRoll ? 'opacity-50' : ''}"
							disabled={game.players[0].isRolling || !game.players[0].canRoll ? true : null}
							on:click={() => playerRollDice()}>
							<Dice show={game.players[0].diceNumber} throwDuration={1000} />
						</button>
					{/if}
				</div>
				<div transition:blur class="absolute bottom-3 right-[6%] w-[35%] h-3/4 flex items-center justify-center">
					<img draggable="false" src="/p2.png" alt="" class="object-bottom w-full h-full object-contain"/>
					{#if gameStarted && game.activePlayer === 2}
						<button
							class="absolute -left-4 w-14 h-14 bottom-5 z-[10] {!game.players[1].canRoll ? 'opacity-50' : ''}"
							disabled={game.players[1].isRolling || !game.players[1].canRoll ? true : null}
							on:click={() => playerRollDice()}>
							<Dice show={game.players[1].diceNumber} throwDuration={1000} />
						</button>
					{/if}
				</div>
				{#if godSpeaks}
					<div class="absolute top-28 left-1/2 -translate-x-1/2 w-14 h-14">
						<Dice show={godNumber} />
					</div>
				{/if}
			</div>
			<div class="p-2 grid grid-rows-[1fr_auto] gap-2">
				<div class="overflow-scroll p-2 text-black">
					
				</div>
				<div class="bg-stone-800 grid gap-2 p-2">
					{#each game.players[1].selectedSpells as spell, i}
						<button
							on:click={() => useSpell(1, spell, i)}
							disabled={!game.players[1].canUseSpell ? true : null}
							class="text-white text-16 w-full text-left bg-black/20 z-[20] relative p-2 {game.players[1].canUseSpell ? 'hover:bg-black/40 active:bg-black/80' : 'opacity-50'}">
							{spell.name}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
	<div
		class="top-0 left-0 absolute w-full h-full bg-cover pointer-events-none animate-mist opacity-50"
		style="background-image: url(/mist.png)">
	</div>
	{#if bigMessage || shouldPickSpells}
		<div transition:scale={{ duration: 150, easing: quintOut }} class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-[50]">
			<div class="relative whitespace-nowrap text-64 text-white pointer-events-none">
				{bigMessage}
			</div>
			{#if shouldPickSpells && !finishedSelectingSpells}
				<div class="text-white text-24 bg-black p-4">
					<div class="mb-4 w-112 pb-1 border-b-2 border-white">
						{localPickingPlayer !== -1 ? `Player ${localPickingPlayer === 0 ? 'One, ' : 'Two, '}` : ''} Select {game.maxSpells} Spell{game.maxSpells > 1 ? 's' : ''}
					</div>
					<div class="grid grid-cols-[auto_1fr]">
						<div class="grid gap-2">
							{#each allSpells as spell}
								<div class="relative">
									<button
										on:click={() => selectSpell(spell)}
										disabled={game.players[localPickingPlayer].selectedSpells.find(s => s.name === spell.name)}
										class="{game.players[localPickingPlayer].selectedSpells.find(s => s.name === spell.name) ? 'bg-white' : '[&:hover+div]:block hover:bg-white hover:text-black'} text-24 w-full text-left">
										{spell.name}
									</button>
									<div class="hidden absolute right-0 translate-x-[calc(100%+1rem)] w-80 top-0 bg-white text-black z-[60] p-2">
										{spell.description}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
<CardManager>
	<Card x={48} y={48} classes="grid gap-2">
		<h1 class="text-20 font-medium tracking-title">Dance Master: Alpha</h1>
		<hr />
		<div class="grid gap-2 grid-cols-2">
			<button
				non-draggable
				on:click={() => currentStep.next()}
				class="bg-blue-600 text-white px-2 py-1.5 rounded-8 active:bg-blue-700 cursor-auto font-medium">
				Play Offline
			</button>
			<button
				non-draggable
				on:click={() => currentStep.next()}
				class="bg-blue-600 text-white px-2 py-1.5 rounded-8 active:bg-blue-700 cursor-auto font-medium">
				Play Online
			</button>
		</div>
		<hr />
		<div class="grid gap-1">
			<span>Dice Hijack</span>
			<input
				non-draggable
				bind:value={debug.diceNumber}
				type="text"
				class="border border-gray-b rounded-8 h-8 px-2"/>
		</div>
	</Card>
</CardManager>
<style>
</style>