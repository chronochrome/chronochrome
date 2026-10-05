import type { LightHueSnapshot, SeasonMode } from "chronochrome";
import type { Component, Snippet } from "svelte";

export interface ChronoChromeProps {
  latitude?: number;
  timeZone?: string;
  season?: SeasonMode;
  intervalMs?: number;
  hourOverride?: number;
  locale?: string;
  includeArcs?: boolean;
  children?: Snippet<[{ snapshot: LightHueSnapshot }]>;
}

declare const ChronoChrome: Component<ChronoChromeProps>;
export default ChronoChrome;
