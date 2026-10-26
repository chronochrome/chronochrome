# chronochrome

**Circadian accent hues** from clock time, season, and observer latitude.

Pure TypeScript — **no DOM, no React, zero runtime deps**.  
Born as the Lightmotiv “living light” accent (code name _light-hue_); npm package **`chronochrome`**.

[![CI](https://github.com/chronochrome/chronochrome/actions/workflows/ci.yml/badge.svg)](https://github.com/chronochrome/chronochrome/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/chronochrome.svg)](https://www.npmjs.com/package/chronochrome)

## Install

```bash
npm install chronochrome
```

## Adapters

Core stays framework-free. For a 30-second drop-in:

| Host             | Package                                                                                                | Fast path                             |
| ---------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Tailwind v3 / v4 | [`@chronochrome/tailwind`](https://github.com/chronochrome/chronochrome/tree/main/packages/tailwind)   | `start()` + `bg-accent`               |
| Svelte 5         | [`@chronochrome/svelte`](https://github.com/chronochrome/chronochrome/tree/main/packages/svelte)       | `start()` / `$hue` / `<ChronoChrome>` |
| Bootstrap 5      | [`@chronochrome/bootstrap`](https://github.com/chronochrome/chronochrome/tree/main/packages/bootstrap) | `start()` + `.btn-primary`            |

All adapters live in the [chronochrome monorepo](https://github.com/chronochrome/chronochrome).

## Quick start

```ts
import { sampleLightHue, applyCssVars, createLightHueTicker } from "chronochrome";

const snap = sampleLightHue({
  latitude: 57.63, // e.g. Yaroslavl
  timeZone: "Europe/Moscow",
  season: "auto", // auto | winter | mid | summer
  hourOverride: 18, // optional dial / demo
  includeArcs: true, // SVG sun/moon day chart
});

// browser
applyCssVars(document.documentElement, snap.cssVars);

const ticker = createLightHueTicker(
  (s) => {
    applyCssVars(document.documentElement, s.cssVars);
  },
  { latitude: 57.63, timeZone: "Europe/Moscow", intervalMs: 60_000 },
);

// later: ticker.stop();
```

## What it computes

| Output                         | Source                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Accent RGB / hex / hover / dim | Time-of-day keyframes (midnight → sunrise → zenith → sunset → dusk)                        |
| Glow alpha / blur, ring alpha  | Season shaping (winter soft, summer punchy)                                                |
| Solar altitude & day arc       | Declination + hour angle at latitude                                                       |
| Moon age, phase fill, arc      | Synodic month from 2000-01-06 new moon epoch                                               |
| CSS vars                       | `--accent-primary`, `--accent-primary-hover`, `--accent-primary-dim`, plus `--light-hue-*` |

**Brand accent ≠ status.** Green/red stay for success/danger in the host design system.

## API

### `sampleLightHue(opts?): LightHueSnapshot`

```ts
interface LightHueOptions {
  at?: Date;
  hourOverride?: number; // 0–24
  timeZone?: string; // IANA, e.g. "Europe/Moscow"
  latitude?: number; // default 55.75
  longitude?: number; // degrees east; needed for hourMode "solar" (defaults to 0° — Greenwich)
  hourMode?: "clock" | "solar"; // default "clock", see "Anchoring the palette to the sun"
  season?: "auto" | "winter" | "mid" | "summer";
  includeArcs?: boolean;
  arcHeight?: number;
  locale?: string;
}
```

Also: `lightHueCssVars`, `createLightHueTicker`, `solarDayEvents`, `zonedParts`, `lightAt`, `DAY_STOPS`, …

## Solar events and the golden hour

`solarAltitude` in the palette path is a design model: hour 12 _is_ solar noon and
longitude is ignored. That is invisible in an accent colour and wrong by up to half
an hour in a time — in Yaroslavl (39.88°E, UTC+3) the meridian is at 45°E, so noon
falls at 12:20 before the equation of time adds its own ±15 minutes.

Anything you would schedule against goes through the accurate path instead:

```ts
import { solarEvents, goldenHourWindows, currentOrNextGoldenHour } from "chronochrome";

const place = { latitude: 57.6261, longitude: 39.8845, timeZone: "Europe/Moscow" };

solarEvents({ ...place }); // sunrise / sunset / solarNoon of the local day
goldenHourWindows({ ...place }); // both windows of that day — the marks on an arc
currentOrNextGoldenHour({ ...place }); // the one running now, else the next
```

The golden hour is the sun between **-4°** and **+6°**, not a flat forty minutes
after sunrise. `currentOrNextGoldenHour` rolls into tomorrow once this evening's has
passed, and returns `null` through polar night.

## Anchoring the palette to the sun

`DAY_STOPS` is keyed on hour: sunrise colour at 6.5, zenith at 12, sunset at 18.
That holds around 50°N in spring and nowhere else — in Murmansk in late July the sun
is up at 01:46 while the clock palette only reaches its sunrise stop at 06:30.

`hourMode: "solar"` stretches the palette's hour axis so the observer's real
sunrise, solar noon and sunset land on the keyframes built for them:

```ts
sampleLightHue({ ...place, hourMode: "solar" });
```

Default stays `"clock"`, so published behaviour is unchanged. `snapshot.paletteHour`
shows which hour the palette was actually read at.

Pass `longitude` with `"solar"`: without it the observer is placed on the Greenwich
meridian, which in Moscow moves solar noon by about two and a half hours. Through
polar day or polar night there is no sunrise or sunset to pin, so only solar noon
anchors the axis — the palette is shifted, not stretched, and the night stops still
come at night by the clock even under the midnight sun.

## Fixed screens: sun and moon in device space

A screen that does not move — a TV on a wall, a kiosk — has a fixed orientation.
Stand in front of it, face it, and read a phone compass: that is `viewerHeading`.
The snapshot then carries `device`: the sun and the moon as unit vectors in the
screen's frame, for placing glare and highlights where the real light would fall.

```
viewer ──── viewerHeading ───▶ ▮ screen        (the screen faces the other way)
```

```ts
// You look west at the TV (272°), so the screen faces east (92°):
// the sun is in front of it in the morning, behind it in the afternoon.
const snap = sampleLightHue({ ...place, viewerHeading: 272 });

snap.device?.sun; // { azimuthDeg, altitudeDeg, x, y, z }
snap.device?.moon;
```

Getting the direction backwards moves the glare by twelve hours, with nothing on
screen to show it. If highlights appear in the evening on a screen that gets the
morning sun, check the sign.

- `x`: to the right, as seen by someone facing the screen
- `y`: up
- `z`: out of the screen toward the viewer. `z > 0` means the body is in
  front of the screen. With `altitudeDeg > 0` it is also above the horizon.

`viewerHeading` is a **true** bearing. A phone compass set to magnetic north is
off by the local magnetic declination (about +12° in Yaroslavl), so add it to
the reading. `device` is always taken at `at`, and
`hourOverride` does not move it. The sun comes from the same NOAA path as
`solarEvents`. The moon comes from a low-precision lunar series (~0.3°), not
from the design model behind `snapshot.moon`. The same maths is exported as
`deviceLight`, `sunDirection`, `moonPosition` and `toDeviceFrame`.

## Ports

Two files are built for implementations in other languages:

| File                 | What it is                                                         |
| -------------------- | ------------------------------------------------------------------ |
| `dist/palette.json`  | `DAY_STOPS` and season shaping as data — interpolate, don't retype |
| `vectors/solar.json` | Reference solar values every port asserts against                  |

The vectors are the contract. A port that drifts fails a test instead of quietly
running twenty minutes late. Regenerate with `pnpm --filter chronochrome artifacts`.

## Old TV browsers (ES5)

TV engines still in use are old: Samsung Tizen 5 runs Chromium 63, and LG webOS
3–4 runs Chromium 38–53. For them the package ships `dist/chronochrome.es5.js`,
a UMD build with the global `chronochrome`. It uses ES5 syntax and needs no API
newer than Chromium 38.

```html
<script src="https://unpkg.com/chronochrome@2/dist/chronochrome.es5.js"></script>
<script>
  var light = chronochrome.lightAt(18.5);
  var glare = chronochrome.deviceLight({
    at: new Date(),
    latitude: 57.63,
    longitude: 39.88,
    viewerHeading: 272,
  });
</script>
```

It holds the parts that don't touch `Intl`: `lightAt`, `DAY_STOPS`,
`seasonFactor`, `seasonShape`, `solarAnchoredHour` and the `PALETTE_*_HOUR`
constants, `solarPosition`, `deviceLight`, `toDeviceFrame`, `sunDirection`,
`moonPosition`, `moonAgeDays` and `moonPhase`. `sampleLightHue` and anything
that takes a `timeZone` stay out of it: old engines lack the `Intl` time-zone
names they rely on. Read the wall-clock hour from `Date` and pass it in.

A test runs this bundle against the TypeScript sources in a realm stripped of
the newer built-ins, and checks that the two agree to 1e-9.

## Time zones

```ts
sampleLightHue({
  at: new Date(),
  timeZone: "America/New_York",
  latitude: 40.71,
});
```

Moon age stays absolute (UTC). Latitude is explicit — pair zone + city lat yourself.

## Demo

Live: **https://chronohue.isamarin.xyz/**

The sun/moon chart is [`@chronochrome/widget`](https://github.com/chronochrome/chronochrome/tree/main/packages/widget) — same drawing as Lumina.

Location / timezone / lat·lon, 24h dial, sun·moon chart, UI kit on CSS vars.
Source: [`apps/demo`](https://github.com/chronochrome/chronochrome/tree/main/apps/demo).

## Development

This package lives in the [chronochrome monorepo](https://github.com/chronochrome/chronochrome) —
scripts, the demo and the release process are described in its root README and
[PUBLISH.md](https://github.com/chronochrome/chronochrome/blob/main/PUBLISH.md).
Regenerate the test vectors with `pnpm --filter chronochrome artifacts`.

## License

MIT · isamarin × BLMK
