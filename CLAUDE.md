# alfie.love

## Versioning
- ALWAYS update the version after making changes and tell the user the new version number.
- Version is stored in `src/App.jsx` as `APP_VERSION` and displayed in the nav bar and footer.
- Use semantic versioning (vMAJOR.MINOR.PATCH):
  - PATCH (x.x.+1): DEFAULT for most changes — bug fixes, tweaks, small improvements, refactors
  - MINOR (x.+1.0): Only when significant new features are added (or user requests)
  - MAJOR (+1.0.0): Only for major overhauls (requires prior discussion)
- Prefix all commit messages with the version number, e.g. `v1.0.1: Fix scoring bug`
- Current version: v1.15.3

## Stack
- React + Vite
- React Router for navigation
- Deployed via Vercel (auto-deploys on push to main)
- Domain: alfie.love
- GitHub: MaxiePod/alfie-love

## Structure
- `src/pages/` — route pages (Home, Games, Blog, LexiconPage, VexillumPage, CapitoliumPage)
- `src/games/` — game components (SATVocab, FlagGame, CapitalsGame)
- `src/components/` — shared components (Layout with nav + footer)
- `src/theme.js` — shared color palette (dark theme)

## Adding a new game
1. Create component in `src/games/GameName.jsx`
2. Create page wrapper in `src/pages/GameNamePage.jsx` (just imports and renders the component)
3. Add route in `src/App.jsx`
4. Add entry to `games` array in `src/pages/Games.jsx`

## Games
- **Lexicon** (SATVocab.jsx) — SAT vocab, 230+ words with synonyms, offline scoring, Learn Mode with localStorage
- **Vexillum** (FlagGame.jsx) — 245 flags, uses flagcdn.com fallback on Windows
- **Capitolium** (CapitalsGame.jsx) — 197 country capitals, multiple choice or typed

## Git workflow
- Build with `npx vite build`, commit, push — Vercel auto-deploys
- Auth: token stored in git credential manager, remote URL is clean (no token)
