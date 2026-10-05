# @chronochrome/tailwind

## 1.0.1

### Patch Changes

- 2032adc: Fix `*-accent-glow`, `*-accent-ring` and `shadow-accent`: they produced `rgb(r,g,b / a)`, which is invalid CSS, so browsers dropped them. Now `rgba(r,g,b, a)` in both the v3 plugin and the v4 `theme.css`.
- Updated dependencies [2032adc]
  - chronochrome@2.0.1

## 1.0.0

### Major Changes

- Initial release. Package renamed from @igrs@circa-hue to chronochrome

### Patch Changes

- Updated dependencies
  - chronochrome@2.0.0
