import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {networks,providers,source} from '../src/lib/registry';
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const evm=fs.readFileSync('public/examples/read-ousd-evm.mjs','utf8');
const solana=fs.readFileSync('public/examples/read-ousd-solana.mjs','utf8');
const evidence=JSON.parse(fs.readFileSync('public/data/observations/ousd-solana-2026-10-12.json','utf8'));
const uint=(value:bigint)=>'0x'+value.toString(16).padStart(64,'0');
const owner='0x0000000000000000000000000000000000000001';
async function run(code:string,args:string[],results:(method:string,params:any[])=>any){
 let output:any;const calls:string[]=[];
 await new AsyncFunction('process','fetch','console',code)({argv:['node','example',...args],env:{RPC_URL:'https://example.invalid'}},async(_url:string,init:any)=>{
  const request=JSON.parse(init.body);calls.push(request.method);
  return {ok:true,json:async()=>({jsonrpc:'2.0',id:request.id,result:results(request.method,request.params)})};
 },{log:(text:string)=>{output=JSON.parse(text);}});
 return {output,calls};
}
const evmResult=(method:string,params:any[])=>({eth_chainId:'0x2105',eth_blockNumber:'0x100',eth_getCode:'0x1234'}[method]??(params[0]?.data==='0x313ce567'?uint(6n):uint(12345678n)));

test('published EVM example checks identity and formats exact balances with read-only calls',async()=>{
 const {output,calls}=await run(evm,['base',owner],evmResult);
 assert.equal(output.balance,'12.345678');assert.equal(output.rawBalance,'12345678');
 assert.equal(output.token,networks.find(n=>n.id==='base')!.address);
 assert.deepEqual(calls,['eth_chainId','eth_blockNumber','eth_getCode','eth_call','eth_call']);
 for(const n of networks.filter(n=>n.id!=='solana'))assert.ok(evm.includes(n.address),n.id+' example contract matches registry');
});
test('EVM example rejects wrong networks, missing bytecode and malformed uints',async()=>{
 for(const [override,message] of [
  [{eth_chainId:'0x1'},/Wrong network/],[{eth_getCode:'0x'},/No contract bytecode/],
  [{eth_call:'0x123'},/ABI-encoded uint/],[{eth_blockNumber:'latest'},/Invalid block/],
 ] as const)await assert.rejects(run(evm,['base',owner],(m,p)=>(override as Record<string,string>)[m]??evmResult(m,p)),message);
});
test('Tempo read follows its TIP-20 interface without assuming ordinary bytecode',async()=>{
 const {output}=await run(evm,['tempo',owner],(m,p)=>m==='eth_chainId'?'0x1079':m==='eth_getCode'?'0x':evmResult(m,p));
 assert.equal(output.decimals,6);assert.equal(output.codeBytes,0);
});
const mintResult=evidence.observations.find((o:any)=>o.request.method==='getAccountInfo').response.result;
const genesis=evidence.observations.find((o:any)=>o.request.method==='getGenesisHash').response.result;
const solanaOwner='11111111111111111111111111111111';
const tokenProgram=mintResult.value.owner;
const account=(amount:string)=>({account:{owner:tokenProgram,data:{parsed:{type:'account',info:{mint:networks.find(n=>n.id==='solana')!.address,owner:solanaOwner,tokenAmount:{decimals:6,amount}}}}}});
const solanaResult=(m:string)=>m==='getGenesisHash'?genesis:m==='getAccountInfo'?structuredClone(mintResult):{context:{slot:456215919},value:[account('999999'),account('1')]};
test('Solana example verifies cluster, mint/program and sums all visible token accounts exactly',async()=>{
 const {output,calls}=await run(solana,[solanaOwner],solanaResult);
 assert.equal(output.visibleBalance,'1.000000');assert.equal(output.tokenAccounts,2);
 assert.deepEqual(calls,['getGenesisHash','getAccountInfo','getTokenAccountsByOwner']);
 assert.ok(solana.includes(networks.find(n=>n.id==='solana')!.address));
});
test('Solana example rejects wrong clusters and token-account identities',async()=>{
 await assert.rejects(run(solana,[solanaOwner],m=>m==='getGenesisHash'?'not-mainnet':solanaResult(m)),/Wrong Solana cluster/);
 await assert.rejects(run(solana,[solanaOwner],m=>m==='getTokenAccountsByOwner'?{value:[{...account('1'),account:{...account('1').account,owner:'wrong'}}]}:solanaResult(m)),/Unexpected token account/);
});
test('Privy worked request has documented fields, separate reference/idempotency IDs and no fabricated response',()=>{
 const example=providers.find(p=>p.id==='privy')!.profile!.sections.find(s=>s.id==='send-payouts')!.examples![0];
 const body=JSON.parse(example.code.split('\n\n')[1]);
 assert.deepEqual(body.source,{asset:'ousd',chain:'tempo'});assert.equal(body.amount,'10.0');
 assert.match(example.code,/privy-idempotency-key:/);assert.ok(body.reference_id.length<=64);
 assert.doesNotMatch(example.code,/transaction_hash|sk_live|BEGIN PRIVATE/);
 for(const id of example.sourceIds)assert.ok(source(id));
});
test('synthetic reconciliation fixture posts once and stops mismatches and ambiguous failures',async()=>{
 const {runFixture,reconcile}=await import('../public/examples/reconciliation-fixture.mjs');
 assert.deepEqual(runFixture(),{results:['posted','posted','posted'],postingCount:1,mismatch:'review',ambiguousFailure:'review'});
 const intent={provider:'example',environment:'synthetic',operationId:'1',asset:'OUSD',network:'test',recipient:'A',amountMinor:'1'};
 for(const key of ['operationId','asset','network','recipient','amountMinor'])assert.equal(reconcile(intent,{...intent,status:'succeeded',[key]:'wrong'},new Map()),'review');
});
