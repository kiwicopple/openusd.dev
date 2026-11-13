import {capabilities,handbookTasks,providers} from './registry';
import {capabilityActivityAnchor} from './provider-guides';
import type {Capability} from './schema';
import {accessTags,tagsForRecord,tagReferenceFor,type DirectoryTag} from './directory-tags';

// Card membership, descriptions and status facts all come from the existing registry.
// A card is one task/provider relationship, not one product or an inferred capability.
export const directoryActivities=handbookTasks.flatMap(task=>
 [...providers].sort((a,b)=>a.name.localeCompare(b.name)).flatMap(provider=>{
  const records=capabilities.filter(c=>c.providerId===provider.id&&c.tasks.includes(task.id));
  if(!records.length)return [];
  const section=provider.profile?.sections.find(s=>s.id===task.slug);
  if(!section)throw Error(`Missing directory activity: ${provider.id}/${task.slug}`);
  return [{id:`${provider.id}-${task.slug}`,task,provider,records,description:section.paragraphs[0].text,
   href:`/providers/${provider.id}/#${task.slug}`,
   legacyIds:records.filter(c=>capabilityActivityAnchor(c)===task.slug).map(c=>c.id)}];
 })
);
export const directoryUtilities=capabilities.filter(c=>!handbookTasks.some(t=>c.tasks.includes(t.id)));
export const directoryTaskLabels=Object.fromEntries(handbookTasks.map(t=>[t.id,t.title]));
export const directoryAccessLabels=Object.fromEntries(Object.entries(accessTags)
 .filter(([id])=>directoryActivities.some(a=>a.records.some(c=>c.access===id)))
 .map(([id,tag])=>[id,tag.label]));
export const directoryTagReference=tagReferenceFor(directoryActivities.flatMap(activity=>activity.records));

export function activityStatusGroups(records:Capability[]){
 const groups=new Map<string,{records:Capability[];access:DirectoryTag;support:DirectoryTag}>();
 for(const record of records){
  const support=record.ousdSupport||'unresolved';
  const key=`${record.access}/${support}`;
  const group=groups.get(key);
  if(group){group.records.push(record);continue;}
  groups.set(key,{records:[record],...tagsForRecord(record)});
 }
 return [...groups.values()];
}
