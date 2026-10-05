import type { LightHueSnapshot, SeasonMode } from "chronohue";
import type { Component, Snippet } from "svelte";

export interface ChronoHueProps {
  latitude?: number;
  timeZone?: string;
  season?: SeasonMode;
  intervalMs?: number;
  hourOverride?: number;
  locale?: string;
  includeArcs?: boolean;
  children?: Snippet<[{ snapshot: LightHueSnapshot }]>;
}

declare const ChronoHue: Component<ChronoHueProps>;
export default ChronoHue;
