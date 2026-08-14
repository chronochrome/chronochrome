# @igrs/circahue-svelte

CircaHue living accent for Svelte 5. One `start()` in the layout — or `$hue` when you need the snapshot.

Core CircaHue is framework-free. This adapter is the fast path: a readable store plus an optional `<CircaHue>` component.

[![npm](https://img.shields.io/npm/v/@igrs/circahue-svelte.svg)](https://www.npmjs.com/package/@igrs/circahue-svelte)

## Install

```bash
npm install @igrs/circahue @igrs/circahue-svelte
```

## Quick start

`+layout.svelte` — paint CSS vars and forget it:

```svelte
<script>
  import { start } from "@igrs/circahue-svelte";

  start({
    latitude: 57.63,
    timeZone: "Europe/Moscow",
  });
</script>

<slot />
```

```css
button.brand {
  background: var(--accent-primary);
}
button.brand:hover {
  background: var(--accent-primary-hover);
}
```

## Reactive snapshot

`start` / `createCircaHue` is a Svelte readable store, so `$hue` just works:

```svelte
<script>
  import { createCircaHue } from "@igrs/circahue-svelte";

  const hue = createCircaHue({
    latitude: 57.63,
    timeZone: "Europe/Moscow",
  });
</script>

<p style="color: {$hue.accent.hex}">{$hue.phaseLabel} · {$hue.accent.hex}</p>
```

Call `hue.stop()` in an `$effect` cleanup if the store is created inside a component that can unmount.

## `<CircaHue>`

Snippet-style wrapper that owns the ticker lifetime:

```svelte
<script>
  import CircaHue from "@igrs/circahue-svelte/CircaHue.svelte";
</script>

<CircaHue latitude={57.63} timeZone="Europe/Moscow">
  {#snippet children({ snapshot })}
    <mark style="background: {snapshot.accent.hex}">{snapshot.phaseLabel}</mark>
  {/snippet}
</CircaHue>
```

## API

### `createCircaHue(opts?)` / `start(opts?)`

Same options as `createLightHueTicker` from `@igrs/circahue`, plus:

| Option | Meaning                                                                  |
| ------ | ------------------------------------------------------------------------ |
| `el`   | Node to paint. Default `<html>`. Pass `false` to skip DOM (SSR / tests). |

Returns `{ snapshot, subscribe, refresh, stop }`.

## Sibling adapters

| Host        | Package                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| Core        | [`@igrs/circahue`](https://github.com/isamarin/circahue)                     |
| Tailwind    | [`@igrs/circahue-tailwind`](https://github.com/isamarin/circahue-tailwind)   |
| Bootstrap 5 | [`@igrs/circahue-bootstrap`](https://github.com/isamarin/circahue-bootstrap) |

## License

MIT · isamarin × BLMK
