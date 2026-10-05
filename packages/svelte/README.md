# @chronohue/svelte

ChronoHue living accent for Svelte 5. One `start()` in the layout — or `$hue` when you need the snapshot.

Core ChronoHue is framework-free. This adapter is the fast path: a readable store plus an optional `<ChronoHue>` component.

[![npm](https://img.shields.io/npm/v/@chronohue/svelte.svg)](https://www.npmjs.com/package/@chronohue/svelte)

## Install

```bash
npm install chronohue @chronohue/svelte
```

## Quick start

`+layout.svelte` — paint CSS vars and forget it:

```svelte
<script>
  import { start } from "@chronohue/svelte";

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

`start` / `createChronoHue` is a Svelte readable store, so `$hue` just works:

```svelte
<script>
  import { createChronoHue } from "@chronohue/svelte";

  const hue = createChronoHue({
    latitude: 57.63,
    timeZone: "Europe/Moscow",
  });
</script>

<p style="color: {$hue.accent.hex}">{$hue.phaseLabel} · {$hue.accent.hex}</p>
```

Call `hue.stop()` in an `$effect` cleanup if the store is created inside a component that can unmount.

## `<ChronoHue>`

Snippet-style wrapper that owns the ticker lifetime:

```svelte
<script>
  import ChronoHue from "@chronohue/svelte/ChronoHue.svelte";
</script>

<ChronoHue latitude={57.63} timeZone="Europe/Moscow">
  {#snippet children({ snapshot })}
    <mark style="background: {snapshot.accent.hex}">{snapshot.phaseLabel}</mark>
  {/snippet}
</ChronoHue>
```

## API

### `createChronoHue(opts?)` / `start(opts?)`

Same options as `createLightHueTicker` from `chronohue`, plus:

| Option | Meaning                                                                  |
| ------ | ------------------------------------------------------------------------ |
| `el`   | Node to paint. Default `<html>`. Pass `false` to skip DOM (SSR / tests). |

Returns `{ snapshot, subscribe, refresh, stop }`.

## Sibling adapters

| Host        | Package                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| Core        | [`chronohue`](https://github.com/isamarin/chronohue)                     |
| Tailwind    | [`@chronohue/tailwind`](https://github.com/isamarin/chronohue-tailwind)   |
| Bootstrap 5 | [`@chronohue/bootstrap`](https://github.com/isamarin/chronohue-bootstrap) |

## License

MIT · isamarin × BLMK
