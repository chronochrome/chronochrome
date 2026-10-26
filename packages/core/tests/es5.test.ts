import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

import { parse } from "acorn";
import { describe, expect, it } from "vitest";

import { solarAnchoredHour } from "../src/anchor.js";
import { deviceLight, moonPosition } from "../src/device.js";
import { solarPosition } from "../src/ephemeris.js";
import { moonAgeDays, moonPhase } from "../src/moon.js";
import { seasonFactor, seasonShape } from "../src/season.js";
import { lightAt } from "../src/stops.js";

/**
 * `dist/chronochrome.es5.js` is what TV browsers load. It is built, so run
 * `pnpm build` first. It runs here in a realm stripped of what Chromium 38
 * lacks, so a helper that reaches for a newer API fails the test instead of
 * a TV.
 */

const file = resolve(__dirname, "../dist/chronochrome.es5.js");

const STRIP = `
  delete Object.entries; delete Object.values; delete Object.fromEntries;
  delete Object.assign; delete Object.getOwnPropertyDescriptors;
  delete Array.from; delete Array.prototype.includes;
  delete String.prototype.padStart; delete String.prototype.padEnd;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the bundle's API, loaded at runtime
function loadBundle(): any {
  if (!existsSync(file)) throw new Error("dist/chronochrome.es5.js missing: run `pnpm build`");
  const ctx: Record<string, unknown> = {};
  runInNewContext(STRIP, ctx);
  runInNewContext(readFileSync(file, "utf8"), ctx);
  return ctx.chronochrome;
}

/** Largest absolute difference between two values, over every number in them. */
function maxDiff(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b);
  if (a && b && typeof a === "object" && typeof b === "object") {
    let worst = 0;
    for (const key of Object.keys(b)) {
      worst = Math.max(worst, maxDiff((a as never)[key], (b as never)[key]));
    }
    return worst;
  }
  return a === b ? 0 : Infinity;
}

const YAR = { latitude: 57.6261, longitude: 39.8845 };
const YEAR = Date.UTC(2026, 0, 1);

describe("ES5 bundle", () => {
  it("is ES5 syntax", () => {
    expect(() => parse(readFileSync(file, "utf8"), { ecmaVersion: 5 })).not.toThrow();
  });

  it("matches the sources on deviceLight, hourly over a year (viewer looks 272°)", () => {
    const cc = loadBundle();
    let worst = 0;
    for (let h = 0; h < 365 * 24; h++) {
      const at = new Date(YEAR + h * 3_600_000);
      const opts = { at, ...YAR, viewerHeading: 272 };
      worst = Math.max(worst, maxDiff(cc.deviceLight(opts), deviceLight(opts)));
      worst = Math.max(
        worst,
        maxDiff(cc.moonPosition(at, 57.6261, 39.8845), moonPosition(at, 57.6261, 39.8845)),
      );
      worst = Math.max(
        worst,
        maxDiff(cc.solarPosition(at, 57.6261, 39.8845), solarPosition(at, 57.6261, 39.8845)),
      );
      const age = moonAgeDays(at);
      worst = Math.max(
        worst,
        Math.abs(cc.moonAgeDays(at) - age),
        Math.abs(cc.moonPhase(age) - moonPhase(age)),
      );
      const f = seasonFactor("auto", at);
      worst = Math.max(
        worst,
        Math.abs(cc.seasonFactor("auto", at) - f),
        maxDiff(cc.seasonShape(f), seasonShape(f)),
      );
    }
    expect(worst).toBeLessThanOrEqual(1e-9);
  });

  it("matches the sources on lightAt and the solar anchoring, every 15 minutes", () => {
    const cc = loadBundle();
    const anchors = { sunriseHour: 4.2, noonHour: 12.4, sunsetHour: 21.1 };
    let worst = 0;
    for (let q = 0; q < 96; q++) {
      const hour = q / 4;
      worst = Math.max(worst, maxDiff(cc.lightAt(hour), lightAt(hour)));
      worst = Math.max(
        worst,
        Math.abs(cc.solarAnchoredHour(hour, anchors) - solarAnchoredHour(hour, anchors)),
      );
    }
    expect(worst).toBeLessThanOrEqual(1e-9);
  });
});
