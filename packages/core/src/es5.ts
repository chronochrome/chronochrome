/**
 * Entry for `dist/chronochrome.es5.js`, the build for old TV browsers
 * (Chromium 38+). Only what a palette and glare need; nothing here touches
 * `Intl`, which those engines support only in part.
 */

export { lightAt, DAY_STOPS } from "./stops.js";
export { seasonFactor, seasonShape } from "./season.js";
export {
  solarAnchoredHour,
  PALETTE_SUNRISE_HOUR,
  PALETTE_NOON_HOUR,
  PALETTE_SUNSET_HOUR,
} from "./anchor.js";
export { solarPosition } from "./ephemeris.js";
export { deviceLight, toDeviceFrame, sunDirection, moonPosition } from "./device.js";
export { moonAgeDays, moonPhase } from "./moon.js";
