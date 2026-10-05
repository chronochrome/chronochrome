# @chronochrome/tailwind

ChronoChrome living accent as Tailwind tokens. Two lines, then `bg-accent`.

Core ChronoChrome is framework-free. This adapter is the fast path for Tailwind v3 and v4.

[![npm](https://img.shields.io/npm/v/@chronochrome/tailwind.svg)](https://www.npmjs.com/package/@chronochrome/tailwind)

## Install

```bash
npm install chronochrome @chronochrome/tailwind
```

## Quick start — Tailwind v4

```css
/* app.css */
@import "tailwindcss";
@import "@chronochrome/tailwind/theme.css";
```

```ts
import { start } from "@chronochrome/tailwind";

start({
  latitude: 57.63, // Yaroslavl
  timeZone: "Europe/Moscow",
});
```

```html
<button class="bg-accent hover:bg-accent-hover text-black shadow-accent">Go</button>
```

`start()` writes ChronoChrome CSS vars onto `:root` and refreshes them once a minute. `@theme inline` maps those vars to utilities, so colors keep moving without a rebuild.

## Quick start — Tailwind v3

```js
// tailwind.config.js
import chronochrome from "@chronochrome/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,svelte,vue}"],
  plugins: [chronochrome],
};
```

```ts
import { start } from "@chronochrome/tailwind";

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

### `start(opts?): ChronoChromeHandle`

Same options as `createLightHueTicker` from `chronochrome`, plus `el` to paint a node other than `<html>`.

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

| Host        | Package                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| Core        | [`chronochrome`](https://github.com/chronochrome/chronochrome/tree/main/packages/core)                 |
| Svelte 5    | [`@chronochrome/svelte`](https://github.com/chronochrome/chronochrome/tree/main/packages/svelte)       |
| Bootstrap 5 | [`@chronochrome/bootstrap`](https://github.com/chronochrome/chronochrome/tree/main/packages/bootstrap) |

## License

MIT · isamarin × BLMK
