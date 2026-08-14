import {
  applyCssVars,
  createLightHueTicker,
  sampleLightHue,
  type LightHueSnapshot,
  type LightHueTicker,
  type TickerOptions,
} from "@igrs/circahue";

export interface StartOptions extends TickerOptions {
  /** Element to write CSS vars onto. Default: `document.documentElement`. `false` skips DOM. */
  el?: { style: { setProperty(name: string, value: string): void } } | null | false;
}

export interface CircaHueStore extends LightHueTicker {
  readonly snapshot: LightHueSnapshot;
  subscribe: (fn: (snapshot: LightHueSnapshot) => void) => () => void;
}

function resolveTarget(el: StartOptions["el"]): Parameters<typeof applyCssVars>[0] {
  if (el === false) return null;
  if (el !== undefined) return el;
  if (typeof document !== "undefined") return document.documentElement;
  return null;
}

/**
 * Svelte-store CircaHue handle. Use as `$hue` in a component, or call `start()`
 * once in `+layout.svelte` and forget it — CSS vars stay on `<html>`.
 */
export function createCircaHue(opts: StartOptions = {}): CircaHueStore {
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

/** Alias — same object, shorter import when you only want the one-liner. */
export const start = createCircaHue;
