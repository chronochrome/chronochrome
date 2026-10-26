/**
 * Sun and moon directions in the frame of a fixed screen — a TV on a wall, a
 * kiosk — so a UI can place highlights where the real light would fall.
 *
 * Device frame (right-handed, like screen space):
 *   x — to the right, as seen by someone facing the screen
 *   y — straight up
 *   z — out of the screen, toward the viewer (the screen normal)
 *
 * `viewerHeading` is the true compass bearing you look along when you stand in
 * front of the screen and face it — the reading a phone compass gives there.
 * The screen itself faces the opposite way. A magnetic compass reads off by
 * the local magnetic declination (about +12° in Yaroslavl); add it before
 * passing.
 *
 *   viewer ──── viewerHeading ───▶ ▮ screen
 */

import { solarPosition } from "./ephemeris.js";
import { toDeg, toRad } from "./math.js";

export interface SkyDirection {
  /** Degrees clockwise from true north. */
  azimuthDeg: number;
  /** Degrees above the horizon. */
  altitudeDeg: number;
}

export interface DeviceLightVector extends SkyDirection {
  /** Unit vector toward the body, device frame. */
  x: number;
  y: number;
  /** Cosine of the angle to the screen normal; > 0 means in front of the screen. */
  z: number;
}

export interface DeviceLight {
  sun: DeviceLightVector;
  moon: DeviceLightVector;
}

export interface DeviceLightOptions {
  at: Date;
  latitude: number;
  longitude: number;
  /** True bearing the viewer looks along to face the screen, degrees. */
  viewerHeading: number;
}

function wrap360(deg: number): number {
  const r = deg % 360;
  return r < 0 ? r + 360 : r;
}

/** Equatorial (hour angle, declination) → horizontal, azimuth from north. */
function toHorizontal(hourAngleDeg: number, declDeg: number, latDeg: number): SkyDirection {
  const h = toRad(hourAngleDeg);
  const d = toRad(declDeg);
  const lat = toRad(latDeg);
  const sinAlt = Math.sin(lat) * Math.sin(d) + Math.cos(lat) * Math.cos(d) * Math.cos(h);
  const azFromSouth = Math.atan2(
    Math.sin(h) * Math.cos(d),
    Math.cos(h) * Math.cos(d) * Math.sin(lat) - Math.sin(d) * Math.cos(lat),
  );
  return {
    azimuthDeg: wrap360(toDeg(azFromSouth) + 180),
    altitudeDeg: toDeg(Math.asin(Math.min(1, Math.max(-1, sinAlt)))),
  };
}

/** Sun azimuth and altitude (NOAA position from `ephemeris.ts`). */
export function sunDirection(at: Date, latitudeDeg: number, longitudeDeg: number): SkyDirection {
  const p = solarPosition(at, latitudeDeg, longitudeDeg);
  return toHorizontal(p.hourAngleDeg, p.declinationDeg, latitudeDeg);
}

export interface MoonPosition extends SkyDirection {
  declinationDeg: number;
  rightAscensionDeg: number;
}

/**
 * Moon position from the Astronomical Almanac low-precision series (~0.3°).
 * Unlike `moon.ts`, which is a design model tied to phase, this is the real sky.
 *
 * shortcut: geocentric, no parallax — up to ~1° low near the horizon; add the
 * topocentric correction if a port needs sub-degree moon positions.
 */
export function moonPosition(at: Date, latitudeDeg: number, longitudeDeg: number): MoonPosition {
  const d = at.getTime() / 86_400_000 + 2_440_587.5 - 2_451_545;
  const t = d / 36_525;
  const s = (deg: number) => Math.sin(toRad(deg));

  const lambda =
    218.32 +
    481_267.881 * t +
    6.29 * s(135.0 + 477_198.87 * t) -
    1.27 * s(259.3 - 413_335.36 * t) +
    0.66 * s(235.7 + 890_534.22 * t) +
    0.21 * s(269.9 + 954_397.74 * t) -
    0.19 * s(357.5 + 35_999.05 * t) -
    0.11 * s(186.5 + 966_404.03 * t);
  const beta =
    5.13 * s(93.3 + 483_202.02 * t) +
    0.28 * s(228.2 + 960_400.89 * t) -
    0.28 * s(318.3 + 6_003.15 * t) -
    0.17 * s(217.6 - 407_332.21 * t);

  const eps = toRad(23.439 - 0.013 * t);
  const lam = toRad(lambda);
  const bet = toRad(beta);
  const x = Math.cos(bet) * Math.cos(lam);
  const y = Math.cos(eps) * Math.cos(bet) * Math.sin(lam) - Math.sin(eps) * Math.sin(bet);
  const z = Math.sin(eps) * Math.cos(bet) * Math.sin(lam) + Math.cos(eps) * Math.sin(bet);

  const rightAscensionDeg = wrap360(toDeg(Math.atan2(y, x)));
  const declinationDeg = toDeg(Math.asin(z));
  const gmst = 280.46061837 + 360.98564736629 * d;
  const hourAngleDeg = gmst + longitudeDeg - rightAscensionDeg;

  return {
    ...toHorizontal(hourAngleDeg, declinationDeg, latitudeDeg),
    declinationDeg,
    rightAscensionDeg,
  };
}

/** Rotate a sky direction into the frame of a screen seen along `viewerHeading`. */
export function toDeviceFrame(dir: SkyDirection, viewerHeading: number): DeviceLightVector {
  const alt = toRad(dir.altitudeDeg);
  // Relative to the viewer's line of sight: ahead of the viewer is behind the screen.
  const rel = toRad(dir.azimuthDeg - viewerHeading);
  return {
    azimuthDeg: dir.azimuthDeg,
    altitudeDeg: dir.altitudeDeg,
    x: Math.cos(alt) * Math.sin(rel),
    y: Math.sin(alt),
    z: -Math.cos(alt) * Math.cos(rel),
  };
}

/** Sun and moon as unit vectors in the screen's frame. */
export function deviceLight(opts: DeviceLightOptions): DeviceLight {
  const { at, latitude, longitude, viewerHeading } = opts;
  return {
    sun: toDeviceFrame(sunDirection(at, latitude, longitude), viewerHeading),
    moon: toDeviceFrame(moonPosition(at, latitude, longitude), viewerHeading),
  };
}
