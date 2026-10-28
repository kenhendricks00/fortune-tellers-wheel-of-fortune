// The 24 wedges in clockwise order, starting with the wedge at the top.

const RED = '#e53935';
const ORANGE = '#fb8c00';
const YELLOW = '#fdd835';
const GREEN = '#43a047';
const BLUE = '#1e88e5';
const PURPLE = '#8e24aa';
const PINK = '#ec407a';

function cash(value, color) {
  return { label: `$${value}`, value, type: 'cash', color };
}

function bankrupt() {
  return { label: 'BANKRUPT', value: 0, type: 'bankrupt', color: '#111111' };
}

function loseATurn() {
  return { label: 'LOSE A TURN', value: 0, type: 'lose-turn', color: '#f5f5f5' };
}

export const WEDGES = [
  cash(2500, RED),
  cash(600, ORANGE),
  cash(700, YELLOW),
  cash(650, GREEN),
  bankrupt(),
  cash(800, BLUE),
  cash(500, PURPLE),
  cash(900, PINK),
  cash(550, RED),
  cash(850, ORANGE),
  cash(600, YELLOW),
  cash(700, GREEN),
  loseATurn(),
  cash(800, BLUE),
  cash(500, PURPLE),
  cash(650, PINK),
  cash(900, RED),
  bankrupt(),
  cash(750, ORANGE),
  cash(550, YELLOW),
  cash(600, GREEN),
  cash(750, BLUE),
  cash(500, PURPLE),
  cash(850, PINK),
];

// Top dollar value: $2,500 in round 1, $3,500 in rounds 2 and 3, $5,000 from round 4 on.
export function topValue(round) {
  if (round === 1) return 2500;
  if (round <= 3) return 3500;
  return 5000;
}

// The wheel for a round. Only the top wedge changes from round to round.
export function wedgesForRound(round) {
  return WEDGES.map((wedge, i) => (i === 0 ? cash(topValue(round), wedge.color) : wedge));
}
