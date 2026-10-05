import { formatHourClock, type LightHueSnapshot } from "chronohue";
import { drawSky } from "./draw.js";

export interface SkyMountOptions {
  snapshot?: LightHueSnapshot;
  /** Phase / sun / moon / accent + hour slider. Default false (chart only). */
  controls?: boolean;
  note?: string | false;
  onHour?: (hour: number) => void;
  onNow?: () => void;
  live?: boolean;
}

export interface SkyHandle {
  update(snap: LightHueSnapshot, extras?: { live?: boolean }): void;
  destroy(): void;
  readonly el: HTMLElement;
}

export function mountSky(host: HTMLElement, opts: SkyMountOptions = {}): SkyHandle {
  host.innerHTML = "";
  const root = document.createElement("div");
  root.className = "ch-sky";
  host.appendChild(root);

  const chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chart.setAttribute("class", "ch-sky-chart");
  chart.setAttribute("role", "img");
  chart.setAttribute("aria-label", "Sun and moon paths for the current hour");
  root.appendChild(chart);

  let readout: HTMLElement | null = null;
  let hourLabel: HTMLElement | null = null;
  let slider: HTMLInputElement | null = null;
  let nowBtn: HTMLButtonElement | null = null;

  if (opts.controls) {
    readout = document.createElement("div");
    readout.className = "ch-sky-readout";
    readout.innerHTML = `
      <div class="ch-sky-cell"><div class="ch-sky-label">Phase</div><div class="ch-sky-value" data-k="phase">—</div></div>
      <div class="ch-sky-cell"><div class="ch-sky-label">Sun alt</div><div class="ch-sky-value" data-k="sun">—</div></div>
      <div class="ch-sky-cell"><div class="ch-sky-label">Moon</div><div class="ch-sky-value" data-k="moon">—</div></div>
      <div class="ch-sky-cell"><div class="ch-sky-label">Accent</div><div class="ch-sky-value" data-k="accent">—</div></div>
    `;
    root.appendChild(readout);

    const dial = document.createElement("div");
    dial.className = "ch-sky-dial";
    hourLabel = document.createElement("span");
    hourLabel.className = "ch-sky-label";
    slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "24";
    slider.step = "0.25";
    slider.setAttribute("aria-label", "Hour of day");
    nowBtn = document.createElement("button");
    nowBtn.type = "button";
    nowBtn.className = "ch-sky-now";
    nowBtn.textContent = "Now";
    dial.append(hourLabel, slider, nowBtn);
    root.appendChild(dial);

    slider.addEventListener("input", () => {
      opts.onHour?.(Number(slider!.value));
    });
    nowBtn.addEventListener("click", () => opts.onNow?.());
  }

  if (opts.note !== false) {
    const note = document.createElement("p");
    note.className = "ch-sky-note";
    note.textContent =
      opts.note ??
      "Every accent is computed from this sky — clock, season and latitude — by chronohue.";
    root.appendChild(note);
  }

  const onChartClick = (e: MouseEvent) => {
    const rect = chart.getBoundingClientRect();
    if (rect.width <= 0) return;
    const hour = Math.min(24, Math.max(0, ((e.clientX - rect.left) / rect.width) * 24));
    opts.onHour?.(hour);
  };
  chart.addEventListener("click", onChartClick);

  function paint(snap: LightHueSnapshot, extras?: { live?: boolean }) {
    drawSky(chart, snap);
    if (readout) {
      const sun = snap.sun.altitudeDeg;
      readout.querySelector('[data-k="phase"]')!.textContent = snap.phaseLabel;
      readout.querySelector('[data-k="sun"]')!.textContent =
        `${sun >= 0 ? "+" : ""}${sun.toFixed(1)}°`;
      readout.querySelector('[data-k="moon"]')!.textContent = `${snap.moon.ageDays.toFixed(1)} d`;
      readout.querySelector('[data-k="accent"]')!.textContent = snap.accent.hex.toUpperCase();
    }
    if (hourLabel) hourLabel.textContent = formatHourClock(snap.hour);
    if (slider && extras?.live !== false) {
      // Don't fight the user while they drag; caller sets live.
      if (document.activeElement !== slider) slider.value = String(snap.hour);
    }
    if (nowBtn) nowBtn.disabled = extras?.live === true;
  }

  if (opts.snapshot) paint(opts.snapshot, { live: opts.live });

  return {
    el: root,
    update(snap, extras) {
      paint(snap, extras);
    },
    destroy() {
      chart.removeEventListener("click", onChartClick);
      host.innerHTML = "";
    },
  };
}
