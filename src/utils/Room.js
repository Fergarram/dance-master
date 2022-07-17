import firebase from './firebase';
import {getDatabase, onValue, ref, set, update, child, get } from 'firebase/database';
import Dice from '../utils/Dice';

const db = getDatabase(firebase);
let roomRef = '';

const generateID = async (
  host_id, host_username, host_stats,
  opponent_id, opponent_username, opponent_stats,
  room_stats
) => {
  const today = new Date();
  let count = 0;
  const roomCountRef = ref(db, 'dice-master/rooms_count');
  await get(roomCountRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      count = snapshot.val();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

  const id = `${count}${today.getMonth() + 1}${today.getDate()}`;

  await update(ref(db, 'dice-master'), {
    rooms_count: count+1
  });
  roomRef = ref(db, `dice-master/rooms/room_${id}`);
  await update(roomRef, {
    current_turn: 1,
    host_id,
    host_username,
    host_stats,
    opponent_id,
    opponent_username,
    opponent_stats,
    winner_username: '',
    winner_id: '',
    room_stats,
    date: today,
  });

  console.log(roomCountRef);

  return id;
}

const updateTurn = async(turn) => {
  await update(roomRef, {
    current_turn: turn,
  })
}

const Room = {
  host_id: '',
  host_username: 'Devlious',
  host_stats: {
    hp: 10,
  },
  opponent_id: '',
  opponent_username: '',
  opponent_stats: {
    hp: 10,
  },
  room_stats: {
    rounds: 1,
    spells: 6,
    hp: 10,
  },
  current_turn: 1,
  id: '',
  has_space: true,
  getId: async function () {
    if (this.id === '') {
      this.id = await generateID(
        this.host_id,
        this.host_username,
        this.host_stats,
        this.opponent_id,
        this.opponent_username,
        this.opponent_stats,
        this.room_stats,
      );
      return this.id
    } else {
      return this.id
    }
  },
  joinRoom: async function (opponentId, opponentUsername) {
    if (this.has_space) {
      this.opponent_id = opponentId;
      this.opponent_username = opponentUsername;
    } else {
      console.log('This room is playing already!');
    }
  },
  switchTurn: async function() {
    this.current_turn = this.current_turn === 1 ? 2 : 1;
    await updateTurn(this.current_turn);
  },
  canStart: function() {
    return this.opponent_id !== ''
  }
}

export default Room;
