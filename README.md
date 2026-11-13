# Open USD developer tools

Developer resources for [openusd.dev](https://openusd.dev), the independent Open USD payments reference.

The JavaScript provider-directory library is in `packages/openusd`. The existing website source is in `site/`.

The read-only `openusd` library is published on npm. It lists providers; it is not a payments SDK and does not perform transactions.

## Website source

`site/` contains the complete Astro/Starlight source for [openusd.dev](https://openusd.dev): content, provider registry, assets, examples, tests, and build configuration. The JavaScript package remains in `packages/openusd/`; the two projects keep independent dependency lockfiles and release processes.

```sh
cd site
npm ci
npm run dev
```

See [the website README](site/README.md) and [deployment guide](docs/site-deployment.md). GitHub is the source of truth for future edits. Merging a PR does **not** deploy the website or publish a new npm version.
