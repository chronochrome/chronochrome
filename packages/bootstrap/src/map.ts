import type { LightHueSnapshot } from "chronochrome";

/** Bootstrap 5 theme keys written by this adapter. */
export const BOOTSTRAP_VAR_KEYS = [
  "--bs-primary",
  "--bs-primary-rgb",
  "--bs-primary-text-emphasis",
  "--bs-primary-bg-subtle",
  "--bs-primary-border-subtle",
  "--bs-link-color",
  "--bs-link-color-rgb",
  "--bs-link-hover-color",
  "--bs-link-hover-color-rgb",
  "--bs-focus-ring-color",
] as const;

export type BootstrapCssVar = (typeof BOOTSTRAP_VAR_KEYS)[number];

/** Parse `#rgb` / `#rrggbb` into Bootstrap's `r,g,b` form. */
export function hexToRgbCss(hex: string): string {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => `${c}${c}`)
          .join("")
      : raw;
  if (full.length !== 6 || /[^0-9a-fA-F]/u.test(full)) return "0,0,0";
  const n = Number.parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/**
 * Map a ChronoChrome snapshot onto Bootstrap 5 root theme vars.
 * Success / danger / warning stay untouched — brand accent ≠ status.
 */
export function bootstrapVars(snap: LightHueSnapshot): Record<BootstrapCssVar, string> {
  const rgb = snap.accent.rgbCss;
  const hoverRgb = hexToRgbCss(snap.accentHover);
  return {
    "--bs-primary": snap.accent.hex,
    "--bs-primary-rgb": rgb,
    "--bs-primary-text-emphasis": `color-mix(in srgb, ${snap.accent.hex} 80%, #000)`,
    "--bs-primary-bg-subtle": `color-mix(in srgb, ${snap.accent.hex} 16%, #fff)`,
    "--bs-primary-border-subtle": `color-mix(in srgb, ${snap.accent.hex} 40%, #fff)`,
    "--bs-link-color": snap.accent.hex,
    "--bs-link-color-rgb": rgb,
    "--bs-link-hover-color": snap.accentHover,
    "--bs-link-hover-color-rgb": hoverRgb,
    "--bs-focus-ring-color": `rgba(${snap.glow.rgb}, ${snap.glow.alpha})`,
  };
}
