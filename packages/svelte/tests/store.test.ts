import { afterEach, describe, expect, it } from "vitest";
import { createChronoChrome, start } from "../src/store.js";

const FIXED = new Date("2026-07-01T12:00:00Z");

describe("createChronoChrome", () => {
  const handles: { stop: () => void }[] = [];
  afterEach(() => {
    for (const h of handles) h.stop();
    handles.length = 0;
  });

  it("start is an alias of createChronoChrome", () => {
    expect(start).toBe(createChronoChrome);
  });

  it("samples immediately and exposes a hex accent", () => {
    const hue = createChronoChrome({
      at: FIXED,
      hourOverride: 12,
      season: "summer",
      intervalMs: 60_000,
      el: false,
    });
    handles.push(hue);
    expect(hue.snapshot.accent.hex.startsWith("#")).toBe(true);
    expect(hue.snapshot.cssVars["--accent-primary"]).toBe(hue.snapshot.accent.hex);
  });

  it("is a readable store: subscribe now, on refresh, unsubscribe", () => {
    const hue = createChronoChrome({
      at: FIXED,
      hourOverride: 18,
      season: "mid",
      intervalMs: 60_000,
      el: false,
    });
    handles.push(hue);
    const seen: string[] = [];
    const unsub = hue.subscribe((s) => {
      seen.push(s.accent.hex);
    });
    expect(seen).toHaveLength(1);
    hue.refresh();
    expect(seen).toHaveLength(2);
    unsub();
    hue.refresh();
    expect(seen).toHaveLength(2);
  });
});
