import {capabilities,handbookTasks,providers} from './registry';

// Relationships come from capabilities; prose comes from the provider's activity.
export const providerTasks=(providerId:string)=>handbookTasks.filter(t=>capabilities.some(c=>c.providerId===providerId&&c.tasks.includes(t.id)));
export function taskProviderMarkdown(taskId:string){
 const task=handbookTasks.find(t=>t.id===taskId);
 if(!task)throw Error(`Unknown handbook task: ${taskId}`);
 return providers.filter(p=>capabilities.some(c=>c.providerId===p.id&&c.tasks.includes(task.id))).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>{
  const section=p.profile?.sections.find(s=>s.id===task.slug);
  if(!section)throw Error(`Missing provider activity: ${p.id}/${task.slug}`);
  return `- [${p.name}](/providers/${p.id}/#${task.slug}): ${section.paragraphs[0].text}`;
 }).join('\n');
}

// Preserve published inbound fragments when reorganizing prose into task sections.
export const legacyProfileAnchors:Record<string,Record<string,string[]>>={
 visa:{'create-wallets':['wallet-options'],'accessing-apis':['access-and-api'],'hold-ousd':['network-and-eligibility']},
 stripe:{'hold-ousd':['balances-and-custody'],'send-payouts':['payouts-and-cards'],'accept-payments':['payment-acceptance']},
 bridge:{'mint-and-redeem-ousd':['issuance-and-access'],'create-wallets':['wallets-and-routes'],'testing-integrations':['testing-and-cards']},
 coinbase:{'convert-ousd':['exchange-purchases'],'create-wallets':['business-integration','asset-and-networks']},
 mastercard:{'mint-and-redeem-ousd':['wholesale-access','confirm-product-access'],'convert-ousd':['other-integration-paths']},
 privy:{'create-wallets':['choose-custody','custodial-access'],'send-payouts':['transfer-lifecycle']},
};
export function capabilityActivityAnchor(c:(typeof capabilities)[number]){
 return handbookTasks.find(t=>c.tasks.includes(t.id))?.slug||(c.tasks.includes('development')?'testing-integrations':'accessing-apis');
}
