# Editorial quality standard

Version 3 · October 11, 2026

Applies to openusd.dev, an independent reference for the Open USD payments stablecoin. This is a working policy, not published site content. It turns the October 10 content/SEO audit into review criteria; it does not authorize implementing the audit or enabling indexing.

## Principles

1. **Answer first.** State the fact, decision, or next action before background. A developer should not need to read the methodology to use the page.
2. **Earn every paragraph.** Keep information that changes a decision, explains a necessary concept, provides evidence, or enables an action. Delete repeated introductions and descriptions of what the page will explain.
3. **Be concise without becoming less accurate.** Keep eligibility, network, environment, and testing limits where they matter. Consolidate general disclaimers; do not remove a specific unresolved conflict.
4. **Organize around tasks.** Payments, payouts, wallets, balances, and contracts are useful entry points. Interface types, network entities, and provider access are separate facts.
5. **Make facts reusable.** Prefer structured records, stable IDs, sources, and accurate dates. Generate HTML and JSON from the same records. Unknown is not unsupported.
6. **Keep one home for each answer.** Add a page only when it serves a distinct intent with enough evidence. Merge overlapping content and preserve meaningful inbound links.
7. **Let the framework work.** Keep standard Starlight structure. A custom component needs a reader need that the existing components do not meet.
8. **Measure what is real.** Review scores are judgments, not rankings. Do not invent search volume, traffic, performance scores, review dates, or evidence of testing.
9. **Explain unfamiliar terms where readers meet them.** At a term's first meaningful use on a page, link to its exact explanation in `/guides/concepts/#...` when a beginner needs that concept to understand the answer. Prefer the term itself as link text. A definition link supplements claim-level evidence; it does not replace the primary source for an OUSD capability.

## Contextual concept links

- Keep foundational explanations on the single Concepts page. Link directly to a stable, descriptive concept anchor, not the page top or a generic glossary search.
- Select terms that affect understanding or action, such as stablecoin, minting, custody, token address, or settlement. Do not turn every technical noun into a link.
- Usually link a concept once per page, at its first useful mention in the answer, prose, or table. Repeat only when a distant, independently useful section genuinely needs it. Avoid adjacent clusters of definition links and never link every occurrence.
- Explain the general concept in plain language with why it matters or a short example. Keep actual OUSD support, account eligibility, fees, and network behavior in their sourced references; a generic definition proves none of them.
- Treat published concept anchors as a link contract. Keep IDs stable when headings change, preserve aliases for renamed concepts, and test inbound fragments, navigation, and search after changes.

## Task titles

Use activity-based titles with the **-ing form** to name the activity a task guide covers: “Sending payouts” rather than the imperative instruction “Send payouts.” Keep the page heading, navigation, chooser links, and search/SEO title labels consistent. This convention applies to task guides, including “Integrating OUSD”; concept and comparison titles keep their existing descriptive or question-based forms.

## Handbook and provider architecture

- **Task guides are provider-independent.** Start with why someone would do the activity and a concrete developer use case. Explain the necessary concepts, requirements and general workflow before discussing providers. Keep provider dashboard paths, API parameters, onboarding recipes and product-specific restrictions on the provider profile.
- **Provider profiles start with the company.** Explain who it is, what it does and the background that helps a developer understand its role. Follow with separate activity sections using the same activity-based **-ing titles** as their canonical task guides.
- **Go deeper on the provider page.** Each activity explains the actual provider-specific setup or implementation steps, links to primary documentation and states the limits that affect implementation. When sources establish only an integration listing, say which details must be confirmed; do not invent an API recipe to fill the gap.
- **Make navigation reciprocal and precise.** End each task guide with the available provider paths, linking to the exact activity anchor, not the provider page top. Every provider activity links back to its canonical handbook task. Derive relationships from the capability registry, keep all registered paths represented and test both directions. Preserve existing routes and useful incoming fragment links.
- **Use natural prose for support distinctions.** Say what is documented and what remains uncertain in the relevant activity. Do not replace that explanation with an all-task capability matrix, abstract evidence taxonomy or legend a reader has to learn first.
- **Put provenance at the bottom.** Review dates, last-updated dates, documentation provenance and testing notes belong in the bottom References/last-updated area, not a banner beneath the title. Retain claim-level citations and structured source provenance in the dataset.
- **Keep useful limits next to the task.** Asset and network constraints, eligibility, access stage, fees and transaction limits belong beside the affected operation. Moving metadata to References does not authorize moving these substantive limits out of the reader's path.
- **Keep the existing machine contract.** A narrative reorganization does not change dataset versions, stable IDs, provider/task relations, token addresses, or source review dates without separately justified changes.

