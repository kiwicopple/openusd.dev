// Synthetic application fixture. No network calls, provider SDK or real money.
// The Map stands in for a durable unique ledger key; it does not test a database.
export function reconcile(intent, authoritative, postings) {
  const fields = ['operationId', 'asset', 'network', 'recipient', 'amountMinor'];
  if (fields.some(key => authoritative[key] !== intent[key])) return 'review';
  const key = `${intent.provider}:${intent.environment}:${intent.operationId}`;
  if (postings.has(key)) return 'posted';
  if (authoritative.status === 'succeeded') {
    postings.set(key, { amountMinor: intent.amountMinor, recipient: intent.recipient });
    return 'posted';
  }
  if (['failed', 'rejected'].includes(authoritative.status)) return 'review';
  return 'pending';
}

export function runFixture() {
  const intent = { provider: 'example', environment: 'synthetic', operationId: 'op-1042',
    asset: 'OUSD', network: 'example-mainnet', recipient: 'recipient-7', amountMinor: '10000000' };
  const authoritative = { ...intent, status: 'succeeded' };
  const postings = new Map();
  // Simulate recovery after response loss and a crash before ledger posting.
  // Both a replayed completion event and a late pending event trigger a fresh read.
  const results = ['completion', 'completion-replay', 'older-pending'].map(() =>
    reconcile(intent, authoritative, postings));
  const mismatch = reconcile(intent, { ...authoritative, amountMinor: '9999999' }, new Map());
  const ambiguousFailure = reconcile(intent, { ...authoritative, status: 'failed' }, new Map());
  return { results, postingCount: postings.size, mismatch, ambiguousFailure };
}
