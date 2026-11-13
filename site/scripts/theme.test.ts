import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const theme=fs.readFileSync('src/styles/theme.css','utf8');
const cards=theme.split('/* Square cards')[1].split('site-search button')[0];

test('card corners are square CSS decorations without assets or layout changes',()=>{
  assert.match(cards,/\.sl-link-card, \.provider-card \{\s*position: relative;\s*border-radius: 0;/);
  assert.match(cards,/\.sl-link-card::after, \.provider-card::after \{[\s\S]*?content: '';[\s\S]*?position: absolute;[\s\S]*?inset: -1px;[\s\S]*?pointer-events: none;/);
  assert.equal((cards.match(/linear-gradient\(currentColor, currentColor\)/g)||[]).length,8);
  assert.doesNotMatch(cards,/url\(|border-width:|transform:|scale:|translate:/);
});

test('cards get the same blue accent on fine-pointer hover and keyboard focus',()=>{
  for(const state of ['hover','focus-within']){
    const rule=new RegExp(`\\.sl-link-card:${state}, \\.provider-card:${state} \\{([^}]+)\\}`);
    const body=cards.match(rule)?.[1]??'';
    assert.match(body,/border-color: var\(--sl-color-text-accent\);/);
    assert.match(body,/--ousd-card-tick: var\(--sl-color-text-accent\);/);
  }
  assert.match(cards,/@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(cards,/@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition: none;/);
});

test('form fields and buttons share square corners without changing control states',()=>{
  assert.match(theme,/--ousd-radius: 0;/);
  const controls=theme.split('/* Match the square cards')[1].split('.filters')[0];
  assert.match(controls,/button, \.button, \.sl-link-button, \[role='button'\], summary/);
  assert.match(controls,/mobile-starlight-toc \.toggle/);
  assert.match(controls,/:root \.expressive-code \.copy button/);
  assert.match(controls,/input:not\(:where\(\[type='checkbox'\], \[type='radio'\], \[type='range'\]\)\)/);
  assert.match(controls,/select, textarea, input::file-selector-button/);
  assert.match(controls,/\{\s*border-radius: var\(--ousd-radius\);\s*\}/);
  assert.doesNotMatch(controls,/appearance:|outline:|opacity:|pointer-events:|background:|border-color:/);
  assert.match(theme,/#starlight__search \{ --sl-search-corners: var\(--ousd-radius\); \}/);
  assert.match(theme,/\.filters \[data-slot='input'\]:focus-visible,[\s\S]*?outline: 2px solid var\(--sl-color-text-accent\);/);
});
