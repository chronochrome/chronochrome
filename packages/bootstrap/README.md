# @chronohue/bootstrap

ChronoHue living accent as Bootstrap 5 primary. Two lines, then `.btn-primary` follows the sky.

Core ChronoHue is framework-free. This adapter is the fast path for Bootstrap 5.3+.

[![npm](https://img.shields.io/npm/v/@chronohue/bootstrap.svg)](https://www.npmjs.com/package/@chronohue/bootstrap)

## Install

```bash
npm install chronohue @chronohue/bootstrap
```

## Quick start

```css
@import "bootstrap/dist/css/bootstrap.min.css";
@import "@chronohue/bootstrap/theme.css";
```

```ts
import { start } from "@chronohue/bootstrap";

start({
  latitude: 57.63,
  timeZone: "Europe/Moscow",
});
```

```html
<button class="btn btn-primary">Go</button>
<a class="link-primary" href="#">Follow the hour</a>
<span class="badge text-bg-primary">now</span>
```

`start()` writes ChronoHue vars **and** `--bs-primary` / `--bs-primary-rgb` / link tokens. `theme.css` remaps `.btn-primary` and `.btn-outline-primary`, which Bootstrap compiles with Sass and would otherwise ignore runtime `--bs-primary`.

## What moves

| Surface                                                  | Source                    |
| -------------------------------------------------------- | ------------------------- |
| `--bs-primary`, `--bs-primary-rgb`                       | accent hex / rgb          |
| `--bs-link-color`, `--bs-link-hover-color`               | accent / hover            |
| `--bs-focus-ring-color`                                  | glow                      |
| `--bs-primary-bg-subtle` / border / text-emphasis        | `color-mix` of accent     |
| `.btn-primary`, `.btn-outline-primary`                   | remapped in `theme.css`   |
| `.text-primary`, `.bg-primary`, `.badge.text-bg-primary` | follow `--bs-primary-rgb` |

**Not remapped:** `--bs-success`, `--bs-danger`, `--bs-warning`. Brand accent ≠ status.

## API

### `start(opts?): ChronoHueHandle`

Same options as `createLightHueTicker` from `chronohue`, plus `el`.

```ts
const hue = start({ latitude: 40.71, timeZone: "America/New_York" });
hue.snapshot.accent.hex;
hue.stop();
```

### `bootstrapVars(snapshot)`

Pure map if you already have a snapshot and want to apply it yourself.

## Sibling adapters

| Host     | Package                                                                    |
| -------- | -------------------------------------------------------------------------- |
| Core     | [`chronohue`](https://github.com/isamarin/chronohue)                   |
| Tailwind | [`@chronohue/tailwind`](https://github.com/isamarin/chronohue-tailwind) |
| Svelte 5 | [`@chronohue/svelte`](https://github.com/isamarin/chronohue-svelte)     |

## License

MIT · isamarin × BLMK
