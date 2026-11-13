# Releasing

1. Update `version` in `package.json` (semver) and commit.
2. `npm test` (builds and runs tests; also runs automatically via `prepublishOnly`).
3. Inspect contents with `npm pack --dry-run`.
4. `npm login`, then `npm publish` (`publishConfig.access` is `public`). Use `--tag <name>` for prereleases.
5. Tag the release: `git tag v<version> && git push --tags`.

Before each release, review the data snapshot's primary-source limitations; do not relabel a build date as a review date.
