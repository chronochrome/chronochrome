import { describe, expect, it } from "vitest";
import { tailwindAccentColors, tailwindAccentShadow } from "../src/tokens.js";

describe("tailwindAccentColors", () => {
  it("points DEFAULT/hover/dim at CircaHue CSS vars", () => {
    expect(tailwindAccentColors.accent.DEFAULT).toBe("var(--accent-primary)");
    expect(tailwindAccentColors.accent.hover).toBe("var(--accent-primary-hover)");
    expect(tailwindAccentColors.accent.dim).toBe("var(--accent-primary-dim)");
  });

  it("builds glow/ring from rgb + alpha vars", () => {
    expect(tailwindAccentColors.accent.glow).toContain("--light-hue-glow-rgb");
    expect(tailwindAccentColors.accent.ring).toContain("--light-hue-ring-rgb");
  });

  it("shadow uses glow blur token", () => {
    expect(tailwindAccentShadow).toContain("--light-hue-glow-blur");
  });
});
