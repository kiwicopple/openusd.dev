# Validation, November 13, 2026

- TypeScript 5.9.2 strict build passed.
- Five Node test groups passed: complete provider set and capability/source association; search; retained availability and unknown network semantics; invalid input/not-found handling; deep-copy isolation.
- `npm pack` produced an nine-file, 37 kB installable ESM tarball.
- Installed that tarball into a separate temporary consumer and listed all seven providers successfully.
- Strict TypeScript consumer compilation passed using the packaged declarations.
- `cmp` confirmed the bundled snapshot exactly matches the existing November 9 site export.
- Tested on Node 24.22.1. Node 22 and browser bundlers have not been independently exercised.

No site source was changed, so its full site build and editorial audits were not rerun. No npm publication occurred. GitHub source publication was separately authorized. The development build reused the existing local TypeScript installation; source archive excludes that node_modules symlink. Run npm install to set up an independent checkout.
