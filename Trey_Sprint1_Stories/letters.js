const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const usedLettersElement = document.getElementById('used-letters');
const guessedLetters = new Set();

export function hasBeenGuessed(letter) {
  return guessedLetters.has(letter);
}

export function markGuessed(letter) {
  guessedLetters.add(letter);
  renderUsedLetters();
}

export function clearGuessedLetters() {
  guessedLetters.clear();
  renderUsedLetters();
}

function renderUsedLetters() {
  usedLettersElement.innerHTML = '';
  for (const letter of ALPHABET) {
    const box = document.createElement('span');
    box.className = guessedLetters.has(letter) ? 'used-letter used' : 'used-letter';
    box.textContent = letter;
    usedLettersElement.appendChild(box);
  }
}
