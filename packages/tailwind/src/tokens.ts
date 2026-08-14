/**
 * Single source for Tailwind v3 plugin theme.extend.
 * Values are CSS vars — CircaHue start() writes the live colors.
 */
export const tailwindAccentColors = {
  accent: {
    DEFAULT: "var(--accent-primary)",
    hover: "var(--accent-primary-hover)",
    dim: "var(--accent-primary-dim)",
    glow: "rgb(var(--light-hue-glow-rgb) / var(--light-hue-glow-alpha))",
    ring: "rgb(var(--light-hue-ring-rgb) / var(--light-hue-ring-alpha))",
  },
} as const;

export const tailwindAccentShadow =
  "0 0 var(--light-hue-glow-blur) rgb(var(--light-hue-glow-rgb) / var(--light-hue-glow-alpha))";
