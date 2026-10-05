import type { LightHueSnapshot, SeasonMode } from "chronochrome";
import type { Component, Snippet } from "svelte";

export interface ChronoChromeProps {
  latitude?: number;
  /** Degrees east. Needed for `hourMode: "solar"`. */
  longitude?: number;
  timeZone?: string;
  /** `clock` (default) or `solar` — see the core README. */
  hourMode?: "clock" | "solar";
  season?: SeasonMode;
  intervalMs?: number;
  hourOverride?: number;
  locale?: string;
  includeArcs?: boolean;
  children?: Snippet<[{ snapshot: LightHueSnapshot }]>;
}

declare const ChronoChrome: Component<ChronoChromeProps>;
export default ChronoChrome;
