# Gravity Wells TD

Gravity Wells TD is an experimental tower-defense prototype built with TypeScript, Vite and HTML5
canvas. Instead of bullets, towers sculpt the map's curvature: each well alters a global potential
field that bends creep trajectories into kill-zones or looping orbits.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

   Vite will launch a local dev server (defaults to [http://localhost:5173](http://localhost:5173))
   with hot-module reloading.

3. **Lint and test**

   ```bash
   npm run lint
   npm test
   ```

## Project layout

- `src/engine/` — minimal rendering + game loop utilities.
- `src/game/world/` — potential-field solver and visualiser.
- `src/game/towers/` — gravity-well tower base class and demo implementation.
- `src/game/creeps/` — creep steering logic that follows the negative ∇φ.
- `src/game/systems/` — support managers such as the global mass budget.
- `src/game/ui/` — lightweight HUD overlays for debugging.
- `docs/` — design notes and diagrams.

## Next steps

- Add interactive tower placement/removal with mouse input.
- Introduce enemy archetypes (boss counter-warps, fragment swarms).
- Drive balance data from `src/config/` YAML/JSON files.
- Expand automated tests (Vitest) to cover potential-field maths.

## Tooling

- [Vite](https://vitejs.dev/) for bundling and the dev server.
- [TypeScript](https://www.typescriptlang.org/) for typed gameplay code.
- [Vitest](https://vitest.dev/) for unit tests.
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for linting and formatting.
