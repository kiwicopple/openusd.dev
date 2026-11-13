// Read-only example for Node.js 18+. Reads visible token balances only.
const endpoint = process.env.RPC_URL || 'https://api.mainnet.solana.com';
const mint = 'ousd2mJsPEckLHcSCDxyKD7NDGARZcfLbDZkKiatYHB';
const tokenProgram = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
const mainnetGenesis = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
const owner = process.argv[2];
if (!owner || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(owner)) {
  throw new Error('Usage: node read-ousd-solana.mjs YOUR_SOLANA_WALLET_ADDRESS');
}
let id = 0;
async function rpc(method, params = []) {
  const requestId = ++id;
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: requestId, method, params }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
  const body = await response.json();
  if (body.jsonrpc !== '2.0' || body.id !== requestId) throw new Error('Invalid RPC response envelope');
  if (body.error) throw new Error(`RPC error ${body.error.code}: ${body.error.message}`);
  if (!Object.hasOwn(body, 'result')) throw new Error('Missing RPC result');
  return body.result;
}
if (await rpc('getGenesisHash') !== mainnetGenesis) throw new Error('Wrong Solana cluster');
const metadata = await rpc('getAccountInfo', [mint, { encoding: 'jsonParsed', commitment: 'finalized' }]);
const account = metadata.value;
const parsed = account?.data?.parsed;
if (account?.owner !== tokenProgram || parsed?.type !== 'mint' || !parsed.info.isInitialized) {
  throw new Error('Unexpected mint program or state; review the deployment');
}
const decimals = parsed.info.decimals;
if (decimals !== 6) throw new Error('Unexpected OUSD mint decimals');
const result = await rpc('getTokenAccountsByOwner', [owner, { mint }, {
  encoding: 'jsonParsed', commitment: 'finalized', minContextSlot: metadata.context.slot,
}]);
let raw = 0n;
for (const { account } of result.value) {
  const parsed = account.data?.parsed;
  const info = parsed?.info;
  if (account.owner !== tokenProgram || parsed?.type !== 'account' || info.mint !== mint ||
      info.owner !== owner || info.tokenAmount.decimals !== decimals) {
    throw new Error('Unexpected token account identity');
  }
  if (!/^[0-9]+$/.test(info.tokenAmount.amount)) throw new Error('Invalid raw token amount');
  raw += BigInt(info.tokenAmount.amount);
}
const digits = raw.toString().padStart(decimals + 1, '0');
console.log(JSON.stringify({ cluster: 'mainnet', slot: result.context.slot, mint, tokenProgram,
  owner, decimals, tokenAccounts: result.value.length, rawVisibleBalance: raw.toString(),
  visibleBalance: `${digits.slice(0, -decimals)}.${digits.slice(-decimals)}` }, null, 2));
