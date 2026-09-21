# iHub Landing Page — Claude Working Project

This folder is a cleaned, self-contained version of the supplied iHub HTML design.

## Entry point
- `index.html` — main working page.

## Local/offline dependencies
- React and ReactDOM are bundled under `js/` and loaded locally.
- `js/resources-inline.js` contains the original embedded visual/font resources.
- Original asset files are preserved under `assets/` and `fonts/`.

## How to work on it
Open the project folder in Claude Code (or another code editor) and edit `index.html` and the supporting files under `js/`, `assets/`, and `fonts/`.

For a browser preview, use a local HTTP server from this folder, for example:
`python -m http.server 8000`
Then open `http://localhost:8000/`.

## Notes
- The supplied source was already a React-based, self-contained HTML document.
- The external React CDN references were replaced with the supplied local React/ReactDOM builds so the project does not depend on unpkg at runtime.
- `ORIGINAL_SOURCE.html` is kept as a backup/reference and was not modified.
