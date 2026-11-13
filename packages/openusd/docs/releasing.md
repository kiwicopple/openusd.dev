# Release checklist (not authorized yet)

- Paul chooses/reserves the npm name and authorizes publication. `openusd` remains provisional; `ousd` alias is deferred.
- Agree on a software license, repository, maintainers, and a supported runtime matrix. Dataset CC0 does not license third-party material.
- Review the current primary-source data and material availability limitations. Do not relabel a build date as a review date.
- Decide whether to add CommonJS and browser distribution support; test any newly supported targets.
- Run `npm test`, inspect `npm pack --dry-run`, then install the actual tarball in a clean consumer and run the README example and TypeScript check.
- Only after authorization remove `private: true` and the `prepublishOnly` guard, choose the release version and changelog, and configure publisher credentials through the approved flow.

No npm publication, website deployment, account creation, payment, or secret storage is part of this prototype. Source is maintained in kiwicopple/openusd.dev.
