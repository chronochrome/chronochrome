import { readFileSync } from "node:fs";
import { sampleLightHue } from "chronochrome";
import { describe, expect, it } from "vitest";
import { tailwindAccentColors, tailwindAccentShadow } from "../src/tokens.js";

// The core writes --light-hue-*-rgb as "r,g,b". Comma-separated channels only
// parse in the legacy rgba(r, g, b, a) form; rgb(r,g,b / a) is invalid CSS and
// browsers drop the whole declaration.
const vars = sampleLightHue({ hourOverride: 18 }).cssVars;
const resolve = (value: string): string =>
  value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => vars[name] ?? "");

const LEGACY_RGBA = /rgba\(\d{1,3},\d{1,3},\d{1,3}, [\d.]+\)/;

describe("glow and ring colours resolve to valid CSS", () => {
  it("in the Tailwind v3 tokens", () => {
    expect(resolve(tailwindAccentColors.accent.glow)).toMatch(
      new RegExp(`^${LEGACY_RGBA.source}$`),
    );
    expect(resolve(tailwindAccentColors.accent.ring)).toMatch(
      new RegExp(`^${LEGACY_RGBA.source}$`),
    );
    expect(resolve(tailwindAccentShadow)).toMatch(LEGACY_RGBA);
  });

  it("in the Tailwind v4 theme.css", () => {
    const css = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");
    expect(css).not.toMatch(/rgb\(var\(--light-hue-[\w-]+-rgb\)\s*\//);
  });
});
