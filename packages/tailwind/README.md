# @chronohue/tailwind

ChronoHue living accent as Tailwind tokens. Two lines, then `bg-accent`.

Core ChronoHue is framework-free. This adapter is the fast path for Tailwind v3 and v4.

[![npm](https://img.shields.io/npm/v/@chronohue/tailwind.svg)](https://www.npmjs.com/package/@chronohue/tailwind)

## Install

```bash
npm install chronohue @chronohue/tailwind
```

## Quick start — Tailwind v4

```css
/* app.css */
@import "tailwindcss";
@import "@chronohue/tailwind/theme.css";
```

```ts
import { start } from "@chronohue/tailwind";

start({
  latitude: 57.63, // Yaroslavl
  timeZone: "Europe/Moscow",
});
```

```html
<button class="bg-accent hover:bg-accent-hover text-black shadow-accent">Go</button>
```

`start()` writes ChronoHue CSS vars onto `:root` and refreshes them once a minute. `@theme inline` maps those vars to utilities, so colors keep moving without a rebuild.

## Quick start — Tailwind v3

```js
// tailwind.config.js
import chronohue from "@chronohue/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,svelte,vue}"],
  plugins: [chronohue],
};
```

```ts
import { start } from "@chronohue/tailwind";

start({ latitude: 57.63, timeZone: "Europe/Moscow" });
```

Same utilities: `bg-accent`, `text-accent-dim`, `ring-accent-ring`, `shadow-accent`.

## Utilities

| Class                                         | Source                   |
| --------------------------------------------- | ------------------------ |
| `bg-accent` / `text-accent` / `border-accent` | `--accent-primary`       |
| `*-accent-hover`                              | `--accent-primary-hover` |
| `*-accent-dim`                                | `--accent-primary-dim`   |
| `*-accent-glow`                               | glow rgb + alpha         |
| `*-accent-ring`                               | ring rgb + alpha         |
| `shadow-accent`                               | glow blur + glow color   |

Brand accent ≠ status. Leave `green` / `red` for success / danger.

## API

### `start(opts?): ChronoHueHandle`

Same options as `createLightHueTicker` from `chronohue`, plus `el` to paint a node other than `<html>`.

```ts
const hue = start({
  latitude: 40.71,
  timeZone: "America/New_York",
  season: "auto",
  intervalMs: 60_000,
});

hue.snapshot.accent.hex;
hue.stop();
```

`subscribe` is a Svelte-style store contract if you want the snapshot in UI.

## Sibling adapters

| Host        | Package                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| Core        | [`chronohue`](https://github.com/isamarin/chronohue)                     |
| Svelte 5    | [`@chronohue/svelte`](https://github.com/isamarin/chronohue-svelte)       |
| Bootstrap 5 | [`@chronohue/bootstrap`](https://github.com/isamarin/chronohue-bootstrap) |

## License

MIT · isamarin × BLMK
