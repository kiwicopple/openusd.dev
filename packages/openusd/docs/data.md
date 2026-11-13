# Data provenance and refresh

Source: existing openusd.dev production export, `dist/data/ecosystem.json`, modified November 9, 2026. Public counterpart: https://openusd.dev/data/ecosystem.json. The exported original compilation declares CC0-1.0 with exclusions for third-party material, logos and trademarks; its full license notice is preserved in metadata. This does not assign a software license to this new library.

The initial bundled file is a byte-for-byte copy of the existing site export. This task did not independently reverify provider claims, update review dates, or modify the site's registry. The provider IDs are visa, stripe, bridge, coinbase, mastercard, privy, and bvnk. Provider and capability facts remain separate. Read the original site's editorial standard before changing claims.

Refresh from a validated site build rather than hand-editing package data:

```sh
node scripts/sync-directory.mjs /path/to/openusd-site/dist/data/ecosystem.json
npm test
```

The script performs structural guards, not primary-source verification. First review source changes in the site, run the site's validation workflow, then copy its export. Inspect the snapshot diff, update the README date, review schema/type changes, and update tests deliberately if directory membership changes. Do not add automated network updates at runtime: reproducible installs should keep their reviewed snapshot.
