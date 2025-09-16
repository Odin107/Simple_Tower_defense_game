# Contributing

Thanks for your interest in Gravity Wells TD! This repository is a TypeScript + Vite project designed
for rapid iteration from VS Code.

## Prerequisites

- Node.js 20+
- npm 9+

## Workflow

1. Fork + clone the repository.
2. Install dependencies with `npm install`.
3. Use `npm run dev` while iterating—the canvas will hot-reload via Vite.
4. Before opening a PR, run:

   ```bash
   npm run lint
   npm run test
   ```

5. Please keep changes formatted (`npm run format`).

## Code style

- Prefer modern TypeScript features and `async`/`await` where applicable.
- Use module path alias `@/` for imports within `src/`.
- Keep gameplay systems pure where possible; push DOM mutations into the engine/UI layers.

## Testing

Vitest is configured with a JSDOM environment. Add unit tests alongside the modules under test using
the `.test.ts` suffix.
