import fs from 'node:fs';
import path from 'node:path';

// Editorial dates only. Never infer a content change from filesystem or build time.
export function significantDate(value:unknown):string|undefined {
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return;
 const parsed=new Date(value);
 return !Number.isNaN(+parsed)&&parsed.toISOString().slice(0,10)===value?value:undefined;
}
export const latestDate=(...values:unknown[])=>values.map(significantDate).filter((v):v is string=>!!v).sort().at(-1);
export function contentDates(root=process.cwd()){
 const dates:Record<string,string|undefined>={};
 const docs=path.join(root,'src/content/docs');
 for(const file of fs.readdirSync(docs,{recursive:true}).map(String).filter(f=>/\.mdx?$/.test(f))){
  const frontmatter=fs.readFileSync(path.join(docs,file),'utf8').split('---')[1]||'';
  if(/^draft:\s*true\s*$/m.test(frontmatter))continue;
  const route='/'+file.replace(/\.mdx?$/,'').replace(/(^|\/)index$/,'');
  dates[route.endsWith('/')?route:route+'/']=significantDate(frontmatter.match(/^modifiedAt:\s*['"]?(\d{4}-\d{2}-\d{2})['"]?\s*$/m)?.[1]);
 }
 const read=(name:string)=>JSON.parse(fs.readFileSync(path.join(root,'src/data',name+'.json'),'utf8'));
 const providers=read('providers'),networks=read('networks'),capabilities=read('capabilities'),updates=read('updates').filter((u:any)=>!u.draft);
 for(const p of providers)dates[`/providers/${p.id}/`]=latestDate(p.modifiedAt,...capabilities.filter((c:any)=>c.providerId===p.id).map((c:any)=>c.modifiedAt));
 for(const n of networks){
  const displayed=capabilities.filter((c:any)=>c.ousdSupport==='documented'&&c.networks?.includes(n.name));
  const displayedProviders=providers.filter((p:any)=>displayed.some((c:any)=>c.providerId===p.id));
  dates[`/networks/${n.id}/`]=latestDate(n.modifiedAt,...displayed.map((c:any)=>c.modifiedAt),...displayedProviders.map((p:any)=>p.modifiedAt));
 }
 dates['/networks/']=latestDate(dates['/networks/'],...networks.map((n:any)=>n.modifiedAt));
 const registryDate=latestDate(...[...providers,...networks,...capabilities].map((r:any)=>r.modifiedAt));
 dates['/ecosystem/']=latestDate(dates['/ecosystem/'],registryDate);
 dates['/data/']=latestDate(dates['/data/'],registryDate,read('license').modifiedAt);
 dates['/changelog/']=latestDate(dates['/changelog/'],...updates.map((u:any)=>u.modifiedAt));
 // The homepage displays the latest two ecosystem updates, not the full registry.
 dates['/']=latestDate(dates['/'],...updates.filter((u:any)=>u.type==='ecosystem').sort((a:any,b:any)=>b.date.localeCompare(a.date)).slice(0,2).map((u:any)=>u.modifiedAt));
 return dates;
}
