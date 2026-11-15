# Calculator

A clean, simple calculator for iPhone, built as a home screen web app.
No App Store, no account, no tracking — just open it in Safari and add it to your home screen.

**▶ Live app:** https://hoh57.github.io/calculator/

<img src="icon-180.png" alt="App icon" width="90">

## Install on iPhone

1. Open **https://hoh57.github.io/calculator/** in **Safari**.
2. Tap **Share** → **Add to Home Screen** → **Add**.
3. Open it from the home screen icon. It runs full screen and works offline after the first open.

## Features

### Keypad
- AC, +/−, %, ← (backspace), ⠿ (scientific), 🗑 (clear), ≡ (settings), tall =
- Keys grow and lighten while pressed
- × and ÷ are done before + and −
- No floating-point junk: `0.1 + 0.2 = 0.3`

### Percent (%)
The % stays on screen and in the history (e.g. `100−6% = 94`).

| You type   | Result | Why                         |
|------------|--------|-----------------------------|
| `100−6%`   | 94     | 6% of 100, taken off        |
| `100−%6`   | 94     | % can go before the number  |
| `200×10%`  | 20     | 10% of 200                  |
| `80÷10%`   | 800    | 80 ÷ 0.1                    |
| `50%`      | 0.5    | plain percent               |
| `100−6%×2` | 99.88  | more follows, so 6% = 0.06  |

← deletes just the %, and a second % is ignored.

### Scientific panel (⠿)
2nd, sin / cos / tan and inverses, sinh / cosh / tanh and inverses, logᵧ, log₂ / 2ˣ, ln / eˣ, log₁₀ / 10ˣ, x!, √, ∛, ʸ√x, e, π, Rand, x², x³, xʸ, ( ) and a Deg/Rad switch (Deg by default).

- A function applies to the number you just typed (`30 sin` → `sin(30)`); otherwise it opens `sin(`.
- `2π` and `2(3+4)` multiply automatically. Missing `)` are closed when you press =.

### History
- Tape grouped by date; tap a past answer to reuse it
- Full Screen history view (the pill appears while you scroll)
- 🗑 tap clears the number and history; **long-press 🗑** brings the last cleared history back

### Settings (≡)
- History on/off
- Keyboard Vibration on/off
- Decimal Places: Unlimited, or fixed 0–5 (e.g. `10.00`)
- Theme: Auto (Classic Light / Classic, Blush / Sakura, or Slate / Navy — follows Light or Dark mode), Classic, Classic Light, Sakura, Lavender, Peach, Blush, Navy, Forest, Carbon or Slate

## Privacy

History and settings are saved only on your phone (browser storage). Nothing is sent anywhere.

## Project files

| File                   | What it is                                           |
|------------------------|------------------------------------------------------|
| `index.html`           | The whole app: layout, styles and logic in one file  |
| `sw.js`                | Service worker — keeps the app working offline        |
| `manifest.webmanifest` | App name, colours and icons for "Add to Home Screen" |
| `icon-*.png`           | App icons (180 for iPhone, 192/512 for others)       |

No build step and no libraries — it is plain HTML, CSS and JavaScript.

## Making changes

1. Edit the files and push to `main`. GitHub Pages serves the repo root.
2. **Bump `CACHE` in `sw.js`** (e.g. `calc-v19` → `calc-v20`) on every push that changes the app.
   Phones show the new version on the **second** open after the push (the first open quietly downloads it).

To test on a computer, serve the folder locally (a service worker needs http, not `file://`):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

### iPhone quirks — keep these
- Status bar meta must be `black`, not `black-translucent` (translucent cut off the bottom of the app).
  Changing it needs the home screen icon deleted and re-added.
- Don't force `height:100vh` in standalone mode — it clipped the bottom row.
- Haptics: iOS blocks vibration started from code, so each key has an invisible
  `<input type="checkbox" switch>` the finger flips for real. A long press never ticks.
- Keys act on `pointerdown` (fast taps were dropped with `click`); 🗑, ≡ and ⠿ act on release.

## License

[MIT](LICENSE)
