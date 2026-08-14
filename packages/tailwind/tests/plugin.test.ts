import { describe, expect, it } from "vitest";
import { circahuePlugin } from "../src/plugin.js";

describe("circahuePlugin", () => {
  it("exposes Tailwind { handler, config } shape", () => {
    expect(typeof circahuePlugin.handler).toBe("function");
    expect(circahuePlugin.config.theme.extend.colors.accent.DEFAULT).toBe("var(--accent-primary)");
    expect(circahuePlugin.config.theme.extend.boxShadow.accent).toContain("glow-blur");
  });
});
