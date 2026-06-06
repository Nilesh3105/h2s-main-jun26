# Sukoon — frontend

React · Vite · TypeScript. The accessible web UI for the Sukoon wellness companion.
See the root [`DESIGN.md`](../DESIGN.md) for the full architecture and the accessibility plan.

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint, including `eslint-plugin-jsx-a11y` (accessibility) |
| `npm run typecheck` | TypeScript, strict mode |
| `npm test` | Vitest + Testing Library + jest-axe (a11y assertions) |
| `npm run format` / `format:check` | Prettier write / check |

## Conventions

- **Accessibility is a gate, not an afterthought.** Native semantic HTML, visible focus,
  `prefers-reduced-motion`, no color-only meaning. jsx-a11y runs at lint time and jest-axe at
  test time; every component ships with an axe assertion.
- TypeScript strict; Prettier owns formatting; ESLint owns correctness + a11y.
- Tests live beside the code they cover (`*.test.tsx`); shared setup in `src/test/`.
