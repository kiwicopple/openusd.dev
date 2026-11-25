export type Filters={query:string;availability:string;capability:string;network:string};
export type SearchRecord={search:string;availability:string;capability:string;networks:string};
export function matchesRecord(r:SearchRecord,f:Filters){const terms=f.query.trim().toLowerCase().split(/\s+/).filter(Boolean);return terms.every(t=>r.search.toLowerCase().includes(t))&&(!f.availability||r.availability===f.availability)&&(!f.capability||r.capability===f.capability)&&(!f.network||r.networks.split('|').includes(f.network));}
