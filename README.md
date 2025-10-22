# ChatThing

ChatThing is a zero-dependency widget that mounts a draggable, swipe-friendly chat surface onto any page. The script self-injects markup, styles, and behavior so teams can bolt on live-chat (or a fake/demo feed) without touching their existing CSS pipeline.

## Live Demo
https://linuts.github.io/ChatThing/

## Quick Start
Embed the widget at the bottom of your page and let the script bootstrap itself. Only the chat URL is required; every other attribute is optional and falls back to sensible defaults.

```html
<script
  src="/path/to/Chat.js"
  data-chat-url="https://help.example.com/live"
  data-contact-email="support@example.com"
  data-contact-phone="603-555-0123"
  data-primary-color="#143382"
  data-secondary-color="#2c5cc5"
  data-text-primary-color="#0e2541"
  data-text-secondary-color="#4d7dff"
  data-button-open-text="Live Help"
  data-button-open-align="right"
  data-button-controls-align="right"
></script>
```

## Script Attributes
| Attribute | Required | Purpose |
| --- | --- | --- |
| `data-chat-url` | ✅ | URL loaded in the iframe (your live system, bot, or demo endpoint). |
| `data-contact-email` | ❌ | Displayed in the fallback view if the iframe cannot load. |
| `data-contact-phone` | ❌ | Optional phone number shown alongside the fallback copy. |
| `data-primary-color` | ❌ | Brand color used for the launcher button and accents (`#143382` default). |
| `data-secondary-color` | ❌ | Accent color for peek hints and badges (`#f1b800` default). |
| `data-text-primary-color` | ❌ | Copy color for fallback text (`#0e2541` default). |
| `data-text-secondary-color` | ❌ | Accent color for fallback links (`#2c5cc5` default). |
| `data-button-open-text` | ❌ | Label placed inside the launcher badge (`Chat` default). |
| `data-button-open-align` | ❌ | `left` or `right` alignment for the launcher (defaults to `right`). |
| `data-button-controls-align` | ❌ | `left` or `right` alignment for the close/minimize controls (`right` default). |
| `data-pill-text` | ❌ | Override the hint text shown on the mobile peek state. |

All attributes accept direct values in the markup or can be set dynamically at runtime by updating the script element’s dataset before the widget initializes.

## Behavior Highlights
- Responsive layouts toggle between a mobile peek sheet and desktop floating panel without extra breakpoints.
- Touch gestures support swipe-to-open, swipe-to-close, and quick throwing the panel back to the corner.
- Desktop users get a drag handle with viewport clamping so the window never disappears off-screen.
- When the iframe fails to load, a branded fallback with contact info keeps visitors from hitting dead ends.

## Local Demo & Development
- `index.html` shows a minimal integration that points the widget at `fake-chat.html` (a static stub that fakes chat responses).
- `src/Chat.js` contains both the logic and inline stylesheet—no bundler required. Adjust colors, thresholds, or easing curves directly in that file.
- The script is framework-agnostic and can be inserted from any static host or tag manager. If you need to bundle it, keep the module as-is so the inline CSS remains intact.

## Testing
Open `index.html` in a browser (or run `python -m http.server` and browse to it) to exercise the widget. Use device emulation to verify gesture handling and confirm color overrides. Automated tests are not yet configured; manual validation is recommended after tweaking behavior constants.

## License
GPL-3.0 (see `LICENSE`).
