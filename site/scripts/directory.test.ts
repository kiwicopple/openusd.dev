import {test} from 'node:test';import assert from 'node:assert/strict';
import {matchesDirectory,directoryFiltersFromUrl,directoryFilterUrl} from '../src/lib/directory-filter';
import {directoryActivities,directoryUtilities,directoryTaskLabels,directoryAccessLabels,directoryTagReference,activityStatusGroups} from '../src/lib/directory';
import {capabilities,networks,dataset} from '../src/lib/registry';
import {ExportCapabilitySchema,DatasetSchema} from '../src/lib/schema';
const f={task:'',provider:'',access:'',network:'',includeUnknown:true};
const activity={task:'send-payouts',provider:'stripe',records:[{access:'onboarding_required',networks:['Base']},{access:'restricted_beta',networks:null}]};
test('task, provider, access and network filters intersect within one product path',()=>{
 assert.equal(matchesDirectory(activity,f),true);
 assert.equal(matchesDirectory(activity,{...f,task:'send-payouts',provider:'stripe',access:'restricted_beta'}),true);
 assert.equal(matchesDirectory(activity,{...f,provider:'bridge'}),false);
 assert.equal(matchesDirectory(activity,{...f,task:'issue-cards'}),false);
 assert.equal(matchesDirectory(activity,{...f,network:'Base',includeUnknown:false}),true);
 assert.equal(matchesDirectory(activity,{...f,access:'restricted_beta',network:'Base',includeUnknown:false}),false);
 assert.equal(matchesDirectory(activity,{...f,access:'restricted_beta',network:'Base'}),true);
 assert.equal(matchesDirectory(activity,{...f,access:'onboarding_required',network:'Solana'}),false);
 assert.equal(matchesDirectory(activity,{...f,network:'unknown',includeUnknown:false}),true);
 assert.equal(matchesDirectory({...activity,records:[{access:'onboarding_required',networks:['Base']}]},{...f,network:'unknown'}),false);
});
test('shared filter URLs round-trip; retired query never filters or survives an edit',()=>{
 const url=new URL('https://openusd.dev/ecosystem/?q=wallet&task=send-payouts&provider=stripe&access=restricted_beta&network=Base&includeUnknown=false&utm_source=guide#networks');
 const filters=directoryFiltersFromUrl(url);
 assert.deepEqual(filters,{...f,task:'send-payouts',provider:'stripe',access:'restricted_beta',network:'Base',includeUnknown:false});
 const next=directoryFilterUrl(url,filters);
 assert.equal(next.searchParams.has('q'),false);
 assert.equal(next.searchParams.get('utm_source'),'guide');
 assert.equal(next.hash,'#networks');
 assert.deepEqual(directoryFiltersFromUrl(next),filters);
 const reset=directoryFilterUrl(next,f);
 assert.deepEqual(directoryFiltersFromUrl(reset),f);
 for(const key of ['task','provider','access','network','includeUnknown'])assert.equal(reset.searchParams.has(key),false);
});
test('35 unique task/provider cards reuse exact profile descriptions and anchors',()=>{
 assert.equal(directoryActivities.length,35);
 assert.equal(new Set(directoryActivities.map(a=>a.id)).size,35);
 for(const a of directoryActivities){
  assert.equal(a.description,a.provider.profile?.sections.find(s=>s.id===a.task.slug)?.paragraphs[0].text);
  assert.equal(a.href,`/providers/${a.provider.id}/#${a.task.slug}`);
  assert.ok(a.records.every(c=>c.providerId===a.provider.id&&c.tasks.includes(a.task.id)));
 }
 assert.equal(Object.keys(directoryTaskLabels).length,8);
 assert.deepEqual(directoryUtilities.map(c=>c.id).sort(),['bridge-general-sandbox','visa-ousd-api']);
 const aliases=[...directoryActivities.flatMap(a=>a.legacyIds),...directoryUtilities.map(c=>c.id)];
 assert.equal(new Set(aliases).size,capabilities.length);
 assert.deepEqual([...aliases].sort(),capabilities.map(c=>c.id).sort());
});
test('access and OUSD evidence remain separate, including mixed-product activities',()=>{
 const stripe=directoryActivities.find(a=>a.id==='stripe-send-payouts')!;
 const groups=activityStatusGroups(stripe.records);
 assert.equal(groups.length,2);
 assert.ok(groups.some(g=>g.access.label==='Limited beta'&&g.support.label==='OUSD unconfirmed'&&g.records[0].id==='stripe-connect-payouts'));
 assert.ok(groups.some(g=>g.access.label==='Onboarding'&&g.support.label==='OUSD documented'&&g.records[0].id==='stripe-ousd-payouts'));
 const checkout=activityStatusGroups(directoryActivities.find(a=>a.id==='stripe-accept-payments')!.records)[0];
 assert.equal(checkout.access.label,'Access unconfirmed');assert.equal(checkout.support.label,'OUSD unconfirmed');
 assert.equal(activityStatusGroups(directoryActivities.find(a=>a.id==='mastercard-send-payouts')!.records)[0].support.label,'OUSD listed');
});
test('real directory supports combined filters, empty results, reset and explicit network limits',()=>{
 const matching=(filter:typeof f)=>directoryActivities.filter(a=>matchesDirectory({task:a.task.id,provider:a.provider.id,records:a.records},filter));
 assert.equal(matching(f).length,35);
 assert.equal(matching({...f,task:'send-payouts'}).length,6);
 assert.equal(matching({...f,provider:'stripe'}).length,6);
 assert.equal(matching({...f,provider:'visa',task:'issue-cards'}).length,0);
 assert.equal(matching({...f,provider:'stripe',task:'send-payouts',access:'restricted_beta'}).length,1);
 assert.equal(matching({...f,provider:'stripe',task:'send-payouts',network:'Tempo',includeUnknown:false}).length,0);
 assert.ok(matching({...f,network:'Base',includeUnknown:false}).every(a=>a.provider.id==='bridge'));
 assert.equal(matching({...f,network:'Tempo',includeUnknown:false}).length,9);
});
test('published product IDs and network anchors stay stable',()=>{
 const ids=['visa-ousd-portal','visa-ousd-api','stripe-ousd-adoption','bridge-ousd-support','bridge-general-sandbox','tempo-native-ousd','solana-native-ousd','base-native-ousd','ethereum-native-ousd','stripe-ousd-management','coinbase-ousd-access','mastercard-ousd-access','privy-ousd-wallets'];
 for(const id of ids)assert.ok(capabilities.some(n=>n.id===id)||networks.some(n=>n.legacyRecordId===id),id);
});
test('export rejects invented testing and preserves review semantics with scoped CC0 reuse',()=>{
 assert.equal(ExportCapabilitySchema.safeParse({...dataset.capabilities[0],verification:'tested'}).success,false);
 assert.equal(DatasetSchema.safeParse(dataset).success,true);
 assert.ok(!('rights' in dataset));
 assert.equal(dataset.license?.identifier,'CC0-1.0');
 assert.equal(dataset.reviewCoverage.recordCount,dataset.providers.length+dataset.capabilities.length+dataset.networks.length);
 assert.ok(!('lastReviewedAt' in dataset));
});

