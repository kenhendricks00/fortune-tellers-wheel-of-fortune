# Fortune Tellers: Wheel of Fortune

CSC 381-31, Sprint 1

## Team

- Kenneth Hendricks
- Mohamad Ghazia
- Trajan Womack

## About the project

This is a Wheel of Fortune game for three players who share one device. It is written in plain JavaScript modules and uses Three.js to draw and spin the wheel. Players take turns spinning, calling consonants, buying vowels and solving the puzzle. Each player has a round total and a bank, and only the player who solves the puzzle banks their round money.

## Install and run

There is nothing to install besides a way to run a local web server. The game uses JavaScript modules, so opening `index.html` straight from the file system usually won't work. It has to be served over HTTP.

1. Unzip `Fortune_Tellers_Sprint1.zip`.
2. Open a terminal in the `Fortune_Tellers_Sprint1` folder.
3. Start a server with either of these commands:

   ```
   npx serve
   ```

   ```
   python -m http.server 8000
   ```

   `npx serve` needs Node.js. The second command needs Python 3 (on some Macs it is `python3`).
4. Open the address the server prints in a browser. For the Python command that is http://localhost:8000.

Three.js is loaded from a CDN (jsDelivr), so the computer needs an internet connection. To stop the server, press Ctrl+C in the terminal.

## How to play

The game opens on Round 1 with a random puzzle from `puzzles.js` and Player 1's turn. The highlighted row in the player list shows whose turn it is.

The wheel has 24 wedges: 21 cash wedges, two Bankrupt and one Lose a Turn. The cash wedges run from $500 to $900, plus one top wedge that is worth $2,500 in round 1, $3,500 in rounds 2 and 3, and $5,000 in round 4 and every round after that.

1. Click **Spin**. The button stays disabled until the wheel stops.
2. On a cash wedge, type a consonant and click **Guess**. Every match is revealed and you earn the wedge value for each one.
3. Between spins you can buy a vowel for $500 of round money, or type the full answer and click **Solve**. Once every vowel in the puzzle is showing, the game says there are no more vowels and the vowel box is turned off. Case, spaces and punctuation don't matter when solving.
4. A missed letter, a letter that was already called or a wrong solve passes the turn. Lose a Turn passes the turn. Bankrupt also sets your round total to $0, but your bank is not touched.
5. When someone solves the puzzle, their round total goes into their bank and every round total resets to $0. Click **Next Puzzle** to start the next round. The wheel redraws with that round's top value.

## Files

- `index.html` - page layout, styles and the Three.js import map
- `wheel-data.js` - the 24 wedges (label, value, type and color) and the top value for each round
- `wheel.js` - draws the 3D wheel and pointer, animates the spin and redraws the wheel face for a new round
- `main.js` - Spin button, result text, the `spinWheel()` function and `setRound()`
- `puzzles.js` - category and puzzle pairs
- `board.js` - puzzle board tiles, revealing letters and checking a solve
- `players.js` - the three players, whose turn it is, round totals and banks
- `letters.js` - the used-letters board
- `game.js` - round flow: round counter, spin results, consonants, vowels, solving and banking
- `README.md` - this file

## Using the spin result

`spinWheel()` in `main.js` spins the wheel and returns a Promise with the wedge it landed on. The landing wedge is picked before the animation starts, and the wheel stops on that same wedge. You can also pass a wedge index to force a result.

```js
import { spinWheel } from './main.js';

const wedge = await spinWheel();
// { label: '$650', value: 650, type: 'cash', color: '#43a047' }
```

Every spin also fires a `spinresult` event on `document`, which `game.js` listens for:

```js
document.addEventListener('spinresult', (event) => {
  const { wedge, index } = event.detail;
  if (wedge.type === 'bankrupt') {
    // ...
  }
});
```

Wedge types are `cash`, `bankrupt` and `lose-turn`.

## Sprint 1 stories

Status as of October 28, 2026. All 11 stories work in this build.

| Story | Title | Owner | Points | Status |
| ---: | --- | --- | ---: | --- |
| 2 | Choose clue and display puzzle board | Trajan Womack | 5 | Complete (still to be committed to GitHub) |
| 3 | Create wheel for the round | Kenneth Hendricks | 8 | Complete (on GitHub main, round values still to be committed) |
| 4 | Control player turns | Mohamad Ghazia | 5 | Complete (still to be committed to GitHub) |
| 5 | Spin wheel and show result | Mohamad Ghazia | 3 | Complete (still to be committed to GitHub) |
| 6 | Animate wheel spin | Kenneth Hendricks | 8 | Complete (on GitHub main) |
| 7 | Guess consonant and update results | Trajan Womack | 5 | Complete (still to be committed to GitHub) |
| 8 | Buy vowel and update results | Trajan Womack | 3 | Complete (still to be committed to GitHub) |
| 9 | Show previously guessed letters | Mohamad Ghazia | 2 | Complete (still to be committed to GitHub) |
| 10 | Enforce Bankrupt and Lose a Turn | Mohamad Ghazia | 3 | Complete (still to be committed to GitHub) |
| 11 | Check puzzle solution | Trajan Womack | 3 | Complete (still to be committed to GitHub) |
| 12 | Bank winnings after a solved puzzle | Mohamad Ghazia | 3 | Complete (still to be committed to GitHub) |

That covers all 48 Sprint 1 points.

## Links

- Trello board: https://trello.com/b/AJDkaNk8/csc-381-wheel-of-fortune
- GitHub repository: https://github.com/kenhendricks00/fortune-tellers-wheel-of-fortune
