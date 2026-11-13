import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient, OpenUsdClient } from '../dist/index.js';

test('factory and complete directory', async () => {
  const client = createClient(); assert.ok(client instanceof OpenUsdClient);
  const {data,error} = await client.providers.list(); assert.equal(error,null);
  assert.deepEqual(data.map(p=>p.id),['visa','stripe','bridge','coinbase','mastercard','privy','bvnk']);
  for (const p of data) for (const c of p.capabilities) { assert.equal(c.providerId,p.id); assert.ok(c.sources.length); }
});
test('case insensitive name/id search and no matches', async()=>{
  assert.equal((await createClient().providers.list({search:'  BVNK '})).data[0].id,'bvnk');
  assert.deepEqual((await createClient().providers.list({search:'missing'})).data,[]);
});
test('get retains material availability and unknown networks', async()=>{
  const {data,error}=await createClient().providers.get('visa'); assert.equal(error,null);
  const c=data.capabilities.find(c=>c.id==='visa-ousd-portal'); assert.equal(c.availability,'private_beta');
  assert.equal(c.networks,null); assert.equal(c.verification,'not_tested');
});
test('not found and invalid JavaScript arguments return errors',async()=>{
  assert.equal((await createClient().providers.get('missing')).error.code,'NOT_FOUND');
  for (const value of [null,3,[],{search:2},{network:'ethereum'}]) assert.equal((await createClient().providers.list(value)).error.code,'INVALID_ARGUMENT');
  for (const value of [null,2,' ']) assert.equal((await createClient().providers.get(value)).error.code,'INVALID_ARGUMENT');
});
test('caller mutation cannot corrupt another result or client',async()=>{
  const client=createClient();const a=(await client.providers.get('visa')).data;
  a.name='bad'; a.capabilities[0].sources.length=0;
  assert.equal((await client.providers.get('visa')).data.name,'Visa');
  assert.ok((await createClient().providers.get('visa')).data.capabilities[0].sources.length);
  const m=client.metadata;m.sources.length=0;assert.ok(client.metadata.sources.length);
});
