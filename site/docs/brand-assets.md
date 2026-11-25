# Brackets brand assets

Installed from the owner-supplied `openusd-brand-kit(1).zip`, Brackets version 1.0, on October 12, 2026. This is the independent openusd.dev identity, not an issuer endorsement.

## Source mapping

- `public/brand/logo-light.svg` and `logo-dark.svg` in the supplied kit are retained byte-for-byte as `src/assets/logo-light.svg` and `logo-dark.svg`. Astro fingerprints them. Header and footer share these outlined lockups and switch with the existing Starlight theme.
- The supplied adaptive SVG favicon, multi-size ICO fallback, Apple touch icon, Safari pinned-tab mark, browser manifest, and its four ordinary/maskable app icons retain their filenames and bytes in `public/`.
- The supplied `public/social/og-light.png` and `.svg` become `public/social.png` and `.svg`, preserving the site's existing share-image URL. The PNG is 1200 × 630 and 55,913 bytes; the SVG is the editable source. Open Graph and Twitter metadata describe that image, while existing page-specific titles, descriptions, URLs, and indexing rules remain authoritative.

Only the assets used by these existing branding locations are installed. Alternative lockups, export sizes, avatars, cover art, and decorative motifs remain in the original kit. There are no new dependencies, external font requests, background illustrations, or service workers.

## Usage and provenance

The supplied README identifies the wordmark as Inter Display-derived outlined artwork. No font software is included or loaded; website copy keeps the self-hosted Geist setup and its existing license. The kit does not state an additional reuse license, so this integration makes no new licensing claim. Keep the owner's original kit as the complete source deliverable.

Use the light-background and dark-background variants without stretching or recreating their lettering. Header width is 210 pixels (180 on narrow screens); footer width is 160 pixels. The existing layout and footer padding provide clear space. The header's retained screen-reader title names its link; the footer link has its own accessible name, so their nested images have empty alternatives.

## Verification

`scripts/brand.test.ts` verifies the outlined assets, theme variants, accessible names, icon dimensions, manifest paths and social-image dimensions. `check:seo` verifies rendered metadata and local image paths without network calls. Targeted browser QA checks the actual header/footer in both themes and on desktop/narrow viewports. Routine builds retain only the existing inexpensive offline navigation and export checks.
