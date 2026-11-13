import {gunzipSync} from 'node:zlib';
import {contentDates} from '../src/lib/content-dates';
import {DATASET_VERSION} from '../src/lib/schema';
import {providerTasks,legacyProfileAnchors} from '../src/lib/provider-guides';
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const preview=process.argv.includes('--preview');const root='dist';const map=fs.readFileSync(path.join(root,'sitemap-0.xml'),'utf8');
const dates=contentDates();
for(const [,url,body] of map.matchAll(/<url><loc>(.*?)<\/loc>([\s\S]*?)<\/url>/g)){
 const expected=dates[new URL(url).pathname];
 const actual=body.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]?.slice(0,10);
 assert.equal(actual,expected,url+' significant modification date');
}
assert.ok(!map.includes('<priority>')&&!map.includes('<changefreq>'));
const urls=[...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
for(const url of urls){
 const u=new URL(url);assert.equal(u.origin,'https://openusd.dev');assert.ok(u.pathname.endsWith('/'));assert.ok(!['/status/','/search/','/guides/'].includes(u.pathname));
 const html=fs.readFileSync(path.join(root,u.pathname,'index.html'),'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,url);
 const canon=[...html.matchAll(/<link[^>]*rel="canonical"[^>]*>/g)];assert.equal(canon.length,1,url);assert.ok(canon[0][0].includes(`href="${url}"`),url);
 assert.ok(html.includes(`name="robots" content="${preview?'noindex':'index'},follow"`),url);
 assert.ok(html.includes('https://openusd.dev/social.png'),url);
 for(const [key,value] of [['og:image','https://openusd.dev/social.png'],['og:image:type','image/png'],['og:image:width','1200'],['og:image:height','630']]){
  const tags=[...html.matchAll(new RegExp(`<meta[^>]*property="${key}"[^>]*>`,'g'))];
  assert.equal(tags.length,1,url+' '+key);assert.ok(tags[0][0].includes(`content="${value}"`),url+' '+key);
 }
 assert.equal((html.match(/name="twitter:image" content="https:\/\/openusd\.dev\/social\.png"/g)||[]).length,1,url+' Twitter image');
 for(const href of ['/favicon.svg','/favicon.ico','/apple-touch-icon.png','/safari-pinned-tab.svg','/site.webmanifest']){
  assert.equal((html.match(new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`,'g'))||[]).length,1,url+' '+href);
  assert.ok(fs.existsSync(path.join(root,href)),href+' exists');
 }
 const titleLink=html.match(/<a\b[^>]*class="site-title[^]*?<\/a>/)?.[0]??'';
 assert.match(titleLink,/class="sr-only(?: [^"]*)?"[^>]*>openusd\.dev<\/span>/,url+' accessible site title');
 assert.equal((titleLink.match(/<img\b/g)||[]).length,2,url+' theme logos');
 for(const [,src] of titleLink.matchAll(/src="([^"]+)"/g))assert.ok(fs.existsSync(path.join(root,src)),url+' logo exists');
 assert.ok(/name="description" content="[^"]+"/.test(html),url);
}
for(const file of ['search/index.html','status/index.html','guides/index.html','contribute/index.html','404.html'])assert.ok(fs.readFileSync(path.join(root,file),'utf8').includes('name="robots" content="noindex,follow"'),file);
const robots=fs.readFileSync('dist/robots.txt','utf8');assert.equal(robots.includes('Disallow: /\n'),preview);if(!preview)assert.ok(robots.includes('Sitemap: https://openusd.dev/sitemap-index.xml'));
const data=fs.readFileSync('dist/data/index.html','utf8');const jsonld=JSON.parse(data.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)![1]);assert.equal(jsonld['@type'],'Dataset');assert.equal(jsonld.creator.name,'Paul Copplestone');assert.equal(jsonld.license,'https://creativecommons.org/publicdomain/zero/1.0/');assert.ok(!('conditionsOfAccess' in jsonld));assert.equal(jsonld.distribution.contentUrl,'https://openusd.dev/data/ecosystem.json');assert.ok(!fs.existsSync('dist/data/ecosystem-v1.json'));assert.ok(!data.includes('ecosystem-v1.json'));assert.ok(!data.includes('Rights reserved'));
const directory=fs.readFileSync('dist/ecosystem/index.html','utf8');const exported=JSON.parse(fs.readFileSync('dist/data/ecosystem.json','utf8'));
const exportedSchema=JSON.parse(fs.readFileSync('dist/data/ecosystem.schema.json','utf8'));
assert.equal(exported.license.url,jsonld.license);assert.equal(exported.license.identifier,exportedSchema.properties.license.properties.identifier.const);assert.ok(fs.readFileSync('dist/data/LICENSE.txt','utf8').includes('CC0-1.0'));assert.ok(data.includes('id="reuse-and-license"'));
assert.equal(exported.schemaVersion,DATASET_VERSION);assert.equal(jsonld.version,DATASET_VERSION);assert.equal(exportedSchema.properties.schemaVersion.const,DATASET_VERSION);
assert.equal(data.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1],'OUSD ecosystem dataset');
for(const id of ['fetch-and-query','data-structure','product-fields','ousd-support-labels','freshness','contract'])assert.ok(data.includes(`id="${id}"`),'Data documentation anchor '+id);
assert.ok(!data.includes('Record reviews:'));assert.ok(!data.includes('Version 2.1 additions'));
for(const c of exported.capabilities)assert.ok(directory.includes(`id="${c.id}"`),'Prerendered record '+c.id);
for(const n of exported.networks)assert.ok(directory.includes(`id="${n.legacyRecordId}"`),'Legacy anchor '+n.legacyRecordId);
console.log(`PASS: ${urls.length} sitemap pages, canonical/indexing/social metadata, utility exclusions, Dataset markup, and all server-rendered record IDs (${preview?'preview':'production'}).`);

const concepts=fs.readFileSync('dist/guides/concepts/index.html','utf8');
const conceptIds=['blockchain','network','smart-contract','token-address','mint-account','decimals','native-and-bridged-tokens','fiat-currency','stablecoin','issuer','reserves','attestation','minting-and-redemption','wallets-and-custody','transactions-and-explorers','network-fees','finality-and-settlement','api','webhook','idempotency','reconciliation','mainnet-testnet-and-sandbox'];
for(const id of conceptIds) assert.ok(concepts.includes(`id="${id}"`),'Stable concept anchor '+id);
assert.ok(concepts.includes('data-pagefind-body'),'Concepts indexed by site search');
assert.ok(urls.includes('https://openusd.dev/guides/concepts/'),'Concepts in sitemap');
const retiredGuide=fs.readFileSync('dist/guides/index.html','utf8');
assert.ok(retiredGuide.includes('http-equiv="refresh" content="0;url=/guides/what-is-open-usd/"'),'Retired guide index redirects');
assert.ok(retiredGuide.includes('rel="canonical" href="https://openusd.dev/guides/what-is-open-usd/"'),'Retired guide index canonical destination');
assert.ok(!retiredGuide.includes('data-pagefind-body'),'Retired guide index excluded from site search');
assert.ok(!urls.includes('https://openusd.dev/guides/'),'Retired guide index excluded from sitemap');
const config=fs.readFileSync('astro.config.mjs','utf8');
assert.match(config,/slug: 'guides\/what-is-open-usd'[^]*?label: 'Concepts', slug: 'guides\/concepts'/);
assert.ok(!config.includes("{ slug: 'guides' }"),'Retired guide index removed from navigation');
console.log(`PASS: ${conceptIds.length} stable concept anchors, Concepts navigation/search/sitemap, and retired guide-index redirect exclusions.`);
const retiredContribute=fs.readFileSync('dist/contribute/index.html','utf8');
assert.ok(retiredContribute.includes('http-equiv="refresh" content="0;url=/about/"'),'Retired contribution page redirects');
assert.ok(retiredContribute.includes('rel="canonical" href="https://openusd.dev/about/"'),'Retired contribution page canonical destination');
assert.ok(!retiredContribute.includes('data-pagefind-body'),'Retired contribution page excluded from search');
assert.ok(!urls.includes('https://openusd.dev/contribute/'),'Retired contribution page excluded from sitemap');

const integrationTasks=['hold-ousd','send-payouts','issue-cards','mint-and-redeem-ousd','create-wallets','convert-ousd','custody-ousd','accept-payments'];
const taskChooser=fs.readFileSync('dist/start/index.html','utf8');
for(const task of integrationTasks){
  const route=`/guides/${task}/`;
  const page=fs.readFileSync(`dist${route}index.html`,'utf8');
  assert.ok(urls.includes('https://openusd.dev'+route),'Task in sitemap '+task);
  assert.ok(page.includes('data-pagefind-body'),'Task indexed by site search '+task);
  assert.ok(taskChooser.includes(`href="${route}"`),'Chooser links task '+task);
  assert.ok(page.includes('href="/guides/integration-architecture/"'),'Task uses shared architecture '+task);
}
for(const id of ['choose-a-path','before-writing-the-integration','test-the-application'])assert.ok(taskChooser.includes(`id="${id}"`),'Preserved chooser anchor '+id);
console.log('PASS: eight task routes, chooser links, search inclusion, sitemap coverage and retained chooser anchors.');

const activityTitles = {
  '/start/': 'Integrating OUSD',
  '/guides/hold-ousd/': 'Holding OUSD',
  '/guides/send-payouts/': 'Sending payouts from OUSD',
  '/guides/issue-cards/': 'Issuing OUSD-funded cards',
  '/guides/mint-and-redeem-ousd/': 'Minting and redeeming OUSD',
  '/guides/create-wallets/': 'Creating OUSD wallets',
  '/guides/convert-ousd/': 'Converting OUSD',
  '/guides/custody-ousd/': 'Managing OUSD custody',
  '/guides/accept-payments/': 'Accepting OUSD payments',
};
const searchFragments=fs.readdirSync('dist/pagefind/fragment').filter(file=>file.endsWith('.pf_fragment')).map(file=>{
  const fragment=gunzipSync(fs.readFileSync(path.join('dist/pagefind/fragment',file))).toString('utf8');
  return JSON.parse(fragment.slice(fragment.indexOf('{')));
});
for(const [route,title] of Object.entries(activityTitles)){
  const html=fs.readFileSync(`dist${route}index.html`,'utf8');
  assert.equal(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1],title,route+' H1');
  assert.equal(html.match(/<title>(.*?)<\/title>/s)?.[1],title+' | openusd.dev',route+' SEO title');
  assert.ok(html.includes(`property="og:title" content="${title}"`),route+' Open Graph title');
  assert.equal(searchFragments.find(fragment=>fragment.url===route)?.meta.title,title,route+' indexed search title');
  const links=[...taskChooser.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.ok(links.some(([,href,label])=>href===route&&label.replace(/<[^>]*>/g,'').trim()===title),route+' navigation title');
}
console.log('PASS: nine activity-based H1, SEO, Open Graph, indexed-search and navigation labels.');

for(const p of exported.providers){
 const route=`/providers/${p.id}/`;const html=fs.readFileSync(`dist${route}index.html`,'utf8');
 assert.ok(urls.includes('https://openusd.dev'+route),route+' sitemap');
 assert.ok(searchFragments.some(f=>f.url===route),route+' search');
 for(const c of exported.capabilities.filter((c:{providerId:string})=>c.providerId===p.id))assert.ok(html.includes(`id="${c.id}"`),route+' record '+c.id);
 assert.ok(!html.includes('What can you build?'),route+' no task matrix');
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
 assert.ok(main.indexOf('Reviewed '+p.reviewedAt)>main.indexOf('id="references"'),route+' review metadata at bottom');
 for(const task of providerTasks(p.id)){
  assert.ok(main.includes(`id="${task.slug}"`),route+' activity '+task.slug);
  assert.ok(main.includes(`href="/guides/${task.slug}/"`),route+' canonical guide link');
  const guide=fs.readFileSync(`dist/guides/${task.slug}/index.html`,'utf8');
  assert.ok(guide.includes(`href="${route}#${task.slug}"`),task.slug+' exact provider anchor');
 }
 for(const id of Object.values(legacyProfileAnchors[p.id]||{}).flat())assert.ok(main.includes(`id="${id}"`),route+' retained '+id);
}
assert.equal(fs.readFileSync('dist/changelog/index.html','utf8').match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1],'Changelog');
const rss=fs.readFileSync('dist/rss.xml','utf8');assert.ok(rss.includes('openusd.dev Changelog'));assert.ok(rss.includes('https://openusd.dev/changelog/'));
console.log('PASS: provider routes, record anchors, reciprocal task/activity links, bottom metadata, Pagefind search, sitemap and retained Changelog/RSS.');

for(const n of exported.networks){
 const route=`/networks/${n.id}/`;const html=fs.readFileSync(`dist${route}index.html`,'utf8');
 assert.ok(urls.includes('https://openusd.dev'+route),route+' sitemap');
 assert.ok(searchFragments.some(f=>f.url===route),route+' search');
 assert.ok(html.includes(n.address),route+' exact token address');
 assert.ok(html.includes('id="ousd-address"')&&html.includes('id="provider-routes"'),route+' stable sections');
 for(const section of n.profile.sections)assert.ok(html.includes(`id="${section.id}"`),route+' section '+section.id);
}
console.log('PASS: four substantial network routes, source-derived exact addresses, section anchors, Pagefind and sitemap.');

// Directory task cards preserve source relationships, semantic labels and native site search.
const {directoryActivities,directoryUtilities,directoryTagReference,activityStatusGroups}=await import('../src/lib/directory');
const cards=[...directory.matchAll(/<article\b[^>]*data-activity="[^]*?<\/article>/g)].map(m=>m[0]);
assert.equal(cards.length,directoryActivities.length,'Registry-derived server-rendered task/provider cards');
for(const activity of directoryActivities){
 const card=cards.find(c=>c.includes(`id="${activity.id}"`));assert.ok(card,activity.id);
 assert.ok(card.includes(`href="${activity.href}"`),activity.id+' precise destination');
 assert.ok(card.includes(`aria-label="${activity.task.title} with ${activity.provider.name}"`),activity.id+' distinct link name');
 assert.ok(card.includes(`aria-labelledby="${activity.id}-title"`),activity.id+' named article');
 for(const group of activityStatusGroups(activity.records))for(const tag of [group.access,group.support]){
  assert.ok(card.includes(`class="directory-tag" href="#${tag.id}"`),activity.id+' native definition link '+tag.id);
  assert.ok(card.includes(`aria-label="${tag.label}: read definition"`),activity.id+' accessible tag '+tag.label);
 }
 for(const [,body] of card.matchAll(/<a\b[^>]*>([^]*?)<\/a>/g))assert.ok(!/<a\b/.test(body),activity.id+' no nested links');
}
for(const utility of directoryUtilities)assert.ok(directory.includes(`id="${utility.id}"`),'utility anchor '+utility.id);
const form=directory.match(/<form\b[^>]*id="filters"[^>]*>([^]*?)<\/form>/)?.[0]||'';
assert.ok(form.includes('aria-label="Filter activities"'));
assert.ok(!form.includes('type="search"')&&!form.includes('name="q"'),'local text search removed');
for(const id of ['task','provider','access','network']){
 assert.ok(form.includes(`for="${id}"`),'visible filter label '+id);
 assert.ok(form.includes(`id="${id}"`),'native select '+id);
}
assert.ok(directory.includes('<site-search'),'global Starlight search retained');
assert.ok(directory.includes('aria-live="polite" aria-atomic="true"'),'atomic live count');
assert.ok(directory.includes('<noscript>'),'no-JavaScript fallback');
assert.ok(directory.includes('OUSD unconfirmed')&&directory.includes('Access unconfirmed'),'separate support and access uncertainty');
assert.ok(directory.includes('<h2 id="tag-reference">Tag reference</h2>'),'named reference section');
for(const tag of directoryTagReference){
 assert.ok(directory.includes(`<tr id="${tag.id}" tabindex="-1">`),'focusable native fragment '+tag.id);
 assert.ok(directory.includes(`<th scope="row">${tag.label}</th><td>${tag.definition}</td>`),'exact reference definition '+tag.id);
}
const directoryIds=[...directory.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(directoryIds).size,directoryIds.length,'no duplicate directory IDs');
assert.ok(searchFragments.find(f=>f.url==='/ecosystem/')?.content.includes('Creating OUSD wallets'),'task content indexed in global search');
console.log('PASS: registry-derived task/provider cards, exact activity links, accessible native tag links and reference rows, four labeled dropdowns, stable anchors, no local text search and retained Starlight search.');

const home=fs.readFileSync('dist/index.html','utf8');
const website=JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)![1]);
assert.equal(website.name,'openusd.dev');assert.equal(website.alternateName,'Open USD stablecoin developer reference');
assert.match(home,/<title>Open USD \(OUSD\) stablecoin for developers \| openusd\.dev<\/title>/);
for(const p of exported.providers){
 const html=fs.readFileSync(`dist/providers/${p.id}/index.html`,'utf8');
 assert.equal(html.match(/<title>(.*?)<\/title>/s)?.[1],p.name+' OUSD integration | openusd.dev');
}
for(const [route,fragment] of [['providers/privy','tempo-transfer-request'],['networks/solana','solana-balance-example'],['guides/integration-architecture','worked-failure-sequence']]){
 const html=fs.readFileSync(`dist/${route}/index.html`,'utf8');assert.ok(html.includes(`id="${fragment}"`));
}
console.log('PASS: stablecoin site identity, OUSD provider titles, worked-example anchors and CC0 export agreement.');
