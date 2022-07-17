<script>
import { onMount } from 'svelte';

export let show = 0;
export let throwDuration = 1000;
</script>

<div class="w-full h-full">
	<div class="dice dice-one show-{show}" style="transition: transform {throwDuration}ms">
		<div
			id="dice-one-side-one"
			class="side one bg-cover bg-no-repeat"
			style="background-image: url(/dieface1.png);">
		</div>
		<div
			id="dice-one-side-two"
			class="side two bg-cover bg-no-repeat"
			style="background-image: url(/dieface2.png);">
		</div>
		<div
			id="dice-one-side-three"
			class="side three bg-cover bg-no-repeat"
			style="background-image: url(/dieface3.png);">
		</div>
		<div
			id="dice-one-side-four"
			class="side four bg-cover bg-no-repeat"
			style="background-image: url(/dieface4.png);">
		</div>
		<div
			id="dice-one-side-five"
			class="side five bg-cover bg-no-repeat"
			style="background-image: url(/dieface5.png);">
		</div>
		<div
			id="dice-one-side-six"
			class="side six bg-cover bg-no-repeat"
			style="background-image: url(/dieface6.png);">
		</div>
	</div>
</div>

<style>
.dice {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.dot {
  position: absolute;
  width: 22%;
  height: 22%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  background-color: black;
}

.side {
  position: absolute;
  background-color: white;
  border-radius:5px;
  width: 100%;
  height: 100%;
  border: 1px solid lightgray;
  text-align: center;
  font-size: 9px;
}

.side:nth-child(1) {
  transform: translateZ(3.1em); }

.side:nth-child(6) {
  transform: rotateY(90deg) translateZ(3.1em); }

.side:nth-child(3) {
  transform: rotateY(-90deg) translateZ(3.1em); }

.side:nth-child(4) {
  transform: rotateX(90deg) translateZ(3.1em); }

.side:nth-child(5) {
  transform: rotateX(-90deg) translateZ(3.1em); }

.side:nth-child(2) {
  transform: rotateY(-180deg) translateZ(3.1em); }

.show-1 {
  transform: rotateX(720deg) rotateZ(-720deg); }

.show-2 {
  transform: rotateX(-900deg) rotateZ(1080deg); }

.show-6 {
  transform: rotateY(-450deg) rotateZ(-1440deg); }

.show-3 {
  transform: rotateY(810deg) rotateZ(720deg); }

.show-4 {
  transform: rotateX(-810deg) rotateZ(-1080deg); }

.show-5 {
  transform: rotateX(450deg) rotateZ(-720deg); }
</style>