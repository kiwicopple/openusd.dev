# Performance and delivery

Applies to openusd.dev. Keep this static Astro/Starlight site simple. Measure a specific regression before adding a new runtime, dependency, preloading policy, or infrastructure.

## Cheap checks on every build

- Internal links to directory pages end in `/`, before any query string or fragment. File links such as `.json`, `.md`, `.txt` and `.xml` keep their file paths. Fix the shared source/component rather than patching `dist`.
- `npm run build` and `npm run build:preview` automatically run `scripts/check-navigation.mjs` on the generated HTML. It catches root-relative, relative and same-origin absolute links that would redirect to an existing directory page, including explicit `index.html` links. This is an offline file scan with no new dependencies.
- `npm run check:navigation` reruns just that check without rebuilding. `npm test` includes fixture tests covering queries, fragments, file links and external links. The existing `check:links` and `check:agents` remain responsible for missing destinations, fragment validity and exported documentation.
- Do not make Lighthouse, remote requests, full browser suites or source monitoring part of routine builds. Run targeted browser/network checks when the affected behavior warrants them. Measure the guard's printed runtime if its cost grows.

## Cache policy and the current hosting limit

The October 12, 2026 live response check found `Cache-Control: public, max-age=0, must-revalidate` on fingerprinted `/_astro/` CSS and JavaScript. Existing `public/_headers` security/referrer directives were absent from live responses. A configuration file is not evidence that a host honors it.

The available Sites static manifest and native hosting tools expose no documented response-header/cache override. Keep the current static deployment and audience. Do not invent manifest fields, assume `_headers` works, migrate to a Worker, or change DNS/infrastructure solely to add immutable caching without separately authorized scope.

When the host supports it, the intended policy is `public, max-age=31536000, immutable` only for build-fingerprinted assets whose URL changes with their content. Verify every file in a proposed wildcard's scope; this site also uses shorter fingerprint names. Never infer immutability from `.js` or `.css` alone. Keep HTML, `analytics.js`, unversioned Pagefind/search assets, datasets, sitemaps and agent exports freshness-preserving. Do not put immutable caching on `/*`, `/pagefind/*`, or all scripts/styles.

After an actual delivery-policy change, verify live response headers for a freshly discovered fingerprinted CSS and JS URL, plus HTML and an unversioned asset. Confirm a repeat visit can reuse the fingerprinted asset and a newly deployed filename still loads. Report source configuration, effective live headers and browser cache behavior separately. If unsupported, report the limit rather than claiming a cache improvement.

## Targeted release checks

1. Run the existing validation, framework/type check, production build, tests, link and SEO checks. For build/configuration changes, verify the deliberate preview output too, then restore the production build before packaging.
2. For navigation changes, inspect a rendered affected link, click it in the cloud browser, and verify its destination and fragment. Check a direct live HTTP request without following redirects. The old slashless URL may still redirect for compatibility; site links should use the direct route.
3. For broader performance work, distinguish cold initial load, repeat visits, and page-to-page navigation. Record device/throttling and sample count. Preserve the standard Starlight hover/focus prefetch, search, mobile navigation, content, citations, agent exports, and analytics consent boundaries.
4. Only consider broader prefetch, search loading changes, ClientRouter or client hydration after a measured need and explicit scope. Do not chase a score at the expense of freshness, accessibility, privacy or maintenance.

This guide and the build check are repository-local safeguards. They are not an installed global skill and do not authorize publication, tracking, infrastructure or access changes.
