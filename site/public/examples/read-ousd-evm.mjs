// Read-only example for Node.js 18+. No wallet, key, signature, or transaction.
const networks = {
  base: { chainId: 8453n, rpc: 'https://mainnet.base.org', token: '0xB2000000000000000000002fEb517dFeC7415344' },
  ethereum: { chainId: 1n, rpc: '', token: '0x9f6F3991D525015a6F8CaF062C83b62fD3AC4436' },
  tempo: { chainId: 4217n, rpc: 'https://rpc.tempo.xyz', token: '0x20c0000000000000000000006a37DA5C996874BE' },
};
const [network, owner] = process.argv.slice(2);
const config = networks[network];
if (!config || !/^0x[0-9a-fA-F]{40}$/.test(owner ?? '')) {
  throw new Error('Usage: node read-ousd-evm.mjs base|ethereum|tempo 0xYOUR_ADDRESS');
}
const endpoint = process.env.RPC_URL || config.rpc;
if (!endpoint) throw new Error('Set RPC_URL to your Ethereum Mainnet RPC endpoint');
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
function decodeUint(word) {
  if (typeof word !== 'string' || !/^0x[0-9a-fA-F]{64}$/.test(word)) {
    throw new Error('Expected one ABI-encoded uint; check the network, contract and interface');
  }
  return BigInt(word);
}
function formatUnits(raw, decimals) {
  if (decimals === 0) return raw.toString();
  const digits = raw.toString().padStart(decimals + 1, '0');
  return `${digits.slice(0, -decimals)}.${digits.slice(-decimals)}`;
}
const chainId = BigInt(await rpc('eth_chainId'));
if (chainId !== config.chainId) throw new Error('Wrong network; stop before reading the token');
// Pin reads to the same block number. A reorg may replace that block. Latest state is not a payment-finality guarantee.
const block = await rpc('eth_blockNumber');
if (typeof block !== 'string' || !/^0x[0-9a-fA-F]+$/.test(block)) throw new Error('Invalid block response');
const [code, decimalsWord, balanceWord] = await Promise.all([
  rpc('eth_getCode', [config.token, block]),
  rpc('eth_call', [{ to: config.token, data: '0x313ce567' }, block]), // decimals()
  rpc('eth_call', [{ to: config.token, data: '0x70a08231' + owner.slice(2).padStart(64, '0') }, block]), // balanceOf(address)
]);
if (typeof code !== 'string' || !/^0x(?:[0-9a-fA-F]{2})*$/.test(code)) throw new Error('Invalid code response');
// Tempo TIP-20 tokens are native precompiles; do not apply an ERC-20 bytecode assumption there.
if (network !== 'tempo' && code === '0x') throw new Error('No contract bytecode at this block');
const decimalsValue = decodeUint(decimalsWord);
if (decimalsValue > 255n) throw new Error('Invalid uint8 decimals response');
const decimals = Number(decimalsValue);
if (network === 'tempo' && decimals !== 6) throw new Error('Unexpected TIP-20 decimals');
const raw = decodeUint(balanceWord);
console.log(JSON.stringify({ network, chainId: chainId.toString(), block, token: config.token,
  owner, codeBytes: (code.length - 2) / 2, decimals, rawBalance: raw.toString(), balance: formatUnits(raw, decimals) }, null, 2));
