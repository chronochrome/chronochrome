/**
 * Single source for Tailwind v3 plugin theme.extend.
 * Values are CSS vars — ChronoChrome start() writes the live colors.
 */
export const tailwindAccentColors = {
  accent: {
    DEFAULT: "var(--accent-primary)",
    hover: "var(--accent-primary-hover)",
    dim: "var(--accent-primary-dim)",
    glow: "rgba(var(--light-hue-glow-rgb), var(--light-hue-glow-alpha))",
    ring: "rgba(var(--light-hue-ring-rgb), var(--light-hue-ring-alpha))",
  },
} as const;

export const tailwindAccentShadow =
  "0 0 var(--light-hue-glow-blur) rgba(var(--light-hue-glow-rgb), var(--light-hue-glow-alpha))";
