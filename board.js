const MAX_ROW_LENGTH = 14;

const categoryElement = document.getElementById('category');
const boardElement = document.getElementById('board');

let answer = '';
let letterTiles = [];

function isLetter(char) {
  return char >= 'A' && char <= 'Z';
}

// Breaks the puzzle into rows of whole words that fit across the board.
function splitIntoRows(text) {
  const rows = [];
  let row = '';
  for (const word of text.split(' ')) {
    if (row && row.length + 1 + word.length > MAX_ROW_LENGTH) {
      rows.push(row);
      row = word;
    } else {
      row = row ? `${row} ${word}` : word;
    }
  }
  rows.push(row);
  return rows;
}

function createTile(char) {
  const tile = document.createElement('div');
  if (char === ' ') {
    tile.className = 'tile space';
  } else if (isLetter(char)) {
    tile.className = 'tile hidden-letter';
    letterTiles.push({ char, element: tile });
  } else {
    tile.className = 'tile';
    tile.textContent = char;
  }
  return tile;
}

function flip(tile) {
  tile.element.textContent = tile.char;
  tile.element.className = 'tile';
}

export function showPuzzle(puzzle) {
  answer = puzzle.text;
  letterTiles = [];
  categoryElement.textContent = puzzle.category;
  boardElement.innerHTML = '';

  for (const row of splitIntoRows(puzzle.text)) {
    const rowElement = document.createElement('div');
    rowElement.className = 'board-row';
    for (const char of row) {
      rowElement.appendChild(createTile(char));
    }
    boardElement.appendChild(rowElement);
  }
}

// Turns over every tile with this letter and returns how many there were.
export function revealLetter(letter) {
  const matches = letterTiles.filter((tile) => tile.char === letter);
  matches.forEach(flip);
  return matches.length;
}

export function revealAll() {
  letterTiles.forEach(flip);
}

// True while at least one vowel in the puzzle is still hidden.
export function hasHiddenVowels() {
  return letterTiles.some((tile) => 'AEIOU'.includes(tile.char) && tile.element.classList.contains('hidden-letter'));
}

function lettersOnly(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

// Case, spaces and punctuation don't matter, so "dont count your chickens" counts.
export function isCorrectSolution(guess) {
  return lettersOnly(guess) === lettersOnly(answer);
}
