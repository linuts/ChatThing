# ChatThing

Lightweight, drop‑in widget that mounts a draggable chat popup onto any page. The script auto-loads required styles, injects markup, and provides responsive behaviors from phone peek sheets to desktop floating panels.

## Live Demo (Real live support for Parts4heating.com)
https://linuts.github.io/ChatThing/

## Features
- Launcher badge and peek hint with customizable colors pulled from script `data-*` attributes.
- Touch gestures: swipe up to open, swipe down to minimize or close, tap buttons for quick actions.
- Desktop drag handle plus viewport clamping keeps the panel accessible on large screens.
- Graceful fallback copy when the chat endpoint is unreachable, with optional contact phone/email.

## Usage
1. Copy `index.html` as a reference for embedding the script. The key attributes are:
   - `data-chat-url`, `data-contact-phone`, `data-contact-email`
   - `data-primary-color`, `data-secondary-color`
   - Optional `data-text-primary-color`, `data-text-secondary-color`, `data-pill-text`
2. Host `src/Chat.js` and `src/Chat.css` together; the script resolves the stylesheet relative to itself.
3. Include the script via `<script src="path/to/Chat.js" …></script>` before `</body>`.

## Development Notes
- `src/Chat.js` handles DOM injection, theming, and interaction logic.
- `src/Chat.css` defines the UI skin, including peek-state tweaks and responsive layouts.
- Adjust constants such as peek thresholds inside `Chat.js` if interaction tuning is required.

## Testing
Open `index.html` locally to exercise the widget. Use browser dev tools for mobile emulation to verify swipe gestures and color theming. No automated test suite is currently configured.