## Writing examples

| Avoid | Prefer |
| --- | --- |
| “Compare documented capabilities and follow the evidence before you build.” | “Compare providers and integration docs.” |
| “Open USD is an asset initiative.” | “Open USD is a stablecoin.” |
| “This section explains the different access paths…” | Start with the paths and links to their task or provider activity. |
| “Source-backed, independently untested.” on every record | One clear directory note, plus specific testing limits where relevant. |
| “Generally available” as a badge for both a token and an API | “Native token deployed” or the sourced service release stage, as applicable. |

Use short paragraphs and descriptive headings. Use a comparison table only when comparing facts helps the reader decide; task/provider navigation should use activity sections and concise reciprocal links. Word counts and sentence length are prompts to inspect, not pass/fail rules. Privacy disclosures and necessary technical explanations should not be cut merely to improve a brevity metric.

## Page contract

Before drafting a new page or substantially rewriting one, record four lines in the review:

- **Reader/task:** Who needs this, and what are they trying to do?
- **Answer/action:** What will the page let them understand or accomplish?
- **Unique value:** Why does this belong here instead of on an existing page or solely in the official docs?
- **Evidence/maintenance:** Which sources or records support it, and what will become stale?

A landing page routes readers quickly. A reference supplies lookup facts. A guide explains or demonstrates a task. A policy discloses actual practices. Judge each by its purpose; do not force code samples or marketing actions into every page.

## Scorecard

Score each materially changed page from 0–4 in five dimensions. Record the reason and a concrete excerpt, source, route, or test for each score. Evaluate shared template changes on each affected page type; check global invariants across all affected routes.

**Score = Σ(weight × rating / 4), out of 100.** Keep at most one decimal place. Do not average multiple pages to hide a failing page.

| Dimension | Weight | What a 4 requires |
| --- | ---: | --- |
| Developer usefulness | 30 | Answers its stated task immediately; provides actionable facts, links, examples, or comparisons appropriate to the page. No detour through generic advice. |
| Accuracy and evidence | 25 | Material claims have relevant primary sources; uncertainty is precise; eligibility and testing claims are supported; dates describe actual review/change events. |
| Clarity and economy | 20 | Concrete language, scannable structure, no redundant introduction or caveat, and no paragraph that can be removed without losing useful meaning. |
| Human and machine findability | 15 | Descriptive title/headings, meaningful internal links, stable canonical identity, readable HTML, and consistent structured data where applicable. Mark unknown technical checks as unverified. |
| Focus and maintainability | 10 | One distinct purpose; shared facts have one source; fits standard Starlight; no avoidable duplication or unmaintained promises. |

Use this common scale:

- **0 — Missing or harmful:** no useful answer, misleading claim, or broken essential behavior.
- **1 — Major revision:** the issue prevents a reader or consumer completing the page's task.
- **2 — Partial:** useful material exists, but a substantial gap, ambiguity, or repetition remains.
- **3 — Good:** fulfills the purpose; only a specific, non-blocking improvement remains. Name it.
- **4 — Strong:** meets the dimension's definition with concrete evidence. “Looks good” is not evidence.

**Ready:** at least 85/100, every dimension at least 3, accuracy 4, and no hard failures. The threshold is an initial editorial convention, not a scientifically calibrated measure. Calibrate against accepted/rejected edits after several reviews; do not lower it to pass a particular change.

For example, ratings `4, 4, 3, 3, 3` score **88.8/100**. Ratings `4, 2, 4, 4, 4` score 87.5 but **fail** because accuracy is below the required level.

Missing evidence is **unverified**, not a 4 or a silent N/A. Report a provisional score/range or omit the total until it is checked. A copy-only review may pass editorial dimensions while remaining explicitly unverified for production readiness.

