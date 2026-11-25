export type DirectoryRecord={id?:string;access:string;networks:string[]|null};
export type DirectoryActivity={task:string;provider:string;records:DirectoryRecord[]};
export type DirectoryFilter={task:string;provider:string;access:string;network:string;includeUnknown:boolean};
export const directoryFilterKeys=['task','provider','access','network'] as const;
export function matchesDirectory(activity:DirectoryActivity,filter:DirectoryFilter){
 return (!filter.task||activity.task===filter.task)&&(!filter.provider||activity.provider===filter.provider)&&activity.records.some(record=>
  (!filter.access||record.access===filter.access)&&
  (!filter.network||(record.networks===null?(filter.network==='unknown'||filter.includeUnknown):record.networks.includes(filter.network)))
 );
}
export function directoryFiltersFromUrl(url:URL):DirectoryFilter{
 return {task:url.searchParams.get('task')||'',provider:url.searchParams.get('provider')||'',access:url.searchParams.get('access')||'',network:url.searchParams.get('network')||'',includeUnknown:url.searchParams.get('includeUnknown')!=='false'};
}
export function directoryFilterUrl(url:URL,filter:DirectoryFilter){
 const next=new URL(url);
 next.searchParams.delete('q'); // Retired local search must not silently filter shared URLs.
 for(const key of directoryFilterKeys){if(filter[key])next.searchParams.set(key,filter[key]);else next.searchParams.delete(key);}
 if(!filter.includeUnknown)next.searchParams.set('includeUnknown','false');else next.searchParams.delete('includeUnknown');
 return next;
}
