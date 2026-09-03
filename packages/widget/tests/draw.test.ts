import { sampleLightHue } from "chronohue";
import { describe, expect, it } from "vitest";
import { ARC_HEIGHT, drawSky } from "../src/draw.js";

describe("drawSky", () => {
  it("places the sun circle on the noon sample of the sun path", () => {
    const snap = sampleLightHue({
      hourOverride: 12,
      latitude: 57.63,
      season: "summer",
      includeArcs: true,
      arcHeight: ARC_HEIGHT,
    });
    const a = snap.arcs!;
    expect(a.height).toBe(150);
    expect(a.sun.x).toBeCloseTo(150);

    const chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    drawSky(chart, snap);

    const sun = chart.querySelector(".ch-sky-sun");
    expect(sun?.getAttribute("cx")).toBe(String(a.sun.x));
    expect(sun?.getAttribute("cy")).toBe(String(a.sun.y));
    expect(a.sunPath).toContain(`${a.sun.x.toFixed(1)},${a.sun.y.toFixed(1)}`);
    expect(chart.getAttribute("preserveAspectRatio")).toBe("xMidYMid meet");
  });

  it("places the moon circle on its path sample", () => {
    const snap = sampleLightHue({
      hourOverride: 18,
      latitude: 57.63,
      includeArcs: true,
      arcHeight: ARC_HEIGHT,
    });
    const a = snap.arcs!;
    const chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    drawSky(chart, snap);
    const moon = chart.querySelector(".ch-sky-moon-outline");
    expect(moon?.getAttribute("cx")).toBe(String(a.moon.x));
    expect(moon?.getAttribute("cy")).toBe(String(a.moon.y));
  });
});
