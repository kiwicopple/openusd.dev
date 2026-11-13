import {test} from 'node:test';
import assert from 'node:assert/strict';
import {capabilities,networks,providers,source} from '../src/lib/registry';
import {directoryActivities} from '../src/lib/directory';

const sectionText=(providerId:string,sectionId:string)=>providers.find(p=>p.id===providerId)!.profile!.sections.find(s=>s.id===sectionId)!.paragraphs.map(p=>p.text).join(' ');

test('BVNK launch is represented without treating conflicting networks or eligibility as verified',()=>{
 const c=capabilities.find(c=>c.id==='bvnk-ousd-access')!;
 assert.equal(c.networks,null);
 assert.equal(c.availability,'unknown');
 assert.equal(c.verification,'not_tested');
 assert.deepEqual(c.sources.map(s=>s.sourceId),['bvnk-ousd-launch','bvnk-currencies']);
 assert.deepEqual(c.tasks,['hold-funds','send-payouts','mint-redeem','create-wallets','convert']);
 assert.equal(directoryActivities.filter(a=>a.provider.id==='bvnk').length,5);
 assert.match(sectionText('bvnk','access-and-networks'),/outside the EEA.*US eligibility.*Plasma.*Tempo forthcoming/);
 assert.match(sectionText('bvnk','access-and-networks'),/does not establish a Plasma deployment or OUSD sandbox/);
 assert.equal(networks.some(n=>n.name==='Plasma'),false);
});

test('Bridge RTP change is upcoming response compatibility, not an OUSD request rail',()=>{
 const text=sectionText('bridge','hold-ousd');
 assert.match(text,/November 16, 2026/);
 for(const field of ['payment_received_rail','payment_rail','fednow'])assert.ok(text.includes(field));
 assert.match(text,/rtp is a response value, not a request rail/);
 assert.match(text,/does not establish an additional OUSD route/);
});

test('Stripe setup and payout API updates preserve OUSD route uncertainty',()=>{
 assert.match(sectionText('stripe','hold-ousd'),/Linked accounts and payouts → Settlement and transfer rules/);
 assert.match(sectionText('stripe','send-payouts'),/UK cross-border payouts require Payout Intents/);
 assert.match(sectionText('stripe','send-payouts'),/do not independently establish an OUSD funding route/);
 assert.equal(source('stripe-transfer-send').url,'https://docs.stripe.com/treasury/transfer');
});

test('Base pending tag guidance follows the current canonical-block reference',()=>{
 const text=networks.find(n=>n.id==='base')!.profile!.sections.find(s=>s.id==='tools-and-confirmation')!.paragraphs.map(p=>p.text).join(' ');
 assert.match(text,/pending block tag now resolves to the latest canonical block/);
 assert.match(text,/Do not treat either as safe or finalized/);
 assert.doesNotMatch(text,/pre-confirmed Flashblock/);
});
