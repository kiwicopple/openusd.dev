import fs from 'node:fs';import path from 'node:path';
import {providers,networks} from '../src/lib/registry';
const root=path.resolve('dist');
function walk(dir:string):string[]{return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const html=walk(root).filter(p=>p.endsWith('.html'));const errors:string[]=[];let links=0;
for(const file of html){const text=fs.readFileSync(file,'utf8');if(!/<main\b/.test(text))errors.push(`${file}: no prerendered main`);if(!/<h1\b/.test(text))errors.push(`${file}: no primary heading`);if(!/<link[^>]+rel="canonical"/.test(text))errors.push(`${file}: no canonical`);const route=path.relative(root,file).replace(/index\.html$/,'').replace(/\.html$/,'');for(const m of text.matchAll(/(?:href|src)="([^"<>]+)"/g)){const href=m[1].replace(/&amp;/g,'&');if(/^(https?:|mailto:|data:|tel:|javascript:)/.test(href))continue;const u=new URL(href,'https://local.invalid/'+route);let name=decodeURIComponent(u.pathname).replace(/^\//,'');const candidates=[path.join(root,name),path.join(root,name,'index.html'),path.join(root,name+'.html')];const target=candidates.find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());links++;if(!target){errors.push(`${path.relative(root,file)} → missing ${href}`);continue;}if(u.hash&&target.endsWith('.html')){const frag=decodeURIComponent(u.hash.slice(1));const dest=fs.readFileSync(target,'utf8');if(!dest.includes(`id="${frag}"`))errors.push(`${path.relative(root,file)} → missing anchor ${href}`);}}}
const expected=['/','/start','/status','/ecosystem','/guides','/guides/concepts','/guides/what-is-open-usd','/guides/open-usd-vs-usdc','/guides/open-usd-vs-usdg','/guides/open-usd-vs-usdt','/guides/open-usd-vs-open-issuance','/guides/integration-architecture','/changelog','/about','/privacy','/contribute','/data/ecosystem.json','/data','/search','/404.html','/sitemap.xml','/robots.txt','/rss.xml'];
for(const route of expected){const p=path.join(root,route);if(![p,path.join(p,'index.html'),p+'.html'].some(x=>fs.existsSync(x)))errors.push(`Required route missing: ${route}`);}
const map=fs.readFileSync(path.join(root,'sitemap-0.xml'),'utf8');for(const excluded of ['/search','/404','/data/ecosystem.json'])if(map.includes(excluded))errors.push(`Sitemap includes excluded route: ${excluded}`);
const titles=html.filter(p=>!p.includes('pagefind')).map(p=>fs.readFileSync(p,'utf8').match(/<title>(.*?)<\/title>/)?.[1]);if(new Set(titles).size!==titles.length)errors.push('Duplicate page titles');

// The native desktop and mobile contents must match the rendered profile headings.
const label=(text:string)=>text.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
for(const route of [...providers.filter(p=>p.detail).map(p=>`providers/${p.id}`),...networks.filter(n=>n.profile).map(n=>`networks/${n.id}`)]){
 const page=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
 const main=page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
 const headings=[...main.matchAll(/<h([23])\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)].map(m=>({href:`#${m[2]}`,text:label(m[3])}));
 if(!headings.length)errors.push(`${route}: missing anchored profile headings`);
 if(new Set(headings.map(h=>h.href)).size!==headings.length)errors.push(`${route}: duplicate heading anchors`);
 for(const tag of ['starlight-toc','mobile-starlight-toc']){
  const toc=page.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]||'';
  const links=[...toc.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({href:m[1],text:label(m[2])})).filter(l=>l.href!=='#_top');
  if(JSON.stringify(links)!==JSON.stringify(headings))errors.push(`${route}: ${tag} differs from rendered heading order or labels`);
 }
 if(page.includes('profile-jump'))errors.push(`${route}: redundant inline contents navigation`);
}
for(const file of html){
 const page=fs.readFileSync(file,'utf8');
 const route=path.relative(root,file);
 if(!/<a\b[^>]*class="docs-link\b[^"]*"[^>]*href="\/guides\/what-is-open-usd\/"[^>]*>Docs<\/a>/.test(page))errors.push(`${route}: missing Docs navbar link to the handbook introduction`);
 if(/href="\/contribute\/"|Suggest a correction|Propose a correction/.test(page))errors.push(`${route}: contribution invitation remains`);
 if(/contact@openusd\.dev/.test(page))errors.push(`${route}: retired personal email remains`);
 if(/<a\b[^>]*rel="(?:prev|next)"/.test(page))errors.push(`${route}: previous/next pagination is enabled`);
 const groups=new Map([...page.matchAll(/<details\b([^>]*)>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>/g)].map(m=>[label(m[2]),/\bopen\b/.test(m[1])]));
 if(route.startsWith('providers/')&&groups.get('Providers')!==true)errors.push(`${route}: active Providers group is closed`);
 if(route.startsWith('networks/')&&groups.get('Networks')!==true)errors.push(`${route}: active Networks group is closed`);
 if(route==='ecosystem/index.html'&&(groups.get('Providers')!==false||groups.get('Networks')!==false))errors.push(`${route}: profile groups should start collapsed`);
}

for (const file of html.filter(file => !file.endsWith('/404.html'))) {
  const page = fs.readFileSync(file, 'utf8');
  if (file !== path.join(root, 'index.html') && !page.includes('popovertarget="starlight__sidebar"')) errors.push(file + ': missing standard mobile navigation');
  if (!page.includes('aria-label="Site footer"')) errors.push(file + ': missing site footer');
}
for(const file of html){
 const page=fs.readFileSync(file,'utf8');
 const footer=page.match(/<footer\b[^>]*aria-label="Site footer"[^>]*>([\s\S]*?)<\/footer>/)?.[1]||'';
 if(!label(footer).includes('Independent reference for Open USD, a shared stablecoin for global financial activity.'))errors.push(`${file}: incorrect footer descriptor`);
 const navigation=footer.match(/<nav\b[^>]*aria-label="Footer"[^>]*>([\s\S]*?)<\/nav>/)?.[1]||'';
 const links=[...navigation.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
 if(JSON.stringify(links)!==JSON.stringify(['/about/','/privacy/','/sitemap-index.xml','/llms.txt']))errors.push(`${file}: unexpected footer navigation`);
 if(/Built with|footer-credit|mailto:/.test(footer))errors.push(`${file}: removed footer content remains`);
}
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for(const route of ['about','privacy'])if(!fs.readFileSync(path.join(root,route,'index.html'),'utf8').includes('href="https://x.com/kiwicopple"'))errors.push(`${route}: missing Paul contact profile`);
if (/<html[^>]*data-has-sidebar/.test(home) || !/<html[^>]*data-has-hero/.test(home)) errors.push('Homepage must use the standard splash layout');
if (!map.includes('https://openusd.dev/privacy')) errors.push('Privacy Policy missing from sitemap');

if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`PASS: ${html.length} HTML pages, ${links} internal links/assets, ${expected.length} required routes, unique titles, primary HTML and sitemap exclusions.`);

if([...map.matchAll(/<loc>(.*?)<\/loc>/g)].some(m=>m[1].includes('?')))throw Error('Query URL in sitemap');
