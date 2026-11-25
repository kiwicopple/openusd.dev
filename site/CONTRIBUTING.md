# Contributing

Read AGENTS.md for editorial standards. The site uses standard Astro Starlight content in `src/content/docs/`.

For a new guide, add a Markdown or MDX file under `src/content/docs/guides/` with a title, description and sidebar order. Use `draft: true` until ready. Preserve existing URLs when moving content. For evidence-backed guides, include actual review/modification dates, source IDs and claim descriptions, plus the GuideNotes component as shown by existing guides.

For ecosystem changes, update the structured JSON registry rather than page templates. Every capability needs evidence, access requirements and limitations. Distinguish announcements, native deployment, provider API access and independently tested behavior.

Use Starlight’s built-in components before adding custom layout code. Keep directory-specific CSS scoped to the registry. Run the checks listed in README.md and verify affected interactions before publication.
