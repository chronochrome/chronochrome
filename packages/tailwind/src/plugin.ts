import { tailwindAccentColors, tailwindAccentShadow } from "./tokens.js";

/**
 * Tailwind v3 plugin object (also works as `@plugin` in v4).
 * Prefer `theme.css` on Tailwind v4.
 * Shape matches `tailwindcss/plugin` without importing Tailwind at build time.
 */
export const circahuePlugin = {
  handler: () => {
    /* theme-only — runtime colors come from start() */
  },
  config: {
    theme: {
      extend: {
        colors: tailwindAccentColors,
        boxShadow: {
          accent: tailwindAccentShadow,
        },
      },
    },
  },
};

export default circahuePlugin;
