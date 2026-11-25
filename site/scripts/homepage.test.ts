import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {handbookTasks,updates} from '../src/lib/registry';

const home=fs.readFileSync('src/content/docs/index.mdx','utf8');
const component=fs.readFileSync('src/components/Updates.astro','utf8');

test('homepage retains the large standard Starlight hero',()=>{
  assert.match(home,/template: splash/);
  assert.match(home,/hero:\n  title: Open USD for developers/);
  assert.doesNotMatch(home,/<style|hero:\n[\s\S]*?image:/);
  const hero=home.split('hero:\n')[1].split('\n---')[0];
  assert.match(hero,/Open USD \(OUSD\) is a dollar stablecoin created by Open Standard\./);
  assert.match(hero,/openusd\.dev provides independent guides for building payments, payouts, wallets and balances\./);
  assert.doesNotMatch(hero,/<a\b|actions:|link:/);
});

test('homepage leads with four canonical task guides and the newcomer path',()=>{
  const cards=[...home.matchAll(/<LinkCard title="([^"]+)"[^>]*href="([^"]+)"/g)];
  const expected=['accept-payments','send-payouts','create-wallets','hold-ousd'];
  assert.deepEqual(cards.map(m=>m[2]),expected.map(slug=>`/guides/${slug}/`));
  for(const card of cards){
    const task=handbookTasks.find(task=>`/guides/${task.slug}/`===card[2]);
    assert.equal(card[1],task?.title);
  }
  for(const route of ['/guides/what-is-open-usd/','/guides/concepts/','/start/','/ecosystem/','/networks/','/guides/open-usd-vs-usdc/'])assert.ok(home.includes(route));
  assert.match(home,/Check OUSD checkout support/);
  assert.ok(home.indexOf('## Integration references')>home.indexOf('</CardGrid>'));
});

test('homepage compact updates use the registry and preserve changelog anchors',()=>{
  assert.match(home,/## Latest ecosystem updates/);
  assert.match(home,/<Updates limit=\{2\} type="ecosystem" compact \/>/);
  assert.match(home,/id="changelog"/);
  assert.match(component,/href=\{`\/changelog\/#\$\{u.id\}`\}/);
  assert.match(component,/id=\{u.id\}/);
  const latest=updates.filter(update=>update.type==='ecosystem').slice(0,2);
  assert.equal(latest.length,2);
  assert.ok(latest.every(update=>!update.draft));
});
