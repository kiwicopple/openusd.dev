import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {handbookTasks,providers,capabilities,source} from '../src/lib/registry';
import {providerTasks,taskProviderMarkdown,capabilityActivityAnchor,legacyProfileAnchors} from '../src/lib/provider-guides';

test('every registry task relation has a canonical provider activity and reciprocal link',()=>{
 for(const p of providers){
  const tasks=providerTasks(p.id);
  for(const t of tasks){
   const activity=p.profile!.sections.find(s=>s.id===t.slug);
   assert.ok(activity,`${p.id}: ${t.slug}`);
   assert.equal(activity.heading,t.title);
   assert.ok(activity.paragraphs.length>=2);
  }
  for(const s of p.profile!.sections){
   if(!['accessing-apis','testing-integrations','access-and-networks'].includes(s.id))assert.ok(tasks.some(t=>t.slug===s.id),`${p.id}: unregistered ${s.id}`);
  }
 }
 for(const t of handbookTasks){
  const text=fs.readFileSync(`src/content/docs/guides/${t.slug}.md`,'utf8');
  assert.ok(text.includes(taskProviderMarkdown(t.id)),`${t.slug}: provider list drift`);
  assert.match(text.split('---')[2],/example/i,`${t.slug}: developer use case`);
  assert.match(text,/## Define the requirements/);
  assert.match(text,/## Build the /);
  const beforeProviders=text.split('---')[2].split('## Available providers')[0];
  assert.ok(!/\b(?:Stripe|Bridge|Visa|Mastercard|Coinbase|Privy|BVNK)\b/.test(beforeProviders),`${t.slug}: provider recipe in general workflow`);
  assert.ok(text.trim().endsWith('<!-- task-providers:end -->'),`${t.slug}: providers last`);
 }
});

test('legacy product and section anchors map to an existing activity without schema changes',()=>{
 for(const p of providers){
  const ids=p.profile!.sections.map(s=>s.id);
  for(const c of capabilities.filter(c=>c.providerId===p.id))assert.ok(ids.includes(capabilityActivityAnchor(c)),c.id);
  for(const id of Object.keys(legacyProfileAnchors[p.id]||{}))assert.ok(ids.includes(id),`${p.id}: ${id}`);
 }
});

test('all new activity claims carry valid primary source mappings',()=>{
 for(const p of providers)for(const section of p.profile!.sections)for(const statement of section.paragraphs){
  assert.ok(statement.sourceIds.length);
  for(const id of statement.sourceIds)assert.ok(source(id).url.startsWith('https://'));
 }
});

test('Privy payout steps remain one uninterrupted ordered workflow',()=>{
 const section=providers.find(p=>p.id==='privy')!.profile!.sections.find(s=>s.id==='send-payouts')!;
 const first=section.paragraphs.findIndex(p=>p.text.startsWith('1. '));
 assert.ok(first>=0);
 assert.deepEqual(section.paragraphs.slice(first,first+5).map(p=>p.text.match(/^([1-5])\. /)?.[1]),['1','2','3','4','5']);
 assert.ok(section.paragraphs.slice(0,first).some(p=>p.sourceIds.includes('privy-custodial-sca')));
});
