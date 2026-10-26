import { describe, expect, it } from "vitest";

import { deviceLight, moonPosition, sunDirection, toDeviceFrame } from "../src/device.js";
import { solarEvents } from "../src/golden.js";
import { sampleLightHue } from "../src/sample.js";

const YAR = { latitude: 57.6261, longitude: 39.8845, timeZone: "Europe/Moscow" };

describe("device frame", () => {
  it("maps the screen normal, the viewer's right and the zenith onto z, x, y", () => {
    // The viewer looks west at 272°, so the screen faces east at 92°.
    expect(toDeviceFrame({ azimuthDeg: 92, altitudeDeg: 0 }, 272).z).toBeCloseTo(1);
    expect(toDeviceFrame({ azimuthDeg: 272, altitudeDeg: 0 }, 272).z).toBeCloseTo(-1);
    // Looking west, the viewer's right is north.
    expect(toDeviceFrame({ azimuthDeg: 2, altitudeDeg: 0 }, 272).x).toBeCloseTo(1);
    expect(toDeviceFrame({ azimuthDeg: 0, altitudeDeg: 90 }, 272).y).toBeCloseTo(1);
  });

  it("lights a screen seen looking west in the morning, not the afternoon", () => {
    const at = (time: string) => new Date(`2026-10-27T${time}:00+03:00`);
    const opts = { latitude: YAR.latitude, longitude: YAR.longitude, viewerHeading: 272 };
    expect(deviceLight({ at: at("09:00"), ...opts }).sun.z).toBeGreaterThan(0);
    expect(deviceLight({ at: at("15:00"), ...opts }).sun.z).toBeLessThan(0);
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
      viewerHeading: 272,
    });
    expect(sun.x * moon.x + sun.y * moon.y + sun.z * moon.z).toBeLessThan(-0.99);
  });
});

describe("sampleLightHue viewerHeading", () => {
  it("adds device vectors only when viewerHeading is set", () => {
    const at = new Date("2026-09-02T18:00:00+03:00");
    expect(sampleLightHue({ at, ...YAR }).device).toBeUndefined();
    const { device } = sampleLightHue({ at, ...YAR, viewerHeading: 92 });
    // Early evening in September the sun is low in the west: in front of a screen seen looking east.
    expect(device!.sun.altitudeDeg).toBeGreaterThan(0);
    expect(device!.sun.z).toBeGreaterThan(0.5);
  });
});
