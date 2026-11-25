# OpenUSD repository workflow

- This repository is the source of truth for both `site/` (the website) and `packages/openusd/` (the npm library). Preserve concurrent changes by fetching the latest branch before editing and again before opening or updating a PR. Never force-push over another contributor's work.
- Read `site/AGENTS.md` before website changes. Keep the two projects' dependency lockfiles and release processes separate.
- Whenever publishing website changes through Sites, first commit and push the exact corresponding `site/` source to this GitHub repository. Publish that same reviewed source, not an uncommitted or divergent copy. Record the GitHub commit and resulting Sites version in the release report. If the GitHub push fails, stop before publishing and report the blocker.
- A GitHub merge alone does not deploy Sites or publish npm. See `docs/site-deployment.md` for the existing explicit Sites sync/build/save/deploy workflow. Do not invent automatic deployment support or store Sites credentials in the repository.
- Audit the exact staged files before any public push. Never commit secrets, personal data, unrelated internal documents, `.env`, `.npmrc`, private keys, runtime data, local reports, or credentials. Retain placeholder-only `.env.example`. Do not copy Git history wholesale from another source without reviewing it for public disclosure.
