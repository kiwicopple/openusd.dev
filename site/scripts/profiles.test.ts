import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {providers,capabilities,networks,dataset,handbookTasks,source} from '../src/lib/registry';
import {DatasetSchema,SupportSchema} from '../src/lib/schema';
test('all provider profiles and task evidence derive from the exported registry',()=>{
 assert.equal(providers.length,7);
 assert.equal(handbookTasks.length,8);
 for(const p of providers){assert.equal(p.detail,true,p.id);assert.ok(p.profile,p.id);assert.ok(capabilities.some(c=>c.providerId===p.id));for(const statement of [p.profile!.introduction,...p.profile!.sections.flatMap(s=>s.paragraphs)])for(const id of statement.sourceIds)assert.ok(source(id));}
 for(const c of capabilities)assert.equal(SupportSchema.safeParse(c.ousdSupport).success,true,c.id);
 assert.deepEqual(DatasetSchema.parse(JSON.parse(JSON.stringify(dataset))),dataset);
 assert.equal(dataset.schemaVersion,'0.1.0-alpha');
 assert.ok(!fs.existsSync('src/pages/data/ecosystem-v2.json.ts'));
});
test('four exact network identities stay unchanged',()=>{
 assert.deepEqual(Object.fromEntries(networks.map(n=>[n.id,n.address])),{base:'0xB2000000000000000000002fEb517dFeC7415344',ethereum:'0x9f6F3991D525015a6F8CaF062C83b62fD3AC4436',solana:'ousd2mJsPEckLHcSCDxyKD7NDGARZcfLbDZkKiatYHB',tempo:'0x20c0000000000000000000006a37DA5C996874BE'});
});
test('directory retains anchors but moves disclosure details into profiles',()=>{
 const directory=fs.readFileSync('src/components/EcosystemDirectory.astro','utf8');
 assert.ok(directory.includes('id={c.id}'));
 assert.ok(directory.includes('activity.legacyIds.map'));
 assert.ok(directory.includes('href={activity.href}'));
 assert.ok(fs.readFileSync('src/lib/directory.ts','utf8').includes('/providers/${provider.id}/#${task.slug}'));
 assert.ok(!directory.includes('<details>'));
 const profile=fs.readFileSync('src/pages/providers/[id].astro','utf8');
 assert.ok(profile.includes('profile.sections.map'));
 assert.ok(profile.includes('General workflow:'));
 assert.ok(!profile.includes('What can you build?'));
 assert.ok(!profile.includes('profile-table'));
 assert.ok(profile.indexOf('Reviewed {p.reviewedAt}')>profile.indexOf('<h2 id="references"'));
});
test('Changelog uses one retained route and feed identity',()=>{
 const config=fs.readFileSync('astro.config.mjs','utf8');
 assert.ok(config.includes("{ label: 'Changelog', link: '/changelog/' }"));
 assert.ok(!config.includes("label: 'Updates'"));
 assert.ok(fs.readFileSync('src/content/docs/changelog.mdx','utf8').includes('title: "Changelog"'));
 const feed=fs.readFileSync('src/pages/rss.xml.ts','utf8');assert.ok(feed.includes('/changelog/'));assert.ok(feed.includes('openusd.dev Changelog'));
});

test('four distinct network profiles share exact identifiers and sourced content',()=>{
 const seen=new Set<string>();
 for(const n of networks){assert.ok(n.profile,n.id);assert.ok(n.profile!.sections.length>=4);assert.ok(!seen.has(n.profile!.title));seen.add(n.profile!.title);for(const statement of [n.profile!.introduction,...n.profile!.sections.flatMap(s=>s.paragraphs)])for(const id of statement.sourceIds)assert.ok(source(id));}
});

test('profiles use native Starlight contents and site-wide pagination stays disabled',()=>{
 const base=fs.readFileSync('src/layouts/Base.astro','utf8');
 assert.ok(base.includes('headings={headings}'));
 assert.ok(!base.includes('tableOfContents: false'));
 for(const type of ['providers','networks']){
  const template=fs.readFileSync(`src/pages/${type}/[id].astro`,'utf8');
  assert.ok(template.includes('headings={headings}'));
  assert.ok(!template.includes('profile-jump'));
 }
 assert.ok(fs.readFileSync('astro.config.mjs','utf8').includes('pagination: false'));
 const files=fs.readdirSync('src/content/docs',{recursive:true}).filter(f=>/\.mdx?$/.test(String(f)));
 for(const file of files){
  const frontmatter=fs.readFileSync(`src/content/docs/${file}`,'utf8').split('---')[1]||'';
  for(const match of frontmatter.matchAll(/^(?:prev|next):\s*(.*)$/gm))assert.equal(match[1].trim(),'false',`${file}: page override enables pagination`);
 }
});

test('profile sidebar groups are alphabetical and preserve the network overview first',()=>{
 const config=fs.readFileSync('astro.config.mjs','utf8');
 const groupLabels=(name:string)=>[...config.split(`label: '${name}', collapsed: true, items: [`)[1].split('] }')[0].matchAll(/label: '([^']+)'/g)].map(m=>m[1]);
 assert.deepEqual(groupLabels('Providers'),['Bridge','BVNK','Coinbase','Mastercard','Privy','Stripe','Visa']);
 assert.deepEqual(groupLabels('Networks'),['Networks and contracts','Base','Ethereum','Solana','Tempo']);
});
