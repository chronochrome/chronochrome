import { describe, expect, it } from "vitest";

import { deviceLight, moonPosition, sunDirection, toDeviceFrame } from "../src/device.js";
import { solarEvents } from "../src/golden.js";
import { sampleLightHue } from "../src/sample.js";

const YAR = { latitude: 57.6261, longitude: 39.8845, timeZone: "Europe/Moscow" };

describe("device frame", () => {
  it("maps the screen normal, the viewer's right and the zenith onto z, x, y", () => {
    const ahead = toDeviceFrame({ azimuthDeg: 272, altitudeDeg: 0 }, 272);
    expect(ahead.z).toBeCloseTo(1);
    // A viewer facing a west-looking screen faces east; their right is south.
    const right = toDeviceFrame({ azimuthDeg: 182, altitudeDeg: 0 }, 272);
    expect(right.x).toBeCloseTo(1);
    const up = toDeviceFrame({ azimuthDeg: 0, altitudeDeg: 90 }, 272);
    expect(up.y).toBeCloseTo(1);
  });
});

describe("sky positions", () => {
  it("puts the sun due south at solar noon", () => {
    const { solarNoon } = solarEvents({ at: new Date("2026-06-21T12:00:00+03:00"), ...YAR });
    expect(sunDirection(solarNoon, YAR.latitude, YAR.longitude).azimuthDeg).toBeCloseTo(180, 0);
  });

  it("matches Meeus example 47.a for the moon", () => {
    const m = moonPosition(new Date("1992-04-12T00:00:00Z"), 0, 0);
    expect(Math.abs(m.rightAscensionDeg - 134.688)).toBeLessThan(0.5);
    expect(Math.abs(m.declinationDeg - 13.768)).toBeLessThan(0.5);
  });

  it("puts a full moon opposite the sun", () => {
    const { sun, moon } = deviceLight({
      at: new Date("2024-01-25T17:54:00Z"),
      latitude: YAR.latitude,
      longitude: YAR.longitude,
      heading: 272,
    });
    expect(sun.x * moon.x + sun.y * moon.y + sun.z * moon.z).toBeLessThan(-0.99);
  });
});

describe("sampleLightHue heading", () => {
  it("adds device vectors only when heading is set", () => {
    const at = new Date("2026-09-02T18:00:00+03:00");
    expect(sampleLightHue({ at, ...YAR }).device).toBeUndefined();
    const { device } = sampleLightHue({ at, ...YAR, heading: 272 });
    // Early evening in September: the sun is low in the west, in front of a west-facing screen.
    expect(device!.sun.altitudeDeg).toBeGreaterThan(0);
    expect(device!.sun.z).toBeGreaterThan(0.5);
  });
});
