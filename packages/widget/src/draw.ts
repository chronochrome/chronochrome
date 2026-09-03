import type { LightHueSnapshot } from "chronohue";

/** Chart height Lumina and isamarin use. Matches a 2:1 viewBox (300×150). */
export const ARC_HEIGHT = 150;

let uid = 0;

function svg(name: string, attrs: Record<string, string | number> = {}): SVGElement {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

export interface DrawSkyOptions {
  /** Click / drag maps x → hour. */
  onHour?: (hour: number) => void;
}

/**
 * Paint sun/moon arcs and discs into `chart`.
 *
 * Geometry stays in the snapshot viewBox. The SVG must keep its aspect
 * (`preserveAspectRatio=meet`, `height: auto`) so discs stay circular and
 * on the path. `preserveAspectRatio=none` is what broke the lab chart.
 */
export function drawSky(
  chart: SVGSVGElement,
  snap: LightHueSnapshot,
  _opts: DrawSkyOptions = {},
): void {
  const a = snap.arcs;
  if (!a) {
    throw new Error(
      "snapshot.arcs missing — sampleLightHue({ includeArcs: true, arcHeight: 150 })",
    );
  }

  const accent = snap.accent.hex;
  if (!chart.dataset.chUid) chart.dataset.chUid = String(++uid);
  const clipId = `ch-moon-clip-${chart.dataset.chUid}`;

  chart.setAttribute("viewBox", a.viewBox);
  chart.setAttribute("preserveAspectRatio", "xMidYMid meet");
  chart.replaceChildren();

  chart.appendChild(
    svg("rect", {
      class: "ch-sky-ground",
      x: 0,
      y: a.horizonY,
      width: a.width,
      height: Math.max(0, a.height - a.horizonY),
    }),
  );
  chart.appendChild(
    svg("line", {
      class: "ch-sky-horizon",
      x1: 0,
      y1: a.horizonY,
      x2: a.width,
      y2: a.horizonY,
    }),
  );
  chart.appendChild(svg("path", { class: "ch-sky-path ch-sky-sun-path", d: a.sunPath }));
  chart.appendChild(svg("path", { class: "ch-sky-path ch-sky-moon-path", d: a.moonPath }));

  const defs = svg("defs");
  const clip = svg("clipPath", { id: clipId });
  clip.appendChild(
    svg("rect", {
      x: a.moon.x - a.moon.diameter / 2,
      y: a.moon.y - a.moon.diameter / 2,
      width: Math.max(0, a.moon.fillWidth),
      height: a.moon.diameter,
    }),
  );
  defs.appendChild(clip);
  chart.appendChild(defs);

  const moonAbove = a.moon.y < a.horizonY;
  const moonOp = moonAbove ? 1 : 0.35;
  chart.appendChild(
    svg("circle", {
      class: "ch-sky-moon-outline",
      cx: a.moon.x,
      cy: a.moon.y,
      r: a.moon.diameter / 2,
      opacity: moonOp,
    }),
  );
  chart.appendChild(
    svg("circle", {
      class: "ch-sky-moon-lit",
      cx: a.moon.x,
      cy: a.moon.y,
      r: a.moon.diameter / 2,
      opacity: moonOp,
      "clip-path": `url(#${clipId})`,
      fill: accent,
    }),
  );

  const sunAbove = a.sun.y < a.horizonY;
  const sunR = a.sun.diameter / 2;
  chart.appendChild(
    svg("circle", {
      class: "ch-sky-sun-halo",
      cx: a.sun.x,
      cy: a.sun.y,
      r: sunR + 4,
      fill: accent,
      opacity: sunAbove ? 0.18 : 0.06,
    }),
  );
  chart.appendChild(
    svg("circle", {
      class: "ch-sky-sun",
      cx: a.sun.x,
      cy: a.sun.y,
      r: sunR,
      fill: accent,
      opacity: sunAbove ? 1 : 0.35,
    }),
  );

  chart.appendChild(
    svg("line", {
      class: "ch-sky-now-line",
      x1: a.sun.x,
      x2: a.sun.x,
      y1: 0,
      y2: a.height,
    }),
  );
}
