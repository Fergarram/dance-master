export const basicSpells = [
	{
		name: "Meditate",
		ui_state: {},
		description: 'Heals 2 HP.',
		disabled: false,
		cost: 2,
		dices: 1,
		dices_turns: {
			win: [1, 3, 5], // Odds
			lose: [2, 4, 6], // Evens
			health: {
				self: {
					positive: 2,
					negative: 0,
				},
				enemy: {
					positive: 0,
					negative: 0,
				}
			},
			child: false,
		}
	},
	{
		name: "Cry",
		ui_state: {},
		description: 'Heal 1 HP.',
		disabled: false,
		cost: 1,
		dices: 1,
		dices_turns: {
			win: [1, 3, 5], // Odds
			lose: [2, 4, 6], // Evens
			health: {
				self: {
					positive: 1,
					negative: 0,
				},
				enemy: {
					positive: 0,
					negative: 0,
				}
			},
			child: false,
		}
	},
	{
		name: "Kick",
		ui_state: {},
		description: 'Deals 2 DMG to opponent.',
		disabled: false,
		cost: 2,
		dices: 1,
		dices_turns: {
			win: [1, 3, 5], // Odds
			lose: [2, 4, 6], // Evens
			health: {
				self: {
					positive: 0,
					negative: 0,
				},
				enemy: {
					positive: 0,
					negative: 2,
				}
			},
			child: false,
		}
	},
	{
		name: "Bit",
		ui_state: {},
		description: 'Deals 1 DMG to opponent.',
		disabled: false,
		dices: 1,
		dices_turns: {
			win: [1, 3, 5], // Odds
			lose: [2, 4, 6], // Evens
			health: {
				self: {
					positive: 1,
					negative: 0,
				},
				enemy: {
					positive: 0,
					negative: 1,
				}
			},
			child: false,
		}
	},
];

export const specialSpells = [
	{
		name: "Sickness",
		ui_state: {},
		description: "Beto's magical power that I don't understand",
		disabled: false,
		cost: 4,
		dices: 2,
		dices_turns: {
			win: [2, 4, 6],
			lose: [1, 3, 5],
			win_child: {
				win: [2, 4, 6],
				lose: [1, 3, 5],
				health: {
					self: {
						positive: 0,
						negative: 0,
					},
					enemy: {
						positive: 0,
						negative: 2,
					}
				},
				child: false,
			},
			lose_child: {
				win: [1, 6],
				lose: [2, 3, 4, 5],
				health: {
					self: {
						positive: 0,
						negative: 0,
					},
					enemy: {
						positive: 0,
						negative: 4,
					}
				},
				child: false,
			},
			child: true,
		},
	},
	{
		name: "Dehydrate",
		ui_state: {},
		description: 'You have a 50% chance of stunning your opponent and dealing 1 DMG.',
		disabled: false,
		cost: 2,
		dices: 1,
		dices_turns: {
			win: [2, 4, 6],
			lose: [1, 3, 5],
			special: "stun",
			health: {
				self: {
					positive: 0,
					negative: 0,
				},
				enemy: {
					positive: 0,
					negative: 1,
				}
			},
			child: false,
		},
	},
	{
		name: "Hack",
		ui_state: {},
		description: "Steal and use one of your opponent's spells",
		disabled: false,
		cost: 5,
		dices: 2,
		dices_turns: {
			win: [2, 4, 6],
			lose: [1, 3, 5],
			special: "steal",
			can_steal: [1, 2, 3, 4, 5, 6]
		}
	},
];