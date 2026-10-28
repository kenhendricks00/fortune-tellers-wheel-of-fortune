import { createWheel } from './wheel.js';
import { WEDGES, wedgesForRound } from './wheel-data.js';

const wheel = createWheel(document.getElementById('wheel'));
const spinButton = document.getElementById('spin-button');
const resultText = document.getElementById('result');
let isSpinning = false;
let wedges = WEDGES;

function randomWedgeIndex() {
  return Math.floor(Math.random() * wedges.length);
}

function describe(wedge) {
  if (wedge.type === 'bankrupt') return 'BANKRUPT!';
  if (wedge.type === 'lose-turn') return 'Lose a Turn!';
  return `${wedge.label}!`;
}

// Spins the wheel and resolves with the wedge it lands on. The landing wedge is picked
// before the animation starts. Other parts of the game can also listen for the
// "spinresult" event on document, which has { wedge, index } in its detail.
export async function spinWheel(index = randomWedgeIndex()) {
  if (isSpinning) throw new Error('The wheel is already spinning');

  isSpinning = true;
  spinButton.disabled = true;
  resultText.textContent = 'Spinning...';

  await wheel.spinTo(index);

  const wedge = wedges[index];
  isSpinning = false;
  spinButton.disabled = false;
  resultText.textContent = describe(wedge);
  document.dispatchEvent(new CustomEvent('spinresult', { detail: { wedge, index } }));
  return wedge;
}

// Switches the wheel to the values for this round.
export function setRound(round) {
  wedges = wedgesForRound(round);
  wheel.setWedges(wedges);
}

spinButton.addEventListener('click', () => spinWheel());
