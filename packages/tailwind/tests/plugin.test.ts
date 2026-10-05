import { describe, expect, it } from "vitest";
import { chronochromePlugin } from "../src/plugin.js";

describe("chronochromePlugin", () => {
  it("exposes Tailwind { handler, config } shape", () => {
    expect(typeof chronochromePlugin.handler).toBe("function");
    expect(chronochromePlugin.config.theme.extend.colors.accent.DEFAULT).toBe(
      "var(--accent-primary)",
    );
    expect(chronochromePlugin.config.theme.extend.boxShadow.accent).toContain("glow-blur");
  });
});
