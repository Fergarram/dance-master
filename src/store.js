import { writable } from 'svelte/store';
import Room from "./utils/Room";


export const room = writable(Room);
