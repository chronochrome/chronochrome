<script lang="ts">
  import { createChronoHue } from "@chronohue/svelte";
  import type { LightHueSnapshot, SeasonMode } from "chronohue";
  import type { Snippet } from "svelte";

  let {
    latitude,
    timeZone,
    season = "auto",
    intervalMs = 60_000,
    hourOverride,
    locale,
    includeArcs,
    children,
  }: {
    latitude?: number;
    timeZone?: string;
    season?: SeasonMode;
    intervalMs?: number;
    hourOverride?: number;
    locale?: string;
    includeArcs?: boolean;
    children?: Snippet<[{ snapshot: LightHueSnapshot }]>;
  } = $props();

  const hue = createChronoHue({
    latitude,
    timeZone,
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
