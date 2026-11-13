# API reference

## `createClient(): OpenUsdClient`

Creates an isolated directory client. No API URL, key, configuration, or connection is needed. The factory, resource namespace, named exports, TypeScript declarations, and asynchronous `{ data, error }` results follow familiar Supabase JavaScript conventions without pretending this is a remote database. It intentionally does not imitate SQL query builders for a seven-entry directory.

## `client.providers.list(options?: { search?: string })`

Returns `Promise<Result<ProviderDetails[]>>`. Search matches a substring of the provider name or ID after trimming and lowercasing. Filters on network or availability are deliberately not provided: those facts belong to individual capabilities, not providers as a whole. Unknown options return `INVALID_ARGUMENT` rather than silently widening results.

## `client.providers.get(id: string)`

Returns `Promise<Result<ProviderDetails>>`. IDs are exact and case-sensitive. Missing entries return `NOT_FOUND`; invalid IDs return `INVALID_ARGUMENT`. Absence is not evidence that a provider lacks a service.

## Results and types

```ts
 type Result<T> =
   | { data: T; error: null }
   | { data: null; error: { code: 'INVALID_ARGUMENT' | 'NOT_FOUND'; message: string } }
```

Exported types: `Provider`, `Capability`, `ProviderDetails`, `DirectoryError`, `Result<T>`, `ListOptions`.

`ProviderDetails` retains the site's provider record, including profile citation IDs, and adds matching `capabilities`. Capability citations include primary source URLs. Resolve profile citation IDs against `client.metadata.sources`. Types are generated from the bundled snapshot; the directory schema is alpha and may change.

## `client.metadata`

Returns schema version, modification date, description, documentation URL, review-date coverage, dataset license, and source registry. Result objects and metadata are deep copies: changing them never changes the shared snapshot or a later result.

## Runtime

ES modules only, Node.js 22.12+. Modern bundlers that support JSON import attributes can consume the source, but browser bundler compatibility is not yet certified. CommonJS and browser distribution builds are out of this first increment. There are no runtime npm dependencies.
