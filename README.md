# Fortune Tellers: Wheel of Fortune

Team project for CSC381.

## Team

- Kenneth Hendricks
- Mohamad Ghazia
- Trajan Womack

## Running the game

The game uses JavaScript modules, so it has to be served over HTTP. Opening
`index.html` directly from the file system usually won't work.

From the project folder, start a local server with either of these:

```
npx serve
```

```
python -m http.server 8000
```

Then open the address it prints (for `python`, http://localhost:8000). Three.js
is loaded from a CDN, so you need an internet connection.

## Files

- `index.html` - page layout, styles and the Three.js import map
- `wheel-data.js` - the 24 wedges (label, value, type and color)
- `wheel.js` - draws the 3D wheel and pointer and animates the spin
- `main.js` - Spin button, result text and the `spinWheel()` function

## Using the spin result

`spinWheel()` from `main.js` spins the wheel and returns a Promise with the
wedge it landed on. You can also pass a wedge index to force a result.

```js
import { spinWheel } from './main.js';

const wedge = await spinWheel();
// { label: '$650', value: 650, type: 'cash', color: '#43a047' }
```

Every spin also fires a `spinresult` event on `document`:

```js
document.addEventListener('spinresult', (event) => {
  const { wedge, index } = event.detail;
  if (wedge.type === 'bankrupt') {
    // ...
  }
});
```

Wedge types are `cash`, `bankrupt` and `lose-turn`.
