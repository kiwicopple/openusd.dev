import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inspectNavigation } from './check-navigation.mjs';

const routes = new Set(['/', '/guides/concepts/', '/guides/topic.v2/']);
const page = 'https://openusd.dev/guides/example/';
const check = (html: string) => inspectNavigation(html, page, routes);

test('rendered links to directory pages use their direct canonical route', () => {
  for (const href of ['/guides/concepts', '../concepts', 'https://openusd.dev/guides/concepts', '//openusd.dev/guides/concepts', '/guides/concepts/index.html', '/guides/topic.v2']) {
    assert.equal(check(`<a href="${href}">Read</a>`).length, 1, href);
  }
});

test('redirect check retains query strings, fragments and encoded paths', () => {
  assert.deepEqual(check('<a href="/guides/concepts?q=wallets&amp;mode=all#custody">Read</a>'), [
    '/guides/concepts?q=wallets&mode=all#custody → use /guides/concepts/?q=wallets&mode=all#custody (avoid a redirect)',
  ]);
  assert.equal(check("<a href='/guides/%63oncepts&#35;custody'>Read</a>").length, 1);
  assert.equal(check('<a href="/guides/%ZZ">Bad</a>').length, 1);
});

test('canonical routes, files, external links and non-navigation text are allowed', () => {
  assert.deepEqual(check(`
    <a href="/guides/concepts/#custody">Read</a><a href="/">Home</a>
    <a href="/data/ecosystem.json">Data</a><a href="/llms.txt">Index</a>
    <a href="/guides/concepts.md">Markdown</a><a href="/404.html">Error</a>
    <a href="#local">Local</a><a href="?q=test">Query</a>
    <a href="https://example.com/guides/concepts">External</a><a href="mailto:a@example.com">Mail</a>
    <a data-href="/guides/concepts">Not a link</a>
    <!-- <a href="/guides/concepts">Example</a> -->
    <script>const example = '<a href="/guides/concepts">Example</a>';</script>
  `), []);
});

test('sidebar places Comparisons after the complete Ecosystem section', () => {
  const config = fs.readFileSync('astro.config.mjs', 'utf8');
  const groups = [...config.matchAll(/^      \{ label: '([^']+)', items: \[/gm)].map(match => match[1]);
  assert.deepEqual(groups, ['Handbook', 'Ecosystem', 'Comparisons', 'About']);
});
