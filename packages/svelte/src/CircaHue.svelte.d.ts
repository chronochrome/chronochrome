import type { LightHueSnapshot, SeasonMode } from "@igrs/circahue";
import type { Component, Snippet } from "svelte";

export interface CircaHueProps {
  latitude?: number;
  timeZone?: string;
  season?: SeasonMode;
  intervalMs?: number;
  hourOverride?: number;
  locale?: string;
  includeArcs?: boolean;
  children?: Snippet<[{ snapshot: LightHueSnapshot }]>;
}

declare const CircaHue: Component<CircaHueProps>;
export default CircaHue;
