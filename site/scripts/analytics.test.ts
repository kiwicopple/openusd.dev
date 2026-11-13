import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('public/analytics.js', 'utf8');
const key = 'openusd-analytics-consent-v1';
const id = 'G-TEST123';
function harness(options: { hostname?: string; saved?: string; storageFails?: boolean } = {}) {
  const listeners = new Map<string, (event?: any) => void>();
  const controls = Object.fromEntries(['analytics-consent', 'analytics-settings', 'analytics-accept', 'analytics-decline', 'analytics-close', 'analytics-consent-status'].map(name => [name, {
    hidden: true, textContent: '', attrs: {} as Record<string, string>, focused: false,
    addEventListener(event: string, fn: (event?: any) => void) { listeners.set(name + ':' + event, fn); },
    setAttribute(name: string, value: string) { this.attrs[name] = value; },
    focus() { this.focused = true; },
  }]));
  const saved = new Map(options.saved ? [[key, options.saved]] : []);
  const tags: any[] = [];
  const cookieWrites: string[] = [];
  let reloads = 0;
  const window: any = { addEventListener(event: string, fn: (event?: any) => void) { listeners.set('window:' + event, fn); } };
  const document = {
    currentScript: { dataset: { measurementId: id } },
    referrer: 'https://example.com/private/path?email=test@example.com#secret',
    getElementById(name: string) { return controls[name]; },
    createElement() { return {}; },
    head: { appendChild(tag: any) { tags.push(tag); } },
    get cookie() { return '_ga=old; _ga_TEST123=session; starlight=preserve'; },
    set cookie(value: string) { cookieWrites.push(value); },
  };
  const location = { hostname: options.hostname || 'openusd.dev', origin: 'https://openusd.dev', pathname: '/guides/concepts/', search: '?q=private', hash: '#secret', reload() { reloads++; } };
  const localStorage = { getItem(name: string) { if (options.storageFails) throw new Error('blocked'); return saved.get(name) || null; }, setItem(name: string, value: string) { if (options.storageFails) throw new Error('blocked'); saved.set(name, value); } };
  vm.runInNewContext(source, { window, document, location, localStorage, Date, URL, Number, JSON, encodeURIComponent });
  return { controls, saved, tags, window, cookieWrites, reloads: () => reloads, click: (name: string) => listeners.get(name + ':click')!(), event: (name: string, event: any) => listeners.get(name)!(event) };
}
const stored = (choice: string, expires = Date.now() + 60_000) => JSON.stringify({ choice, expires });

test('analytics makes no Google script or dataLayer before consent, and decline stays off', () => {
  const h = harness();
  assert.equal(h.tags.length, 0);
  assert.equal(h.window.dataLayer, undefined);
  assert.equal(h.controls['analytics-consent'].hidden, false);
  h.click('analytics-decline');
  assert.equal(h.tags.length, 0);
  assert.equal(h.window.dataLayer, undefined);
  assert.equal(h.controls['analytics-consent'].hidden, true);
  assert.equal(JSON.parse(h.saved.get(key)!).choice, 'denied');
  assert.equal(h.reloads(), 0);
});

test('accept loads one tag with limited, sanitized measurement and no advertising consent', () => {
  const h = harness();
  h.click('analytics-accept'); h.click('analytics-accept');
  assert.equal(h.tags.length, 1);
  assert.equal(h.tags[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123');
  const commands = h.window.dataLayer.map((item: any) => Array.from(item));
  assert.equal(commands.length, 4);
  assert.equal(commands[0][2].ad_storage, 'denied');
  assert.equal(commands[0][2].ad_user_data, 'denied');
  assert.equal(commands[0][2].ad_personalization, 'denied');
  assert.deepEqual(Object.keys(commands[1][2]), ['analytics_storage']);
  const config = commands[3][2];
  assert.equal(config.page_location, 'https://openusd.dev/guides/concepts/');
  assert.equal(config.page_referrer, 'https://example.com/');
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.cookie_expires, 180 * 24 * 60 * 60);
  assert.equal(config.cookie_update, false);
});

test('saved choices persist, expire safely and tolerate invalid or blocked storage', () => {
  assert.equal(harness({ saved: stored('granted') }).tags.length, 1);
  assert.equal(harness({ saved: stored('denied') }).tags.length, 0);
  for (const saved of [stored('granted', 1), '{bad', stored('invalid')]) {
    const h = harness({ saved });
    assert.equal(h.tags.length, 0);
    assert.equal(h.controls['analytics-consent'].hidden, false);
  }
  const h = harness({ storageFails: true });
  assert.equal(h.tags.length, 0);
  h.click('analytics-accept');
  assert.equal(h.tags.length, 1);
});

test('settings support dismissal, withdrawal and cross-tab opt-out', () => {
  const h = harness({ saved: stored('granted') });
  h.click('analytics-settings');
  assert.equal(h.controls['analytics-decline'].focused, true);
  assert.equal(h.controls['analytics-consent'].hidden, false);
  h.event('analytics-consent:keydown', { key: 'Escape' });
  assert.equal(h.controls['analytics-consent'].hidden, true);
  h.click('analytics-settings'); h.click('analytics-decline');
  assert.equal(h.window['ga-disable-' + id], true);
  assert.equal(h.reloads(), 1);
  assert.ok(h.cookieWrites.some(cookie => cookie.startsWith('_ga=; Max-Age=0')));
  assert.ok(h.cookieWrites.every(cookie => !cookie.startsWith('starlight')));
  const other = harness({ saved: stored('granted') });
  other.saved.set(key, stored('denied'));
  other.event('window:storage', { key });
  assert.equal(other.window['ga-disable-' + id], true);
  assert.equal(other.reloads(), 1);
});

test('preview domains never initialize Google Analytics or show the consent banner', () => {
  const h = harness({ hostname: 'localhost', saved: stored('granted') });
  assert.equal(h.tags.length, 0);
  assert.equal(h.controls['analytics-settings'].hidden, true);
});
