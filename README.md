# chronochrome

**Circadian accent hues** from clock time, season and observer latitude — pure
TypeScript, no DOM, zero runtime dependencies. Plus framework adapters and a
sun/moon sky widget.

[![CI](https://github.com/chronochrome/chronochrome/actions/workflows/ci.yml/badge.svg)](https://github.com/chronochrome/chronochrome/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/chronochrome.svg)](https://www.npmjs.com/package/chronochrome)

Demo: **https://chronohue.isamarin.xyz/**

## Packages

| Package                                         | Path                                       | What it is                                    |
| ----------------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| [`chronochrome`](packages/core)                 | [`packages/core`](packages/core)           | Core: palette, solar/moon math, CSS vars      |
| [`@chronochrome/tailwind`](packages/tailwind)   | [`packages/tailwind`](packages/tailwind)   | Tailwind v3 plugin / v4 theme tokens          |
| [`@chronochrome/svelte`](packages/svelte)       | [`packages/svelte`](packages/svelte)       | Svelte 5 store and `<ChronoChrome>` component |
| [`@chronochrome/bootstrap`](packages/bootstrap) | [`packages/bootstrap`](packages/bootstrap) | Bootstrap 5 `--bs-primary` mapping            |
| [`@chronochrome/widget`](packages/widget)       | [`packages/widget`](packages/widget)       | Sun and moon on their day arcs (SVG)          |
| `@chronochrome/demo` (private)                  | [`apps/demo`](apps/demo)                   | Interactive playground, deployed to Luma      |

Adapters and the widget take `chronochrome` as a **peer dependency**, so an app
always has exactly one copy of the core.

```bash
npm install chronochrome @chronochrome/tailwind
```

## Quick start

```ts
import { sampleLightHue, applyCssVars, createLightHueTicker } from "chronochrome";

const snap = sampleLightHue({
  latitude: 57.63, // e.g. Yaroslavl
  timeZone: "Europe/Moscow",
  season: "auto", // auto | winter | mid | summer
  hourOverride: 18, // optional dial / demo
  includeArcs: true, // SVG sun/moon day chart
});

// browser
applyCssVars(document.documentElement, snap.cssVars);

const ticker = createLightHueTicker(
  (s) => {
    applyCssVars(document.documentElement, s.cssVars);
  },
  { latitude: 57.63, timeZone: "Europe/Moscow", intervalMs: 60_000 },
);

// later: ticker.stop();
```

## Documentation

| Topic                                                                        | Where                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Full API, solar events, golden hour, anchoring to the sun, time zones, ports | [`packages/core/README.md`](packages/core/README.md)                   |
| Tailwind v3 / v4                                                             | [`packages/tailwind/README.md`](packages/tailwind/README.md)           |
| Svelte 5                                                                     | [`packages/svelte/README.md`](packages/svelte/README.md)               |
| Bootstrap 5                                                                  | [`packages/bootstrap/README.md`](packages/bootstrap/README.md)         |
| Sky widget                                                                   | [`packages/widget/README.md`](packages/widget/README.md)               |
| Cross-language ports: reference values                                       | [`packages/core/vectors/solar.json`](packages/core/vectors/solar.json) |

## Development

Requires Node ≥ 18 and pnpm 9 (`corepack enable`).

```bash
pnpm install
pnpm dev              # demo with HMR → http://localhost:5173 (reads package sources directly)
pnpm build            # all packages, in dependency order
pnpm test
pnpm quality          # build, typecheck, lint, prettier, tests, publint — what CI runs
pnpm build:demo       # static demo → apps/demo/site
```

Work on one package: `pnpm --filter @chronochrome/svelte test`.

## Releasing

Versions are managed with [Changesets](https://github.com/changesets/changesets):

1. In your PR run `pnpm changeset`, pick packages and bump type, describe the change.
2. On merge to `main` the Release workflow opens a **Version Packages** PR.
3. Merging that PR publishes the bumped packages to npm with provenance.

Details, tokens and one-time setup: [PUBLISH.md](PUBLISH.md).

## License

MIT
