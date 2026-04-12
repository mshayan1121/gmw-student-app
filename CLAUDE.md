# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Zoud × GMW UAE 2026 Student App** — A financial literacy gamification app for Grade 8 students during Global Money Week. No build tools, no npm, no frameworks. Pure vanilla HTML/CSS/JS, deployed to Vercel.

## Running Locally

No build step required. Serve via any static HTTP server (required because screen partials are fetched via `fetch()`):

```bash
npx serve .
# or
python -m http.server 8080
```

The app is a fixed-height (700px) SPA shell at `index.html`. The landing page is a separate standalone HTML file at `landing-page/index.html`.

## Architecture

### SPA Router (`js/router.js`)
- Calls `goTo(screenId)` to navigate between screens
- On `DOMContentLoaded`, fetches all 6 screen partials from `screens/*.html` and injects them into `#main-content`
- Screens are toggled by adding/removing the `.active` class on `#screen-{name}` divs
- Sidebar nav items trigger navigation; active states are updated accordingly

### Shared State & Icons (`js/state.js`)
- Holds `totalPoints` and exports icon helper functions: `si()`, `st()`, `stxt()`, `stch()`
- These helpers inject Lucide icons into elements by selector after HTML is in the DOM
- `initIcons()` must be called after any screen HTML is injected — icons are CDN-loaded via `lucide.createIcons()`

### Game Logic (`js/game-budget-blitz.js`)
- Self-contained game state: `cur`, `score`, `streak`, `bestStreak`, `answered`, `timerInt`
- 5 scenarios defined in the `SCENARIOS` array (each has question, budget, 3 choices with feedback)
- Game loop: `loadRound()` → `startTimer()` → user picks → `showFeedback()` → `nextRound()`
- Attaches event listeners to `.choice-btn` elements after each round loads

### Screens (`screens/*.html`)
- Plain HTML partials — no scripts, no inline event handlers (handlers attached from JS files)
- Each screen's root element is `<div id="screen-{name}">`

### Styling (`styles/global.css`)
- Single monolithic CSS file; all component styles live here
- Key layout classes: `.app` (flex container), `.sb` (sidebar, 216px), `.tb` (top bar, 54px), `.screen` (scrollable content area)
- Grid helpers: `.row2`, `.row3`, `.row4`
- Color palette: Purple `#4B44CC` (primary), Amber `#FFB800` (points), Teal `#0F6E56` (success), Coral `#FF6B6B` (error)
- Animations: `fadeUp`, `blink`, `pop`, `shake`, `flyup`

## Deployment

Vercel (`vercel.json`) rewrites:
- `/landing-page/*` → `landing-page/index.html`
- Everything else → `index.html` (SPA catch-all)

## Key Conventions

- Icons are always injected after DOM insertion via `initIcons()` or targeted `si()`/`st()` calls — never rely on icons being present before this runs
- Game screens reuse the same DOM elements each round; `loadRound()` updates content in-place rather than re-rendering
- No external state library — game state is module-level variables in `game-budget-blitz.js`
- The landing page (`landing-page/index.html`) is completely standalone and has no dependency on the SPA or its JS files
