import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {dataset} from '../src/lib/registry';
import {DATASET_VERSION,DatasetSchema,datasetJsonSchema,type Dataset} from '../src/lib/schema';

const page=fs.readFileSync('src/content/docs/data.mdx','utf8');
const example=page.match(/```js\n([\s\S]*?)\n```/)![1];
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;

test('the current alpha version agrees across types, validation, JSON Schema, and documentation',()=>{
 const typed:Dataset=dataset;
 assert.equal(typed.schemaVersion,'0.1.0-alpha');
 assert.equal(typed.schemaVersion,DATASET_VERSION);
 const versionSchema=datasetJsonSchema().properties!.schemaVersion;
 assert.ok(typeof versionSchema==='object');
 assert.equal(versionSchema.const,DATASET_VERSION);
 assert.ok(page.includes(`schemaVersion: "${DATASET_VERSION}"`));
 for(const schemaVersion of ['2.1.0','0.1.0','0.0.0'])assert.equal(DatasetSchema.safeParse({...dataset,schemaVersion}).success,false);
 assert.deepEqual(fs.readdirSync('src/pages/data').sort(),['LICENSE.txt.ts','ecosystem.json.ts','ecosystem.schema.json.ts']);
});

test('the published fetch example queries the actual dataset and joins provider names',async()=>{
 let rows:Array<{provider:string;product:string;access:string;assetScope:string;docs:string}>=[];
 await new AsyncFunction('fetch','console',example)(async(url:string)=>{
  assert.equal(url,'https://openusd.dev/data/ecosystem.json');
  return {ok:true,json:async()=>structuredClone(dataset)};
 },{table:(value:typeof rows)=>{rows=value;}});
 const expected=dataset.capabilities.filter(p=>p.tasks.includes('send-payouts')&&p.ousdSupport==='documented');
 assert.ok(expected.length>0,'Example returns useful records');
 assert.equal(rows.length,expected.length);
 for(const [i,product] of expected.entries()){
  assert.deepEqual(rows[i],{
   provider:dataset.providers.find(p=>p.id===product.providerId)!.name,
   product:product.name,access:product.access,assetScope:product.assetScope,docs:product.officialDocumentationUrl,
  });
 }
 assert.ok(rows.every(row=>row.provider&&row.product&&row.docs),'Every result has a provider, product, and docs URL');
});

test('the published fetch example reports HTTP failures before reading records',async()=>{
 await assert.rejects(new AsyncFunction('fetch','console',example)(async()=>({ok:false,status:503}),{table:()=>assert.fail('No rows on failure')}),/Dataset request failed: 503/);
});

test('the data page keeps field documentation without generated counts or review-date banners',()=>{
 const download=fs.readFileSync('src/components/DatasetDownload.astro','utf8');
 assert.ok(page.includes('## Data structure'));
 assert.ok(page.includes('### Product fields'));
 for(const field of ['assetScope','access','availability','environment','verification','networks','sources','reviewedAt'])assert.ok(page.includes('`'+field+'`'),field);
 assert.ok(!page.includes('## Contract'));
 assert.ok(!page.includes('Version 2.1 additions'));
 assert.ok(!download.includes('reviewCoverage'));
 assert.ok(!download.includes('.length'));
 assert.ok(!download.includes('modifiedAt'));
});

test('CC0 metadata is scoped consistently without changing stable dataset identity',()=>{
 assert.equal(dataset.license?.identifier,'CC0-1.0');
 assert.equal(dataset.license?.url,'https://creativecommons.org/publicdomain/zero/1.0/');
 assert.equal(dataset.license?.noticeUrl,'https://openusd.dev/data/LICENSE.txt');
 assert.match(dataset.license!.scope,/third-party documentation, third-party code, provider logos and trademarks/);
 assert.match(page,/without permission or attribution/);
 assert.match(page,/does not cover cited third-party documentation/);
 const schema=datasetJsonSchema().properties!.license as any;
 assert.equal(schema.properties.identifier.const,dataset.license!.identifier);
 assert.equal(schema.properties.url.const,dataset.license!.url);
});
