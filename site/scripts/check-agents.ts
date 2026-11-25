import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root='dist';
const origin='https://openusd.dev';
const read=(file:string)=>fs.readFileSync(path.join(root,file),'utf8');
const index=read('llms.txt');
const full=read('llms-full.txt');
const routes=[...read('sitemap-0.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const decode=(text:string)=>text.replace(/&(?:amp|lt|gt|quot|apos|#39|#x[\da-f]+|#\d+);/gi,entity=>{
  const named:Record<string,string>={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'"};
  return named[entity]??String.fromCodePoint(parseInt(entity.slice(entity[2]==='x'?3:2,-1),entity[2]==='x'?16:10));
});
const plain=(html:string)=>decode(html.replace(/<[^>]*>/g,''));
const normalize=(text:string)=>text.replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ').trim();
const markdownPath=(route:string)=>route==='/'?'index.md':route.slice(1,-1)+'.md';

if(process.argv.includes('--preview')){
  assert.match(index,/Preview build/);
  for(const route of routes)assert.ok(!fs.existsSync(path.join(root,markdownPath(route))),`Preview must not export ${route}`);
  console.log('PASS: preview agent index is explicitly disabled and no page Markdown is exported.');
  process.exit(0);
}

for(const section of ['Concepts','Tasks','Comparisons','Providers','Networks','Data','Optional'])assert.ok(index.includes(`## ${section}\n`),section);
for(const identity of ['Open Standard','Pixar','Origin Dollar'])assert.ok(index.includes(identity),identity);
for(const file of ['data/ecosystem.json','data/ecosystem.schema.json','llms-full.txt'])assert.ok(index.includes(`${origin}/${file}`),file);
assert.ok(!index.includes('"capabilities":'),'The index must link to the existing dataset, not duplicate it.');

let bodyLinks=0,codeBlocks=0;
for(const route of routes){
  const html=read(route.slice(1)+'index.html');
  const main=html.match(/<main\b[^>]*>([^]*?)<\/main>/)?.[1];
  assert.ok(main,`Missing main: ${route}`);
  const md=read(markdownPath(route));
  const canonical=origin+route;
  assert.ok(md.includes(`url: ${canonical}\n`),`Original URL: ${route}`);
  assert.ok(index.includes(`${origin}/${markdownPath(route)})`),`Index covers Markdown: ${route}`);
  assert.ok(index.includes(`(${canonical})`),`Index covers original: ${route}`);
  assert.ok(full.includes(canonical),`Full export covers page: ${route}`);
  assert.ok(full.includes(md.replace(/^---\n[^]*?\n---\n\n/,'')),`Full export preserves complete page: ${route}`);
  assert.ok(html.includes(`type="text/markdown" href="/${markdownPath(route)}"`)||html.includes(`href="/${markdownPath(route)}" type="text/markdown"`),`Alternate link: ${route}`);
  assert.ok(!/Allow usage analytics\?|Section titled:|Copy to clipboard|Skip to content|<script|<style/.test(md),`UI noise: ${route}`);

  // Check each substantive link independently of the plugin's converter, including GFM tables.
  for(const [,attributes] of main.matchAll(/<a\b([^>]*\bhref="[^"]+"[^>]*)>/g)){
    if(/class="[^"]*sl-anchor-link/.test(attributes))continue;
    const href=decode(attributes.match(/href="([^"]+)"/)![1]);
    if(href.startsWith('#'))continue;
    const url=new URL(href,canonical).href;
    if(url.includes('/privacy/')||url===origin+'/about/'||url===origin+'/sitemap-index.xml'||url===origin+'/llms.txt'||url===origin+'/')continue;
    bodyLinks++;
    assert.ok(md.includes(url)||md.includes(url.replace(/[()]/g,'\\$&')),`Preserved link ${route} → ${url}`);
  }
  for(const [,preAttributes,code] of main.matchAll(/<pre\b([^>]*)>\s*<code[^>]*>([^]*?)<\/code>\s*<\/pre>/g)){
    const lines=[...code.matchAll(/<div class="ec-line"[^>]*><div class="code"[^>]*>([^]*?)<\/div><\/div>/g)].map(m=>plain(m[1]));
    const expected=(lines.length?lines.join('\n'):plain(code)).trimEnd();
    assert.ok(md.includes(expected),`Code text and line breaks: ${route}`);
    const language=preAttributes.match(/data-language="([^"]+)"/)?.[1];
    if(language&&!['text','txt','plaintext'].includes(language))assert.ok(md.includes('```'+language+'\n'),`Code language: ${route}`);
    codeBlocks++;
  }
  for(const [,table] of main.matchAll(/<table\b[^>]*>([^]*?)<\/table>/g)){
    const readable=normalize(md.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[`*\\]/g,''));
    for(const [,cell] of table.matchAll(/<t[hd]\b[^>]*>([^]*?)<\/t[hd]>/g))assert.ok(readable.includes(normalize(plain(cell))),`Table cell text: ${route} → ${plain(cell)}`);
  }
  for(const [,note] of main.matchAll(/<p\b[^>]*class="source-note"[^>]*>([^]*?)<\/p>/g))assert.ok(normalize(md).includes(normalize(plain(note))),`Review/testing caveat: ${route}`);

  // Markdown retains canonical HTML targets and their exact fragments.
  for(const [,href] of md.matchAll(/\]\((https:\/\/openusd\.dev\/[^\s)]+)\)/g)){
    const u=new URL(href.replace(/\\([()])/g,'$1'));
    const file=u.pathname.endsWith('/')?u.pathname.slice(1)+'index.html':u.pathname.slice(1);
    assert.ok(fs.existsSync(path.join(root,file)),`Markdown target ${route} → ${href}`);
    if(u.hash&&file.endsWith('.html'))assert.ok(read(file).includes(`id="${decodeURIComponent(u.hash.slice(1))}"`),`Markdown fragment ${href}`);
  }
}
for(const route of ['search','status','guides','contribute','404'])assert.ok(!fs.existsSync(path.join(root,route+'.md')),`Utility excluded: ${route}`);
const exported=JSON.parse(read('data/ecosystem.json'));
for(const network of exported.networks)assert.ok(read(`networks/${network.id}.md`).includes(network.address),`Exact address: ${network.id}`);
assert.ok(read('guides/integration-architecture.md').includes('illustrative application architecture'),'Illustrative-code caveat');
for(const text of ['launch announcement explicitly includes OUSD payment acceptance','accepted-token table still names only USDC, USDP and USDG','conflict remained unresolved'])assert.ok(read('providers/stripe.md').includes(text),'Product-specific uncertainty: '+text);
assert.ok(read('data.md').includes('CC0 1.0 Universal')&&read('data.md').includes('without permission or attribution'),'Dataset reuse rights');
assert.ok(read('providers/privy.md').includes('privy-idempotency-key:')&&read('providers/privy.md').includes('not an idempotency key'),'Privy request and reference distinction');
assert.ok(!/requiredOUSD|unconfirmedOUSD|betaOUSD|previewOUSD/.test(read('ecosystem.md')),'Adjacent badge labels stay separate');
assert.ok(!/\)\w/.test(read('index.md')),'Home card text stays separate from links');
console.log(`PASS: ${routes.length} indexed Markdown pages, ${bodyLinks} substantive links, ${codeBlocks} intact code blocks, full export, exact addresses, review/testing caveats, original URLs and HTML fragment targets.`);
