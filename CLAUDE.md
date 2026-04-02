# alfie.love

## Versioning
- ALWAYS update the version after making changes and tell the user the new version number.
- Version is stored in `src/App.jsx` as `APP_VERSION` and displayed in the footer.
- Use semantic versioning (vMAJOR.MINOR.PATCH):
  - PATCH (x.x.+1): DEFAULT for most changes — bug fixes, tweaks, small improvements, refactors
  - MINOR (x.+1.0): Only when significant new features are added (or user requests)
  - MAJOR (+1.0.0): Only for major overhauls (requires prior discussion)
- Prefix all commit messages with the version number, e.g. `v1.0.1: Fix scoring bug`

## Stack
- React + Vite
- React Router for navigation
- Deployed via Vercel (auto-deploys on push to main)
- Domain: alfie.love

## Structure
- `src/pages/` — route pages (Home, Games, Blog)
- `src/games/` — game components (SATVocab)
- `src/components/` — shared components (Layout)
- `src/theme.js` — shared color palette
