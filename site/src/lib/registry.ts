import rawProviders from '../data/providers.json';
import rawCapabilities from '../data/capabilities.json';
import rawNetworks from '../data/networks.json';
import rawSources from '../data/sources.json';
import rawUpdates from '../data/updates.json';
import license from '../data/license.json';
import {ProviderSchema,CapabilitySchema,NetworkSchema,SourceSchema,UpdateSchema,DatasetSchema,DATASET_VERSION,taskLabels,accessLabels,supportLabels} from './schema';
export {taskLabels,accessLabels,supportLabels};
export const sources=rawSources.map(s=>SourceSchema.parse(s));
export const providers=rawProviders.map(p=>ProviderSchema.parse(p));
export const capabilities=rawCapabilities.map(c=>CapabilitySchema.parse(c));
export const networks=rawNetworks.map(n=>NetworkSchema.parse(n));
export const updates=rawUpdates.map(u=>UpdateSchema.parse(u)).filter(u=>!u.draft).sort((a,b)=>b.date.localeCompare(a.date));
export const source=(id:string)=>{const s=sources.find(s=>s.id===id);if(!s)throw Error(`Unknown source ${id}`);return s;};
export const provider=(id:string)=>{const p=providers.find(p=>p.id===id);if(!p)throw Error(`Unknown provider ${id}`);return p;};
export const availabilityLabels={announced:'Announced',private_beta:'Restricted beta',public_beta:'Public beta',generally_available:'Generally available',deprecated:'Deprecated',unknown:'Not established'};
const records=[...capabilities,...networks,...providers];
const reviews=records.map(c=>c.reviewedAt).sort();
export const latestReview=reviews.at(-1)!;
export const registryModified=[license.modifiedAt,...records.map(c=>c.modifiedAt)].sort().at(-1)!;
export const dataset=DatasetSchema.parse({
 $schema:'https://openusd.dev/data/ecosystem.schema.json',schemaVersion:DATASET_VERSION,modifiedAt:registryModified,
 description:'OUSD provider and network reference. A dated snapshot; no provider integration independently tested.',
 documentation:'https://openusd.dev/data/',license,
 reviewCoverage:{oldestRecordReview:reviews[0],newestRecordReview:latestReview,recordCount:records.length,meaning:'Range of individual provider, capability, and network review dates. Not a complete-site certification.'},
 tasks:taskLabels,sources,providers,networks:networks.map(n=>({...n,source:source(n.sourceId)})),
 capabilities:capabilities.map(c=>({...c,sources:c.sources.map(s=>({...source(s.sourceId),supportedClaim:s.claim}))}))
});

export const handbookTasks=[
 {id:'hold-funds',title:'Holding OUSD',slug:'hold-ousd'},
 {id:'send-payouts',title:'Sending payouts from OUSD',slug:'send-payouts'},
 {id:'issue-cards',title:'Issuing OUSD-funded cards',slug:'issue-cards'},
 {id:'mint-redeem',title:'Minting and redeeming OUSD',slug:'mint-and-redeem-ousd'},
 {id:'create-wallets',title:'Creating OUSD wallets',slug:'create-wallets'},
 {id:'convert',title:'Converting OUSD',slug:'convert-ousd'},
 {id:'custody',title:'Managing OUSD custody',slug:'custody-ousd'},
 {id:'accept-payments',title:'Accepting OUSD payments',slug:'accept-payments'},
] as const;
