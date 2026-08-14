import { afterEach, describe, expect, it } from "vitest";
import { start } from "../src/start.js";

const FIXED = new Date("2026-07-01T12:00:00Z");

describe("start", () => {
  const handles: { stop: () => void }[] = [];
  afterEach(() => {
    for (const h of handles) h.stop();
    handles.length = 0;
  });

  it("samples immediately", () => {
    const hue = start({
      at: FIXED,
      hourOverride: 12,
      season: "summer",
      intervalMs: 60_000,
    });
    handles.push(hue);
    expect(hue.snapshot.accent.hex.startsWith("#")).toBe(true);
  });

  it("subscribe fires now and on refresh", () => {
    const hue = start({ at: FIXED, hourOverride: 18, intervalMs: 60_000 });
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