## Hard failures

A high score cannot offset any of these:

- An invented or unsupported material claim, API call, token address, eligibility statement, or test result.
- Deleting a decision-relevant limitation, converting unknown into unsupported, or treating general network support as verified OUSD product support.
- Falsely refreshing review dates or presenting a newest-record date as a complete registry review.
- A changed primary action, source link, stable record link, or machine contract that no longer works without a documented migration.
- Contradictory HTML and exported facts, or an undocumented breaking change to IDs/schema.
- For a release intended to be searchable: crawl blocks/noindex on intended pages, incorrect canonical destinations, or sitemap entries that do not resolve directly to the intended indexable content.
- Copying private information into public content, or claiming reuse rights that the owner has not established.

Indexing restrictions on deliberate previews or prelaunch builds are not failures. Do not change indexing merely to obtain a passing score.

## Review workflow

1. Identify scope and read the affected pages and shared records. Audit-only requests produce findings, not edits.
2. Record baseline scores only if the baseline was actually reviewed. For new pages, mark baseline “new.” Never reconstruct a numerical baseline from memory.
3. Draft or review within the user's request. Verify changed claims from specific primary sources. Flag unresolved evidence instead of filling the gap with confident wording. Check first meaningful unfamiliar terms for useful contextual concept links, and remove repetitive or distracting links.
4. Score the result. Give each deduction a concrete reason; give every 4 supporting evidence. Repair issues within scope.
5. Keep existing debt separate. A narrow edit can improve a page that is not yet release-ready; label that result “improved, below target” or “provisional,” with the remaining issue. Do not claim the whole site passes or launch an unrequested rewrite.
6. For implementation, run relevant repository checks. A score is not a substitute for validation or browser verification. For audit-only work, do not rebuild or deploy unnecessarily.
7. Report readiness and limitations. Review failure is a reason to fix or disclose, not an automatic new permission prompt. Respect the user's existing authorization.

## Mechanical checks versus editorial judgment

Existing validation, framework checks, build, tests, and link checks cover part of the mechanical layer. They do **not** currently enforce this scorecard, verify all source claims, or establish public crawlability.

`npm run check:seo` now checks built canonical/indexing agreement, sitemap consistency, metadata, Dataset markup, and prerendered stable IDs. Directory tests cover filter semantics and stable record identities. These checks do not prove Google crawl access or verify source claims; inspect the deployed responses and review sources separately.

Do not create a keyword-density score, banned-word counter, minimum word count, or “AI writing detector.” Those measures can reward worse content. Repeated caveats and long paragraphs may be review hints; a reviewer must judge whether they are necessary.

## Review output

Use a compact report in the task or requested working document; no new public page is needed.

```text
Scope / page contract:
Baseline: reviewed score, new, or not measured
Ratings: usefulness / accuracy / clarity / findability / maintainability
Evidence: one concrete reason per rating
Total: score, or provisional/unverified
Hard failures: none found, or specific findings
Checks performed:
Existing debt / unchecked areas:
Result: ready, improved below target, needs revision, or provisional
```

When reviewing a substantial rewrite, do a separate reader pass without looking at the numerical target: can someone answer the page's question and find the next step? Use observed reader difficulty to correct the score, not the other way around.

## Significant modification dates and source review

- Set `modifiedAt` when main content, important links or structured data actually change. Keep `reviewedAt` as the date of a factual review; a title edit or a shared source recheck must not silently refresh every record that references it. A modification date can legitimately be later than the review date.
- Sitemap dates use `src/lib/content-dates.ts`: authored frontmatter, each provider/network's relevant records, and the actual dependencies displayed by a hub. Missing trustworthy dates are omitted. Never use build time, filesystem mtime, or a global latest review as a substitute.
- The original dataset compilation uses CC0-1.0 within the maintainer's rights. Keep `src/data/license.json`, the generated license notice, data-page explanation and Dataset JSON-LD aligned. Do not extend this dedication to cited third-party documentation, code, logos or trademarks.
- Worked provider examples are documentation illustrations until backed by live evidence. Read-only RPC observations must identify the exact network, token, date and block/slot; they do not establish transfer behavior or provider settlement.
