import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {source} from '../src/lib/registry';

const tasks=['hold-ousd','send-payouts','issue-cards','mint-and-redeem-ousd','create-wallets','convert-ousd','custody-ousd','accept-payments'];
const config=fs.readFileSync('astro.config.mjs','utf8');
const chooser=fs.readFileSync('src/content/docs/start.mdx','utf8');

test('each integration goal has one discoverable Markdown guide',()=>{
  for(const task of tasks){
    const text=fs.readFileSync(`src/content/docs/guides/${task}.md`,'utf8');
    assert.ok(text.startsWith('---\n'));
    assert.match(text,/draft: false/);
    assert.ok(config.includes(`slug: 'guides/${task}'`),task+' in Handbook');
    assert.ok(chooser.includes(`/guides/${task}/`),task+' in chooser');
    assert.ok(text.includes('/ecosystem/'),task+' links provider directory');
    assert.ok(text.includes('/guides/integration-architecture/'),task+' reuses shared processing guide');
    assert.ok(text.includes('/guides/concepts/#'),task+' uses exact concept anchors');
    assert.ok(text.includes('No live integration independently tested.'),task+' preserves testing limit');
    const frontmatter=text.split('---')[1];
    for(const match of frontmatter.matchAll(/- id: ([\w-]+)/g))assert.ok(source(match[1]),task+' source '+match[1]);
    const related=frontmatter.match(/related: \[(.*?)\]/)?.[1].split(',').map(s=>s.trim())||[];
    for(const id of related)assert.ok(['md','mdx'].some(ext=>fs.existsSync(`src/content/docs/guides/${id}.${ext}`)),task+' related '+id);
  }
});

test('Handbook orders foundations before the chooser and all task guides',()=>{
  const intro=config.indexOf("slug: 'guides/what-is-open-usd'");
  const concepts=config.indexOf("slug: 'guides/concepts'");
  const chooserIndex=config.indexOf("link: '/start/'");
  const taskPositions=tasks.map(task=>config.indexOf(`slug: 'guides/${task}'`));
  assert.ok(intro<concepts && concepts<chooserIndex);
  for(const position of taskPositions)assert.ok(position>chooserIndex);
  assert.ok(Math.max(...taskPositions)<config.indexOf("slug: 'guides/integration-architecture'"));
});

test('existing chooser section links and shared architecture URL remain',()=>{
  assert.ok(chooser.includes('## Choose a path'));
  for(const id of ['before-writing-the-integration','test-the-application'])assert.ok(chooser.includes(`id="${id}"`));
  assert.ok(fs.existsSync('src/content/docs/guides/integration-architecture.mdx'));
});

const activityTitles = {
  'hold-ousd': 'Holding OUSD',
  'send-payouts': 'Sending payouts from OUSD',
  'issue-cards': 'Issuing OUSD-funded cards',
  'mint-and-redeem-ousd': 'Minting and redeeming OUSD',
  'create-wallets': 'Creating OUSD wallets',
  'convert-ousd': 'Converting OUSD',
  'custody-ousd': 'Managing OUSD custody',
  'accept-payments': 'Accepting OUSD payments',
};

test('task titles use the same activity-based labels in frontmatter and chooser links',()=>{
  assert.ok(chooser.includes('title: "Integrating OUSD"'));
  assert.ok(config.includes("{ label: 'Integrating OUSD', link: '/start/' }"));
  for(const [task,title] of Object.entries(activityTitles)){
    const text=fs.readFileSync(`src/content/docs/guides/${task}.md`,'utf8');
    assert.ok(text.includes(`title: "${title}"`),task+' title');
    assert.ok(chooser.includes(`[${title}](/guides/${task}/)`),task+' chooser title');
  }
});
