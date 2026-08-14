# @igrs/circahue-bootstrap

CircaHue living accent as Bootstrap 5 primary. Two lines, then `.btn-primary` follows the sky.

Core CircaHue is framework-free. This adapter is the fast path for Bootstrap 5.3+.

[![npm](https://img.shields.io/npm/v/@igrs/circahue-bootstrap.svg)](https://www.npmjs.com/package/@igrs/circahue-bootstrap)

## Install

```bash
npm install @igrs/circahue @igrs/circahue-bootstrap
```

## Quick start

```css
@import "bootstrap/dist/css/bootstrap.min.css";
@import "@igrs/circahue-bootstrap/theme.css";
```

```ts
import { start } from "@igrs/circahue-bootstrap";

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

`start()` writes CircaHue vars **and** `--bs-primary` / `--bs-primary-rgb` / link tokens. `theme.css` remaps `.btn-primary` and `.btn-outline-primary`, which Bootstrap compiles with Sass and would otherwise ignore runtime `--bs-primary`.

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

### `start(opts?): CircaHueHandle`

Same options as `createLightHueTicker` from `@igrs/circahue`, plus `el`.

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
| Core     | [`@igrs/circahue`](https://github.com/isamarin/circahue)                   |
| Tailwind | [`@igrs/circahue-tailwind`](https://github.com/isamarin/circahue-tailwind) |
| Svelte 5 | [`@igrs/circahue-svelte`](https://github.com/isamarin/circahue-svelte)     |

## License

MIT · isamarin × BLMK
