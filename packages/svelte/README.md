# @chronochrome/svelte

ChronoChrome living accent for Svelte 5. One `start()` in the layout — or `$hue` when you need the snapshot.

Core ChronoChrome is framework-free. This adapter is the fast path: a readable store plus an optional `<ChronoChrome>` component.

[![npm](https://img.shields.io/npm/v/@chronochrome/svelte.svg)](https://www.npmjs.com/package/@chronochrome/svelte)

## Install

```bash
npm install chronochrome @chronochrome/svelte
```

## Quick start

`+layout.svelte` — paint CSS vars and forget it:

```svelte
<script>
  import { start } from "@chronochrome/svelte";

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

`start` / `createChronoChrome` is a Svelte readable store, so `$hue` just works:

```svelte
<script>
  import { createChronoChrome } from "@chronochrome/svelte";

  const hue = createChronoChrome({
    latitude: 57.63,
    timeZone: "Europe/Moscow",
  });
</script>

<p style="color: {$hue.accent.hex}">{$hue.phaseLabel} · {$hue.accent.hex}</p>
```

Call `hue.stop()` in an `$effect` cleanup if the store is created inside a component that can unmount.

## `<ChronoChrome>`

Snippet-style wrapper that owns the ticker lifetime:

```svelte
<script>
  import ChronoChrome from "@chronochrome/svelte/ChronoChrome.svelte";
</script>

<ChronoChrome latitude={57.63} timeZone="Europe/Moscow">
  {#snippet children({ snapshot })}
    <mark style="background: {snapshot.accent.hex}">{snapshot.phaseLabel}</mark>
  {/snippet}
</ChronoChrome>
```

## API

### `createChronoChrome(opts?)` / `start(opts?)`

Same options as `createLightHueTicker` from `chronochrome`, plus:

| Option | Meaning                                                                  |
| ------ | ------------------------------------------------------------------------ |
| `el`   | Node to paint. Default `<html>`. Pass `false` to skip DOM (SSR / tests). |

Returns `{ snapshot, subscribe, refresh, stop }`.

## Sibling adapters

| Host        | Package                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| Core        | [`chronochrome`](https://github.com/chronochrome/chronochrome/tree/main/packages/core)                 |
| Tailwind    | [`@chronochrome/tailwind`](https://github.com/chronochrome/chronochrome/tree/main/packages/tailwind)   |
| Bootstrap 5 | [`@chronochrome/bootstrap`](https://github.com/chronochrome/chronochrome/tree/main/packages/bootstrap) |

## License

MIT · isamarin × BLMK
