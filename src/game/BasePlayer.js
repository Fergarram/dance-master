import { basicSpells, specialSpells } from '../utils/spells.js';


const BasePlayer = {
  // Game props
  hp: 1,
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

export default BasePlayer;
