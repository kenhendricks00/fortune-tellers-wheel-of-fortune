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
  cash(1000, ORANGE),
  cash(600, YELLOW),
  cash(700, GREEN),
  loseATurn(),
  cash(800, BLUE),
  cash(500, PURPLE),
  cash(650, PINK),
  cash(900, RED),
  bankrupt(),
  cash(1500, ORANGE),
  cash(550, YELLOW),
  cash(600, GREEN),
  cash(750, BLUE),
  cash(500, PURPLE),
  cash(850, PINK),
];
