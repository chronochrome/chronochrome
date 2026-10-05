<script lang="ts">
  import { createChronoChrome } from "@chronochrome/svelte";
  import type { LightHueSnapshot, SeasonMode } from "chronochrome";
  import type { Snippet } from "svelte";

  let {
    latitude,
    longitude,
    timeZone,
    hourMode,
    season = "auto",
    intervalMs = 60_000,
    hourOverride,
    locale,
    includeArcs,
    children,
  }: {
    latitude?: number;
    longitude?: number;
    timeZone?: string;
    hourMode?: "clock" | "solar";
    season?: SeasonMode;
    intervalMs?: number;
    hourOverride?: number;
    locale?: string;
    includeArcs?: boolean;
    children?: Snippet<[{ snapshot: LightHueSnapshot }]>;
  } = $props();

  const hue = createChronoChrome({
    latitude,
    longitude,
    timeZone,
    hourMode,
    season,
    intervalMs,
    hourOverride,
    locale,
    includeArcs,
  });

  $effect(() => {
    return () => hue.stop();
  });
</script>

{#if children}
  {@render children({ snapshot: $hue })}
{/if}
