import type {Capability} from './schema';

export interface DirectoryTag { id:string; label:string; definition:string }

// Presentation only: registry enums and exported product claims stay unchanged.
export const accessTags:Record<Capability['access'],DirectoryTag>={
 onboarding_required:{id:'tag-onboarding',label:'Onboarding',definition:'An account and provider onboarding are required. Eligibility and approval depend on the product.'},
 restricted_beta:{id:'tag-limited-beta',label:'Limited beta',definition:'Access is limited to selected clients or a private preview. Confirm eligibility and release restrictions with the provider.'},
 announced:{id:'tag-announced',label:'Announced',definition:'The provider has announced this product or access path. Availability and release timing still need confirmation.'},
 not_established:{id:'tag-access-unconfirmed',label:'Access unconfirmed',definition:'The reviewed sources do not establish access to this product for OUSD. Confirm availability and eligibility with the provider.'},
 self_service:{id:'tag-self-service',label:'Self-service',definition:'The documented access path can be started directly. Account, eligibility and product requirements still apply.'},
};
const unconfirmed:DirectoryTag={id:'tag-ousd-unconfirmed',label:'OUSD unconfirmed',definition:'OUSD support for this product is unresolved in the reviewed sources. General platform documentation is not confirmation; unconfirmed does not mean unsupported.'};
export const supportTags:Record<NonNullable<Capability['ousdSupport']>,DirectoryTag>={
 documented:{id:'tag-ousd-documented',label:'OUSD documented',definition:'Official sources explicitly describe this product’s use of OUSD for the activity. Check the provider profile for supported operations, networks and limits.'},
 listed:{id:'tag-ousd-listed',label:'OUSD listed',definition:'An official OUSD integration listing names this provider for the activity. Product-level OUSD support and implementation details still need confirmation.'},
 unresolved:unconfirmed,
 generic:unconfirmed,
};

export function tagsForRecord(record:Pick<Capability,'access'|'ousdSupport'>){
 return {access:accessTags[record.access],support:supportTags[record.ousdSupport||'unresolved']};
}

export function tagReferenceFor(records:Pick<Capability,'access'|'ousdSupport'>[]){
 const used=new Set(records.flatMap(record=>Object.values(tagsForRecord(record)).map(tag=>tag.id)));
 return [...new Map([...Object.values(accessTags),...Object.values(supportTags)].map(tag=>[tag.id,tag])).values()].filter(tag=>used.has(tag.id));
}
