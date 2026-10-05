# @chronochrome/widget

Sun and moon on their day arcs. Same look as the Lumina / isamarin sky: one SVG, `viewBox` 300×150, discs in that space — never stretched with `preserveAspectRatio="none"`.

Math stays in [`chronochrome`](https://www.npmjs.com/package/chronochrome). This package only draws.

## Install

```bash
npm install @chronochrome/widget chronochrome
```

```ts
import { sampleLightHue } from "chronochrome";
import { ARC_HEIGHT, mountSky } from "@chronochrome/widget";
import "@chronochrome/widget/sky.css";

const place = { latitude: 57.63, timeZone: "Europe/Moscow" };
const chart = { includeArcs: true, arcHeight: ARC_HEIGHT }; // 150 — keep this

const snap = sampleLightHue({ ...place, ...chart });

const sky = mountSky(document.querySelector("#sky")!, {
  snapshot: snap,
  controls: true,
  onHour: (hour) => {
    // Re-sample for the same place — only the hour changes.
    sky.update(sampleLightHue({ ...place, ...chart, hourOverride: hour }));
  },
});
```

Chart-only (host already has a dial):

```ts
import { drawSky } from "@chronochrome/widget";

drawSky(document.querySelector("svg")!, snap);
```

## Why the lab chart drifted

The demo painted discs in a 300×286 viewBox, then stretched the SVG to a wide fixed-height box (`preserveAspectRatio="none"`). Paths and circles stayed _numerically_ aligned and still looked wrong — ellipses, horizon squash. This widget keeps aspect (`height: auto`, `meet`) like Lumina.

## Repo

https://github.com/chronochrome/chronochrome/tree/main/packages/widget
