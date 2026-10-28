import { PUZZLES } from './puzzles.js';
import { showPuzzle, revealLetter, revealAll, isCorrectSolution, hasHiddenVowels } from './board.js';
import { currentPlayer, passTurn, addToRoundTotal, goBankrupt, bankWinnings, renderPlayers } from './players.js';
import { hasBeenGuessed, markGuessed, clearGuessedLetters } from './letters.js';
import { setRound } from './main.js';

const VOWEL_COST = 500;
const NO_VOWELS_MESSAGE = 'There are no more vowels in this puzzle.';

const spinButton = document.getElementById('spin-button');
const consonantForm = document.getElementById('consonant-form');
const vowelForm = document.getElementById('vowel-form');
const vowelInput = document.getElementById('vowel-input');
const solveForm = document.getElementById('solve-form');
const nextPuzzleButton = document.getElementById('next-puzzle-button');
const messageElement = document.getElementById('message');

// What the current player can do right now:
//   'spin'     spin, buy a vowel or solve
//   'spinning' wait for the wheel to stop
//   'guess'    guess a consonant after landing on a cash wedge
//   'solved'   the puzzle is over, start the next one
let phase = 'spin';
let round = 0;
let wedgeValue = 0;
let puzzle = null;

function setPhase(nextPhase) {
  phase = nextPhase;
  spinButton.disabled = phase !== 'spin';
  setFormEnabled(consonantForm, phase === 'guess');
  setFormEnabled(vowelForm, phase === 'spin' && hasHiddenVowels());
  vowelInput.placeholder = hasHiddenVowels() ? '' : 'No vowels left';
  setFormEnabled(solveForm, phase === 'spin');
  nextPuzzleButton.hidden = phase !== 'solved';
}

function setFormEnabled(form, enabled) {
  for (const control of form.elements) {
    control.disabled = !enabled;
  }
}

function say(text) {
  messageElement.textContent = text;
}

function endTurn(reason) {
  passTurn();
  say(`${reason} It's ${currentPlayer().name}'s turn.`);
  setPhase('spin');
}

function describeCount(count, letter) {
  return count === 1 ? `There is 1 ${letter}.` : `There are ${count} ${letter}'s.`;
}

function startPuzzle() {
  const choices = PUZZLES.filter((p) => p !== puzzle);
  puzzle = choices[Math.floor(Math.random() * choices.length)];
  round += 1;
  setRound(round);
  showPuzzle(puzzle);
  clearGuessedLetters();
  say(`Round ${round}. ${currentPlayer().name}, spin the wheel, buy a vowel or solve the puzzle.`);
  setPhase('spin');
}

function handleSpinResult(wedge) {
  const name = currentPlayer().name;
  if (wedge.type === 'bankrupt') {
    goBankrupt();
    endTurn(`${name} went bankrupt and loses their round total.`);
  } else if (wedge.type === 'lose-turn') {
    endTurn(`${name} loses a turn.`);
  } else {
    wedgeValue = wedge.value;
    say(`${name} landed on ${wedge.label}. Guess a consonant.`);
    setPhase('guess');
  }
}

function guessConsonant(letter) {
  if (!/^[B-DF-HJ-NP-TV-Z]$/.test(letter)) {
    say('Type one consonant (any letter except A, E, I, O, U).');
    return;
  }
  if (hasBeenGuessed(letter)) {
    endTurn(`${letter} was already called.`);
    return;
  }

  markGuessed(letter);
  const count = revealLetter(letter);
  if (count === 0) {
    endTurn(`Sorry, there is no ${letter}.`);
    return;
  }

  const winnings = count * wedgeValue;
  addToRoundTotal(winnings);
  say(`${describeCount(count, letter)} ${currentPlayer().name} earns $${winnings}. Spin, buy a vowel or solve.`);
  setPhase('spin');
}

function buyVowel(letter) {
  if (!/^[AEIOU]$/.test(letter)) {
    say('Type one vowel: A, E, I, O or U.');
    return;
  }
  if (!hasHiddenVowels()) {
    say(NO_VOWELS_MESSAGE);
    return;
  }
  if (currentPlayer().roundTotal < VOWEL_COST) {
    say(`${currentPlayer().name} needs at least $${VOWEL_COST} this round to buy a vowel.`);
    return;
  }
  if (hasBeenGuessed(letter)) {
    endTurn(`${letter} was already called.`);
    return;
  }

  addToRoundTotal(-VOWEL_COST);
  markGuessed(letter);
  const count = revealLetter(letter);
  if (count === 0) {
    endTurn(`Sorry, there is no ${letter}.`);
    return;
  }
  if (!hasHiddenVowels()) {
    say(`${describeCount(count, letter)} ${NO_VOWELS_MESSAGE} Spin or solve.`);
    setPhase('spin');
    return;
  }
  say(`${describeCount(count, letter)} Spin, buy another vowel or solve.`);
}

function solvePuzzle(guess) {
  if (!isCorrectSolution(guess)) {
    endTurn(`Sorry, "${guess}" is not the answer.`);
    return;
  }

  revealAll();
  const solver = currentPlayer();
  const winnings = solver.roundTotal;
  bankWinnings();
  say(`${solver.name} solved it and banks $${winnings}!`);
  setPhase('solved');
}

// Reads the form's text box, clears it and returns the uppercase text.
function takeInput(form) {
  const input = form.querySelector('input');
  const text = input.value.trim().toUpperCase();
  input.value = '';
  return text;
}

spinButton.addEventListener('click', () => setPhase('spinning'));
document.addEventListener('spinresult', (event) => handleSpinResult(event.detail.wedge));

consonantForm.addEventListener('submit', (event) => {
  event.preventDefault();
  guessConsonant(takeInput(consonantForm));
});

vowelForm.addEventListener('submit', (event) => {
  event.preventDefault();
  buyVowel(takeInput(vowelForm));
});

solveForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const guess = takeInput(solveForm);
  if (guess) solvePuzzle(guess);
});

nextPuzzleButton.addEventListener('click', () => {
  passTurn();
  startPuzzle();
});

renderPlayers();
startPuzzle();
