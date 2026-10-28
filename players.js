const listElement = document.getElementById('players');

const players = ['Player 1', 'Player 2', 'Player 3'].map((name) => ({ name, roundTotal: 0, bank: 0 }));
let currentIndex = 0;

export function currentPlayer() {
  return players[currentIndex];
}

export function passTurn() {
  currentIndex = (currentIndex + 1) % players.length;
  renderPlayers();
}

export function addToRoundTotal(amount) {
  currentPlayer().roundTotal += amount;
  renderPlayers();
}

export function goBankrupt() {
  currentPlayer().roundTotal = 0;
  renderPlayers();
}

// The solver moves their round total into the bank. Everyone else loses theirs.
export function bankWinnings() {
  const solver = currentPlayer();
  solver.bank += solver.roundTotal;
  for (const player of players) {
    player.roundTotal = 0;
  }
  renderPlayers();
}

export function renderPlayers() {
  listElement.innerHTML = '';
  players.forEach((player, i) => {
    const item = document.createElement('li');
    item.className = i === currentIndex ? 'player current' : 'player';
    item.innerHTML = `
      <span class="player-name">${player.name}</span>
      <span>Round: $${player.roundTotal}</span>
      <span>Bank: $${player.bank}</span>`;
    listElement.appendChild(item);
  });
}
