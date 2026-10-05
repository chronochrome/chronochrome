---
"@chronochrome/tailwind": patch
---

Fix `*-accent-glow`, `*-accent-ring` and `shadow-accent`: they produced `rgb(r,g,b / a)`, which is invalid CSS, so browsers dropped them. Now `rgba(r,g,b, a)` in both the v3 plugin and the v4 `theme.css`.
