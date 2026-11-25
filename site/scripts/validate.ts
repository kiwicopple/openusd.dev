import {providers,capabilities,networks,sources,updates,source,provider} from '../src/lib/registry';
export function assertUnique(records:{id:string}[],name:string){const ids=records.map(r=>r.id);if(new Set(ids).size!==ids.length)throw Error(`Duplicate ID in ${name}`);}
for(const [name,records] of Object.entries({providers,capabilities,networks,sources,updates})){assertUnique(records,name);}
for(const c of capabilities){provider(c.providerId);for(const s of c.sources)source(s.sourceId);}
for(const u of updates){if(u.sourceId)source(u.sourceId);}
const today=new Date().toISOString().slice(0,10);
// A source recheck is not a review of every record that cites it. Editorial
// modifications can be later than factual reviews; both dates must be honest.
for(const r of [...providers,...capabilities,...networks,...sources]){if(r.reviewedAt>today)throw Error(`Future review date: ${r.id}`);if('modifiedAt' in r&&r.modifiedAt>today)throw Error(`Future modification date: ${r.id}`);}
console.log(`Validated ${providers.length} providers, ${capabilities.length} capabilities, ${sources.length} sources, ${updates.length} published updates.`);

for(const n of networks)source(n.sourceId);
for(const record of [...providers,...networks]){
 if(record.profile){
  const statements=[record.profile.introduction,...record.profile.sections.flatMap(s=>[...s.paragraphs,...(s.examples||[])])];
  for(const statement of statements)for(const id of statement.sourceIds)source(id);
  const reserved=['task-matrix','products','next-steps','ousd-address','provider-routes',...capabilities.filter(c=>c.providerId===record.id).map(c=>c.id)];
  for(const section of record.profile.sections)if(reserved.includes(section.id))throw Error(`Reserved profile anchor: ${record.id}/${section.id}`);
  assertUnique([...record.profile.sections,...record.profile.sections.flatMap(s=>s.examples||[])],`${record.id} profile sections`);
 }
}
