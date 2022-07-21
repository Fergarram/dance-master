export function DiceRoll(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}