import snapshot from './ecosystem.json' with { type: 'json' };

export type Provider = (typeof snapshot.providers)[number];
export type Capability = (typeof snapshot.capabilities)[number];
export type ProviderDetails = Provider & { capabilities: Capability[] };
export type DirectoryError = { code: 'INVALID_ARGUMENT' | 'NOT_FOUND'; message: string };
export type Result<T> = { data: T; error: null } | { data: null; error: DirectoryError };
export type ListOptions = { search?: string };

function failure(code: DirectoryError['code'], message: string): Result<never> {
  return { data: null, error: { code, message } };
}
function details(provider: Provider): ProviderDetails {
  return structuredClone({ ...provider, capabilities: snapshot.capabilities.filter(c => c.providerId === provider.id) });
}

/** An offline directory, not a connection to a payment provider. */
export class OpenUsdClient {
  /** Snapshot provenance; dates describe the dataset, not a new verification. */
  get metadata() {
    return structuredClone({ schemaVersion: snapshot.schemaVersion, modifiedAt: snapshot.modifiedAt,
      description: snapshot.description, documentation: snapshot.documentation,
      reviewCoverage: snapshot.reviewCoverage, license: snapshot.license, sources: snapshot.sources });
  }

  readonly providers = {
    /** Lists every directory entry, including restricted and announced capabilities. */
    list: async (options: ListOptions = {}): Promise<Result<ProviderDetails[]>> => {
      if (!options || typeof options !== 'object' || Array.isArray(options) ||
          Object.keys(options).some(key => key !== 'search') ||
          (options.search !== undefined && typeof options.search !== 'string')) {
        return failure('INVALID_ARGUMENT', 'Expected { search?: string }.');
      }
      const search = (options.search ?? '').trim().toLowerCase();
      const providers = snapshot.providers.filter(p => !search || p.id.toLowerCase().includes(search) || p.name.toLowerCase().includes(search));
      return { data: providers.map(details), error: null };
    },
    /** Gets a stable directory ID; absence is not evidence of unsupported service. */
    get: async (id: string): Promise<Result<ProviderDetails>> => {
      if (typeof id !== 'string' || !id.trim()) return failure('INVALID_ARGUMENT', 'Expected a non-empty provider ID.');
      const provider = snapshot.providers.find(p => p.id === id);
      return provider ? { data: details(provider), error: null } : failure('NOT_FOUND', `No directory entry for ${id}.`);
    },
  };
}

/** Supabase-style factory and resource namespace; requires no URL or secret. */
export function createClient(): OpenUsdClient { return new OpenUsdClient(); }
