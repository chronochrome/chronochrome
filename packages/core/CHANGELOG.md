# chronochrome

## 2.1.0

### Minor Changes

- 0167de6: Add `viewerHeading` option for fixed screens: the compass bearing you look along when facing the screen. The snapshot gains `device`, the sun and moon as unit vectors in the screen's frame. Exports `deviceLight`, `sunDirection`, `moonPosition` (real lunar position, ~0.3°) and `toDeviceFrame`.

## 2.0.1

### Patch Changes

- 2032adc: Docs: `LightHueOptions` in the README lists `longitude` and `hourMode`; solar mode explains the Greenwich default and polar day; the Murmansk example uses a date with a real sunrise. Widget README re-samples the same place when the hour slider moves.

## 2.0.0

### Major Changes

- Initial release. Package renamed from @igrs@circa-hue to chronochrome
