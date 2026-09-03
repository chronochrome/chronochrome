import { describe, expect, it } from "vitest";
import { chronohuePlugin } from "../src/plugin.js";

describe("chronohuePlugin", () => {
  it("exposes Tailwind { handler, config } shape", () => {
    expect(typeof chronohuePlugin.handler).toBe("function");
    expect(chronohuePlugin.config.theme.extend.colors.accent.DEFAULT).toBe("var(--accent-primary)");
    expect(chronohuePlugin.config.theme.extend.boxShadow.accent).toContain("glow-blur");
  });
});
