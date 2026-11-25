# Website source and deployment

The website lives in `site/`; the npm library lives in `packages/openusd/`.

The import retains the deployed website source from Sites commit `60218ef50ff02b8e06db44347940fbcff48ae39b` (version 50). Existing GitHub history and the npm publication changes in PR #2 are preserved. Older website history remains in the existing Sites source repository rather than being copied wholesale into this public repository. The historical internal HANDOFF.md is intentionally omitted from this public import; it is not required to build or run the website.

## Development and checks

Run from `site/` with Node 22.12 or later:

```sh
npm ci
npm run validate
npm run check
npm run build
npm test
npm run check:links
npm run check:seo
```

The package has its own commands in `packages/openusd/README.md`. Adding website source does not change the package tarball or require a new npm release.

## Existing Sites hosting

Keep the current Sites project, public audience, custom domain, canonical origin, and analytics consent behavior. `site/.openai/hosting.json` records the existing Site identity and static output directory. The project ID is an identifier, not a credential.

Paul’s requested workflow is one repository for both projects. Every website publication must have its corresponding source committed and pushed here first. If that push fails, do not publish a divergent Site version.

There is no automatic GitHub-to-Sites deployment configured. To release an approved website change:

1. Fetch the latest GitHub revision. Check for newer edits in both GitHub and the existing Sites source before copying anything. Make and verify website changes in `site/`, then commit and push the exact source to GitHub, following the requested review/merge process. Use that pushed revision for the deployment.
2. Open the existing Site through the Sites source workflow. Copy the **contents of `site/`** into that checkout, preserving the Site identity and its source history. Do not copy the whole monorepo or replace Git metadata.
3. Run the website checks and production build. Package and push the exact source through the Sites workflow, then save and deploy that version using the native Sites publishing operations.
4. Verify the terminal deployment result and record the GitHub revision and Site version in the release report.

Do not assume that merging a PR publishes the site. Do not put short-lived Sites write credentials into GitHub Actions, repository files, or shell arguments. An unattended deployment pipeline needs a separately supported authentication and publishing integration; none is configured by this import.

## Public-source boundaries

Commit source and placeholder-only `.env.example`, never `.env`, `.npmrc`, credentials, build artifacts, runtime data, or local reports. GA4 measurement and Google site-verification identifiers already rendered in public HTML are not secrets. Public token contract addresses are not private keys. Keep provider credentials and any future server secrets out of browser-delivered code.

The existing manual source-review workflow is retained under `site/.github/` as source history, not activated as a root GitHub workflow. It does not run automatically. Website review, npm publication, and Sites deployment are separate actions.