import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {directoryFilterKeys} from '../src/lib/directory-filter';
test('directory controller handles changes, reset focus, URL history and invalid shared values',()=>{
 const listeners=new Map<string,()=>void>();const windowListeners=new Map<string,()=>void>();
 const controls=Object.fromEntries(directoryFilterKeys.map(key=>[key,{value:'',options:[{value:''},...[...new Set(directoryActivities.flatMap(a=>key==='task'?[a.task.id]:key==='provider'?[a.provider.id]:key==='access'?a.records.map(c=>c.access):a.records.flatMap(c=>c.networks||['unknown'])))].map(value=>({value}))],focus(){focused=key;}}]));
 let focused='';const checkbox={checked:true};
 type Element={id:string;hidden:boolean;dataset:{activity:string};prepend:(anchor:Anchor)=>void};
 type Anchor={id:string;parentElement:Element;scrollIntoView:()=>void};let scrolled='';
 const elements:Element[]=directoryActivities.map(a=>({id:a.id,hidden:false,dataset:{activity:JSON.stringify({task:a.task.id,provider:a.provider.id,records:a.records.map(c=>({id:c.id,access:c.access,networks:c.networks}))})},prepend(anchor:Anchor){anchor.parentElement=this;}}));
 const anchors:Anchor[]=directoryActivities.flatMap((a,index)=>a.legacyIds.map(id=>({id,parentElement:elements[index],scrollIntoView:()=>{scrolled=id;}})));
 const result={textContent:''};const empty={hidden:true};const location={href:'https://openusd.dev/ecosystem/?q=retired&task=send-payouts&provider=stripe',get hash(){return new URL(this.href).hash;}};
 const form={elements:{namedItem:(key:string)=>key==='includeUnknown'?checkbox:controls[key]},addEventListener:(event:string,fn:()=>void)=>listeners.set(event,fn),reset:()=>{for(const c of Object.values(controls))c.value='';checkbox.checked=true;}};
 const reset={addEventListener:(_event:string,fn:()=>void)=>listeners.set('reset',fn)};
 const document={querySelector:(selector:string)=>({'#filters':form,'#result-count':result,'#empty':empty,'#reset':reset}[selector]),querySelectorAll:(selector:string)=>selector==='[data-capability-anchor]'?anchors:elements};
 const history={pushState:(_state:unknown,_unused:string,url:URL)=>{location.href=url.href;}};
 const source=fs.readFileSync('src/components/EcosystemDirectory.astro','utf8').split('<script>')[1].split('</script>')[0].replace(/^import .*;$/m,'');
 const context={document,history,location,window:{addEventListener:(event:string,fn:()=>void)=>windowListeners.set(event,fn)},URL,matchesDirectory,directoryFiltersFromUrl,directoryFilterUrl,directoryFilterKeys};
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,context);
 assert.equal(result.textContent,'Showing 1 of 35 activities');
 assert.equal(elements.filter(e=>!e.hidden).length,1);
 controls.provider.value='visa';controls.task.value='issue-cards';listeners.get('change')!();
 assert.equal(result.textContent,'Showing 0 of 35 activities');assert.equal(empty.hidden,false);
 assert.equal(new URL(location.href).searchParams.has('q'),false);
 listeners.get('reset')!();assert.equal(focused,'task');assert.equal(result.textContent,'Showing 35 of 35 activities');assert.equal(empty.hidden,true);
 assert.equal(new URL(location.href).search,'');
 location.href='https://openusd.dev/ecosystem/?task=send-payouts&provider=stripe&access=restricted_beta';windowListeners.get('popstate')!();
 assert.equal(controls.provider.value,'stripe');assert.equal(result.textContent,'Showing 1 of 35 activities');
 location.href='https://openusd.dev/ecosystem/?task=removed-task&provider=unknown-provider&network=unsupported-network';windowListeners.get('popstate')!();
 assert.equal(result.textContent,'Showing 35 of 35 activities');
 location.href='https://openusd.dev/ecosystem/?task=create-wallets&provider=bridge#bridge-ousd-wallets';windowListeners.get('popstate')!();
 const legacy=anchors.find(a=>a.id==='bridge-ousd-wallets')!;
 assert.equal(result.textContent,'Showing 1 of 35 activities');assert.equal(legacy.parentElement.id,'bridge-create-wallets');assert.equal(legacy.parentElement.hidden,false);assert.equal(scrolled,'bridge-ousd-wallets');
 listeners.get('reset')!();assert.equal(legacy.parentElement.id,'bridge-hold-ousd');assert.equal(legacy.parentElement.hidden,false);
 assert.equal(new URL(location.href).hash,'#bridge-ousd-wallets');
 scrolled='';windowListeners.get('hashchange')!();assert.equal(scrolled,'bridge-ousd-wallets');
});

