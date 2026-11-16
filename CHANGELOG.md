# What's new

The version is shown on the last line of Settings. How the numbers work: see *Versioning* in the README. Phones get a new version the first time the app is opened after it is pushed (a few seconds after opening).

## 1.1.0
- **Copy and Paste:** long press the number to copy the answer or paste a number in. Copied numbers have no thousands commas, so they paste into any app. Pasting accepts things like `1,234.50` or `RM 99`. On a keyboard, Ctrl/Cmd+C and Ctrl/Cmd+V work too.
- **Very long numbers:** answers past 16 digits are shown short, like `1.5e21`, and the small "= answer" line shrinks to fit instead of being cut off.
- **Faster updates:** a new version now shows on the first open instead of the second. (This update itself still needs two opens, because the old version does the fetching.)
- Maths tests (`test.js`) now run on GitHub on every push, and a version is only released if they pass.

## 1.0.1
- Better page title and description, so search engines and shared links show what the app is.

## 1.0.0
- First numbered release: version numbers now look like `1.0.0`.
- Settings shows the app version on the last line.
- Includes everything listed under *Before 1.0.0* in CHANGELOG.md.

## Before 1.0.0
### build v26
- Settings now has **Appearance** (Light, Dark, Follow System) and **Theme** as two separate choices.
- Themes: Classic, Sakura, Lavender, Navy and Forest, each with a light and a dark version.
- Peach, Carbon and the earlier "Auto" themes were removed. Phones that had picked one get the closest match.

### build v23 – v25
- First Theme setting, with pink and other colour themes plus Auto choices (replaced by v26).

### build v22
- The sum you are typing is kept if the app is closed, and is back on screen when you reopen it.

### build v21
- After flicking the history, AC now stops at the newest line instead of drifting.

### build v20
- History always opens scrolled to the newest line.

### Earlier builds
- **%** stays on screen and in the history (`100−6% = 94`) and can go before or after the number.
- Long-press 🗑 recovers cleared history: the history fades back in and the 🗑 key flashes.
- Scientific panel (⠿) over the history, Full Screen history pill and thin scrollbar.
- Settings page: History, Keyboard Vibration, Decimal Places.
- Keys grow while pressed and act on touch-down for fast typing; vibration on key press.
- 🗑 tap clears the number and history.
- First version: keypad, history tape, works offline, home screen icon.
