import firebase from './firebase';
import {getDatabase, onValue, ref, set, update, child, get } from 'firebase/database';
import Dice from '../utils/Dice';

const db = getDatabase(firebase);
let roomRef = '';

const generateID = async (
  host_id, host_username, host_stats,
  opponent_id, opponent_username, opponent_stats,
  stats
) => {
  const today = new Date();
  let count = 0;
  const roomCountRef = ref(db, 'dice-master/rooms_count');
  await get(roomCountRef).then((snapshot) => {
    if (snapshot.exists()) {
      count = snapshot.val();
    } else {
      console.log("No [room_count] data available");
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
    current_turn: 0,
    host_id,
    host_username,
    host_stats,
    opponent_id,
    opponent_username,
    opponent_stats,
    winner_username: '',
    winner_id: '',
    stats,
    date: today,
  });

  await subscribeRoom();

  return id;
};

const subscribeRoom = async(player) => {
  await onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    Object.assign(Room, data);
    console.log('Room:', Room);
  });
};

const updateOpponent = async(opponent_id, opponent_username, opponent_stats) => {
  await subscribeRoom();
};

const updateTurn = async(turn) => {
  await update(roomRef, {
    current_turn: turn,
  })
};

const updateSpell = async(spell) => {
  await update(roomRef, {

  })
}

const Room = {
  host_id: '',
  host_username: 'Devlious',
  host_stats: {
    hp: 10,
    selected_character: '',
  },
  opponent_id: '',
  opponent_username: '',
  opponent_stats: {
    hp: 10,
    selected_character: '',
  },
  stats: {
    rounds: 1,
    spells: 6,
    hp: 10,
  },
  current_turn: 0,
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
        this.stats,
      );
      return this.id
    } else {
      return this.id
    }
  },
  joinRoom: async function (opponent_id, opponent_username) {
    if (this.has_space) {
      this.opponent_id = opponent_id;
      this.opponent_username = opponent_username;
      await updateOpponent(opponent_id, opponent_username, this.opponent_stats);
    } else {
      console.log('This room is playing already!');
    }
  },
  setTurn: async function(turn) {
    this.current_turn = turn;
    await updateTurn(this.current_turn);
  },
  switchTurn: async function() {
    this.current_turn = this.current_turn === 1 ? 2 : 1;
    await updateTurn(this.current_turn);
  },
  canStart: function() {
    return this.opponent_id !== ''
  },
  selectSpell: async function(spell) {
    await updateSpell(spell)
  },
  getHostUsername: function() {
    return this.host_username;
  }
}

export default Room;