import {tagsForRecord,tagReferenceFor} from '../src/lib/directory-tags';
test('every directory tag has one exact definition without changing registry semantics',()=>{
 assert.equal(directoryTagReference.length,6);
 assert.equal(new Set(directoryTagReference.map(tag=>tag.id)).size,6);
 for(const activity of directoryActivities){
  for(const group of activityStatusGroups(activity.records)){
   for(const tag of [group.access,group.support])assert.ok(directoryTagReference.includes(tag));
   for(const record of group.records){
    assert.deepEqual(tagsForRecord(record),{access:group.access,support:group.support});
    assert.equal(directoryAccessLabels[record.access],group.access.label);
   }
  }
 }
 assert.equal(tagsForRecord({access:'onboarding_required',ousdSupport:'generic'}).support.label,'OUSD unconfirmed');
 assert.equal(tagsForRecord({access:'restricted_beta'}).support.label,'OUSD unconfirmed');
 assert.notEqual(tagsForRecord({access:'onboarding_required',ousdSupport:'listed'}).support.id,tagsForRecord({access:'onboarding_required',ousdSupport:'documented'}).support.id);
 assert.match(directoryTagReference.find(tag=>tag.id==='tag-ousd-unconfirmed')!.definition,/General platform documentation is not confirmation/);
 assert.match(directoryTagReference.find(tag=>tag.id==='tag-ousd-listed')!.definition,/Product-level OUSD support.*still need confirmation/);
 assert.equal(tagReferenceFor(capabilities).some(tag=>tag.label==='Announced'),true);
});
test('directory tags use native anchors and a bottom table with stable targets',()=>{
 const source=fs.readFileSync('src/components/EcosystemDirectory.astro','utf8');
 assert.match(source,/<a class="directory-tag" href=\{`#\$\{tag.id\}`\}/);
 assert.match(source,/<tr id=\{tag.id\} tabindex="-1"><th scope="row">\{tag.label\}<\/th><td>\{tag.definition\}<\/td>/);
 assert.match(source,/<h2 id="tag-reference">Tag reference<\/h2>/);
 assert.match(source,/id="availability" class="anchor-alias"/);
 assert.ok(source.indexOf('id="tag-reference"')>source.indexOf('id="networks"'));
 assert.doesNotMatch(source,/Understanding the tags|<Badge|onClick|onclick/);
 const css=fs.readFileSync('src/styles/directory.css','utf8');
 assert.match(css,/\.ecosystem-browser \.directory-tag \{[^}]*color:var\(--ousd-tag-text\); background:var\(--ousd-tag-bg\)/);
 assert.match(css,/\.tag-reference tr \{ scroll-margin-top:6rem; \}/);
 assert.match(css,/\.tag-reference tr:target/);
});
