export const basicSpells = [
	{
		name: "Punch Face",
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
		name: "Pinch",
		cost: 1,
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
					negative: 1,
				}
			},
			child: false,
		}
	},
	{
		name: "Kick",
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
						negative: 3,
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
		name: "Popote",
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
		cost: 5,
		dices: 2,
		dices_turns: {
			win: [2, 4, 6],
			lose: [1, 3, 5],
			special: "steal ability",
			can_steal: [1, 2, 3, 4, 5, 6]
		}
	},
	{
		name: "Confusion",
		cost: 3,
		dices: 1,
		dices_turns: {

		}
	}
];