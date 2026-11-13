# openusd JavaScript library

List the providers documented by [openusd.dev](https://openusd.dev). This first increment is an **offline, read-only directory**, not a payments SDK. No credentials, account onboarding, transactions, balance queries, or network requests.

```sh
npm install openusd
```

## Develop locally

Requires Node.js 22.12+ and npm. From this directory:

```sh
npm install
npm test
npm pack
```

Install the resulting tarball in another project to test it:

```sh
npm install /path/to/openusd-0.1.0.tgz
```

```js
import { createClient } from 'openusd'

const openusd = createClient()
const { data: providers, error } = await openusd.providers.list()
if (error) throw new Error(error.message)

for (const provider of providers) {
  console.log(provider.name, provider.description)
  for (const capability of provider.capabilities) {
    console.log(capability.name, capability.availability, capability.limitations)
  }
}
```

## Find a provider

```js
const { data, error } = await openusd.providers.list({ search: 'stripe' })
const result = await openusd.providers.get('visa')
if (result.error) console.error(result.error.code, result.error.message)
else console.log(result.data.capabilities)
```

`list` searches names and IDs, case-insensitively. An empty search lists all entries in registry order. No matches produces `data: []`, not an error. `get` uses an exact, case-sensitive stable ID. No pagination is needed for seven entries.

## Read support claims carefully

Directory presence does **not** mean publicly available integration or support for every network. Capability records retain availability, access requirements, limitations, evidence, review dates, and claim-level source URLs. `networks: null` means unknown, not “all networks” or “none.” No provider integration in this snapshot was independently tested. Do not infer token support from a provider's general network list.

```js
const metadata = openusd.metadata
console.log(metadata.modifiedAt, metadata.reviewCoverage)
console.log(metadata.documentation)
```

This build embeds the site's November 9, 2026 snapshot. It does not automatically refresh or imply a fresh review on install. Check the linked primary sources before implementation. This is the Open USD payments reference, not Pixar's graphics project or Origin Dollar.

See [API reference](docs/api.md), [data provenance](docs/data.md), and [release checklist](docs/releasing.md).
