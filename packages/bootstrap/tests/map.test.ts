import { sampleLightHue } from "@igrs/circahue";
import { describe, expect, it } from "vitest";
import { BOOTSTRAP_VAR_KEYS, bootstrapVars, hexToRgbCss } from "../src/map.js";

const FIXED = new Date("2026-07-01T12:00:00Z");

describe("hexToRgbCss", () => {
  it("parses #rrggbb", () => {
    expect(hexToRgbCss("#ffe4a0")).toBe("255,228,160");
  });

  it("parses #rgb", () => {
    expect(hexToRgbCss("#f0a")).toBe("255,0,170");
  });

  it("falls back on garbage", () => {
    expect(hexToRgbCss("nope")).toBe("0,0,0");
  });
});

describe("bootstrapVars", () => {
  it("mirrors accent onto --bs-primary and link tokens", () => {
    const snap = sampleLightHue({
      at: FIXED,
      hourOverride: 12,
      season: "summer",
    });
    const vars = bootstrapVars(snap);
    expect(vars["--bs-primary"]).toBe(snap.accent.hex);
    expect(vars["--bs-primary-rgb"]).toBe(snap.accent.rgbCss);
    expect(vars["--bs-link-color"]).toBe(snap.accent.hex);
    expect(vars["--bs-link-hover-color"]).toBe(snap.accentHover);
    expect(vars["--bs-link-hover-color-rgb"]).toBe(hexToRgbCss(snap.accentHover));
    expect(vars["--bs-focus-ring-color"]).toContain(snap.glow.rgb);
  });

  it("covers the documented key list", () => {
    const snap = sampleLightHue({ hourOverride: 0 });
    const vars = bootstrapVars(snap);
    for (const key of BOOTSTRAP_VAR_KEYS) {
      expect(vars[key]).toBeTruthy();
    }
  });
});
