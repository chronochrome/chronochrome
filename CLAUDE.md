# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

pnpm 9 workspace (`corepack enable`), Node ≥ 18.

```bash
pnpm install
pnpm build            # all packages (core first; adapters depend on its dist/)
pnpm test             # vitest in every package
pnpm quality          # build, typecheck, lint, prettier check, test, publint — what CI runs
pnpm dev              # demo at http://localhost:5173, reads package sources directly
pnpm build:demo       # static demo → apps/demo/site

pnpm --filter @chronochrome/svelte test                    # one package
pnpm --filter chronochrome exec vitest run tests/zoned.test.ts   # one file
pnpm --filter chronochrome exec vitest run -t "sunrise"    # by test name
```

Adapter and widget packages import `chronochrome` through its `exports`, which point only at `dist/`. Build core (`pnpm --filter chronochrome build`) before testing or typechecking an adapter, and rebuild it after changing core. Core's own `tests/es5.test.ts` also reads the built `dist/chronochrome.es5.js`.

## Architecture

- `packages/core` (`chronochrome`): pure TypeScript, no DOM, zero runtime deps. `sampleLightHue()` in `src/sample.ts` is the central pure function. It turns time, latitude, season and time zone into a `LightHueSnapshot` (accent colors, glow/ring, sun/moon positions, optional SVG arcs, `cssVars`). The other modules feed it:
  - `stops.ts`: palette keyframes (`DAY_STOPS`) interpolated by hour.
  - `season.ts`: scales glow, blur and ring by a season factor.
  - `solar.ts`: the simple solar model used for the snapshot's sun/moon altitude.
  - `ephemeris.ts` / `golden.ts`: the accurate solar path (sunrise, sunset, golden hour).
  - `anchor.ts`: with `hourMode: "solar"`, warps the clock so the palette's sunrise and sunset stops line up with the real ones.
  - `zoned.ts`: IANA time-zone math through `Intl`.
  - `css.ts`: the CSS variable contract (`CSS_VAR_KEYS`: `--accent-primary*`, `--light-hue-*`). Adapters depend on these names.
  - `ticker.ts`: re-samples on an interval.
- Cross-language contract: the core `build` also runs `scripts/export-artifacts.mjs` against `dist/`. It writes `dist/palette.json` and regenerates the committed file `vectors/solar.json`. `tests/vectors.test.ts` asserts the implementation against that file. If you change the solar math intentionally, rebuild and commit the regenerated vectors. If vectors change when you did not mean them to, treat it as a regression.
- Adapters (`tailwind`, `svelte`, `bootstrap`) are thin layers. Each has a `start()` that wraps `sampleLightHue` and `createLightHueTicker`, writes `cssVars` onto an element, and maps them to framework tokens (Tailwind plugin and `theme.css`, Bootstrap `--bs-primary`, a Svelte store and component). The Svelte component ships as source (`src/ChronoChrome.svelte`), not bundled.
- `packages/widget`: draws the sun/moon sky as SVG from a snapshot. Its tests run under jsdom; all other packages test in the node environment.
- `apps/demo` (private): a Vite playground. `vite.config.ts` aliases `chronochrome` and `@chronochrome/widget` to their `src/`, so the demo needs no build. Deploy scripts live in `apps/demo/deploy`. GitHub workflows `luma.yml` and `pages.yml` deploy it.
- Every non-core package lists `chronochrome` as a peer dependency and as a `workspace:^` devDependency, so apps get exactly one copy of the core.

## Releasing

Use Changesets. Add a changeset (`pnpm changeset`) to every PR that changes a published package. Merging to `main` opens a "Version Packages" PR, and merging that PR publishes to npm. Never run `npm publish` inside a package: `workspace:^` ranges are rewritten only by `changeset publish` / `pnpm pack`. See `PUBLISH.md`.

## Conventions

- ESM with `.js` extensions in relative TS imports (`./sample.js`). Each package is built by tsup into ESM, CJS and `.d.ts`.
- Prettier formats the whole repo (`pnpm format`). CI fails on `format:check`.
