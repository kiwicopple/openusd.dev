import {z} from 'zod';
export const DATASET_VERSION='0.1.0-alpha' as const;
export const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>!Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10)===s,'Invalid date');
const id=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text=z.string().min(1);
export const SourceSchema=z.object({id,url:z.url(),title:text,publishedAt:date.nullable(),reviewedAt:date}).strict();
export const StatementSchema=z.object({text,sourceIds:z.array(id).nonempty()}).strict();
export const ExampleSchema=z.object({id,title:text,language:z.enum(['http','js','json','bash','text']),description:text,code:text,sourceIds:z.array(id).nonempty()}).strict();
export const ProfileSchema=z.object({title:text,introduction:StatementSchema,sections:z.array(z.object({id,heading:text,paragraphs:z.array(StatementSchema).nonempty(),examples:z.array(ExampleSchema).optional()}).strict()).nonempty()}).strict();
export const ProviderSchema=z.object({id,name:text,kind:text,description:text,detail:z.boolean(),modifiedAt:date,reviewedAt:date,profile:ProfileSchema.optional()}).strict();
const CapabilityFields=z.object({id,providerId:id,name:text,capability:text,assetScope:text,networks:z.array(text).nonempty().nullable(),networkNote:text,availability:z.enum(['announced','private_beta','public_beta','generally_available','deprecated','unknown']),availabilityReason:text,summary:text,accessRequirements:text,limitations:z.array(text).nonempty(),officialDocumentationUrl:z.url().nullable(),evidence:z.enum(['source-backed','provider-reviewed','independently tested']),evidenceArtifact:z.url().nullable(),modifiedAt:date,reviewedAt:date,sources:z.array(z.object({sourceId:id,claim:text}).strict()).nonempty()}).strict().refine(c=>c.evidence==='source-backed'||c.evidenceArtifact!==null,'Higher evidence labels need a real evidence artifact');
export const UpdateSchema=z.object({id,date,modifiedAt:date,type:z.enum(['site','ecosystem']),title:text,description:text,sourceId:id.nullable(),draft:z.boolean()}).strict().refine(u=>u.type==='site'||u.sourceId!==null,'Ecosystem updates need sources');
export const taskLabels = { 'accept-payments':'Accept payments', 'send-payouts':'Send payouts', 'hold-funds':'Hold funds', 'create-wallets':'Create wallets', 'mint-redeem':'Mint / redeem', 'issue-cards':'Issue cards', convert:'Convert', custody:'Manage custody', development:'Development', 'api-access':'API access' } as const;
export const TaskSchema=z.enum(Object.keys(taskLabels) as [keyof typeof taskLabels, ...Array<keyof typeof taskLabels>]);
export const accessLabels={onboarding_required:'Onboarding required',restricted_beta:'Restricted beta',announced:'Announced',not_established:'Not established',self_service:'Self-service'} as const;
export const AccessSchema=z.enum(Object.keys(accessLabels) as [keyof typeof accessLabels,...Array<keyof typeof accessLabels>]);
export const supportLabels={documented:'OUSD documented',listed:'OUSD path listed',unresolved:'OUSD unresolved',generic:'General platform only'} as const;
export const SupportSchema=z.enum(['documented','listed','unresolved','generic']);
export const CapabilitySchema=CapabilityFields.safeExtend({tasks:z.array(TaskSchema).nonempty(),access:AccessSchema,environment:z.enum(['production','sandbox','unknown']),verification:z.enum(['not_tested','tested']),ousdSupport:SupportSchema.optional()});
export const NetworkSchema=z.object({id,name:text,legacyRecordId:id,asset:z.literal('OUSD'),deployment:z.literal('native'),address:text,explorerUrl:z.url(),sourceId:id,reviewedAt:date,modifiedAt:date,profile:ProfileSchema.optional()}).strict();
export const ExportCapabilitySchema=z.object({...CapabilitySchema.shape,sources:z.array(SourceSchema.extend({supportedClaim:text})).nonempty()}).strict().refine(c=>c.evidence==='source-backed'||c.evidenceArtifact!==null,'Higher evidence labels need a real evidence artifact').refine(c=>c.verification!=='tested'||(c.evidence==='independently tested'&&c.evidenceArtifact!==null),'Tested records need independent test evidence');
export const ExportNetworkSchema=NetworkSchema.extend({source:SourceSchema});
export const DatasetSchema=z.object({
  $schema:z.url(),schemaVersion:z.literal(DATASET_VERSION),description:text,documentation:z.url(),modifiedAt:date,
  license:z.object({identifier:z.literal('CC0-1.0'),url:z.literal('https://creativecommons.org/publicdomain/zero/1.0/'),noticeUrl:z.url(),scope:text,modifiedAt:date}).strict().optional(),
  reviewCoverage:z.object({oldestRecordReview:date,newestRecordReview:date,recordCount:z.number().int().positive(),meaning:text}).strict(),
  providers:z.array(ProviderSchema),networks:z.array(ExportNetworkSchema),capabilities:z.array(ExportCapabilitySchema),
  tasks:z.record(TaskSchema,text),sources:z.array(SourceSchema)
}).strict();

// Zod refinements are not emitted by toJSONSchema; publish the same evidence constraints explicitly.
export function datasetJsonSchema(){
 const schema=z.toJSONSchema(DatasetSchema);
 const item=(schema.properties!.capabilities as {items:Record<string,unknown>}).items;
 item.allOf=[
  {if:{properties:{evidence:{enum:['provider-reviewed','independently tested']}}},then:{properties:{evidenceArtifact:{type:'string',format:'uri'}}}},
  {if:{properties:{verification:{const:'tested'}}},then:{properties:{evidence:{const:'independently tested'},evidenceArtifact:{type:'string',format:'uri'}}}}
 ];
 return {...schema,$id:'https://openusd.dev/data/ecosystem.schema.json'};
}

export type Dataset = z.infer<typeof DatasetSchema>;
export type Capability = z.infer<typeof CapabilitySchema>;
