# Geist Sans

The October 12, 2026 visual update uses one self-hosted Latin WOFF2, with a 400–700
weight axis. Body, headings, labels and strong text use those weights. Code keeps
the existing system monospace stack. No font service is contacted at runtime.

- Upstream: [Vercel Geist](https://github.com/vercel/geist-font)
- Official distribution: [Google Fonts Geist Latin v5 WOFF2](https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFU.woff2)
- Font's internal version: 1.800
- Original: 29,400 bytes, weights 100–900
- Shipped: 21,392 bytes, weights 400–700
- Original SHA-256: `19f9c92546aa300c312235e3125af1b81394d8db9a4bc4a425cd5b641d2d54e1`
- Shipped SHA-256: `5a6f3ffbcf66c7a6b70f7fa7847250846443e654116a8aa4d768391b5487d8b1`
- License: SIL Open Font License 1.1, retained in `public/fonts/OFL-Geist.txt`.
  The upstream license does not declare a Reserved Font Name.

The only font modification is limiting the variable weight axis with FontTools
4.57.0 and Brotli. Disabling timestamp recalculation makes the output reproducible:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
font = TTFont('Geist-Latin-Variable.woff2', recalcTimestamp=False)
font = instantiateVariableFont(font, {'wght': (400, 700)}, inplace=False)
font.flavor = 'woff2'
font.save('geist-latin-400-700.woff2')
```

Vite fingerprints the asset imported by `src/styles/theme.css`. `font-display:
swap` keeps text visible. Four local Arial fallback faces use weight-specific
size/vertical metrics calculated from this font's tables and Capsize's Latin
character-frequency method and [Arial metrics](https://github.com/seek-oss/capsize/blob/master/packages/metrics/src/entireMetricsCollection.json). Geist has 1,000 units/em, ascent
1,005, descent −295 and zero line gap. Fallbacks reduce metric differences; they
do not promise identical wrapping or zero layout shift on every device. When
Arial is unavailable, the standard Starlight system stack remains available.

Do not add font downloads, preload policy, new weights, or an external font
service without measuring the need and respecting `docs/performance.md`.
