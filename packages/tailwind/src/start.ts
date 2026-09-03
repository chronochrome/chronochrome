import {
  applyCssVars,
  createLightHueTicker,
  sampleLightHue,
  type LightHueSnapshot,
  type LightHueTicker,
  type TickerOptions,
} from "chronohue";

export interface StartOptions extends TickerOptions {
  /** Element to write CSS vars onto. Default: `document.documentElement`. */
  el?: { style: { setProperty(name: string, value: string): void } } | null;
}

export interface ChronoHueHandle extends LightHueTicker {
  readonly snapshot: LightHueSnapshot;
  subscribe: (fn: (snapshot: LightHueSnapshot) => void) => () => void;
}

function resolveTarget(el: StartOptions["el"]): Parameters<typeof applyCssVars>[0] {
  if (el !== undefined) return el;
  if (typeof document !== "undefined") return document.documentElement;
  return null;
}

/**
 * Sample once, apply ChronoHue CSS vars, and keep them fresh.
 * Tailwind utilities (`bg-accent`, …) follow the vars via theme.css / the plugin.
 */
export function start(opts: StartOptions = {}): ChronoHueHandle {
  const { el, ...tickerOpts } = opts;
  let snapshot = sampleLightHue(tickerOpts);
  const listeners = new Set<(s: LightHueSnapshot) => void>();

  const paint = (snap: LightHueSnapshot) => {
    snapshot = snap;
    applyCssVars(resolveTarget(el), snap.cssVars);
    for (const fn of listeners) fn(snap);
  };

  const ticker = createLightHueTicker(paint, tickerOpts);

  return {
    get snapshot() {
      return snapshot;
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(snapshot);
      return () => {
        listeners.delete(fn);
      };
    },
    stop: ticker.stop,
    refresh: ticker.refresh,
  };
}
