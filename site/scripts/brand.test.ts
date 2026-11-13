import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=(path:string)=>fs.readFileSync(path,'utf8');

test('supplied brand lockups stay outlined, theme-aware and locally hosted',()=>{
  const light=read('src/assets/logo-light.svg');
  const dark=read('src/assets/logo-dark.svg');
  for(const svg of [light,dark]){
    assert.match(svg,/viewBox="0 0 460\.418 96"/);
    assert.doesNotMatch(svg,/<(?:text|script|foreignObject)\b|\bon[a-z]+\s*=|\b(?:href|src)=/i);
    assert.match(svg,/<path\b/);
  }
  assert.match(light,/#0055FF/);assert.match(light,/#778399/);
  assert.match(dark,/#4C85FF/);assert.match(dark,/#A1AEC2/);
  assert.match(read('astro.config.mjs'),/alt: '', replacesTitle: true/);
  const footer=read('src/components/overrides/Footer.astro');
  assert.match(footer,/aria-label="openusd\.dev home"/);
  assert.equal((footer.match(/alt=""/g)||[]).length,2);
  assert.match(footer,/light:sl-hidden/);assert.match(footer,/dark:sl-hidden/);
});

test('favicon and browser manifest use supplied local assets without a service worker',()=>{
  const favicon=read('public/favicon.svg');
  assert.match(favicon,/prefers-color-scheme:\s*dark/);
  assert.doesNotMatch(favicon,/<script|\b(?:href|src)=/i);
  const ico=fs.readFileSync('public/favicon.ico');
  assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
  const manifest=JSON.parse(read('public/site.webmanifest'));
  assert.equal(manifest.display,'browser');assert.equal(manifest.start_url,'/');
  assert.equal(manifest.icons.length,4);
  for(const icon of manifest.icons){
    assert.match(icon.src,/^\/icons\/[a-z0-9-]+\.png$/);
    const png=fs.readFileSync('public'+icon.src);
    const [width,height]=icon.sizes.split('x').map(Number);
    assert.equal(png.readUInt32BE(16),width);assert.equal(png.readUInt32BE(20),height);
    assert.ok(['any','maskable'].includes(icon.purpose));
  }
  const touch=fs.readFileSync('public/apple-touch-icon.png');
  assert.equal(touch.readUInt32BE(16),180);assert.equal(touch.readUInt32BE(20),180);
  assert.doesNotMatch(read('astro.config.mjs'),/serviceWorker|service-worker/);
});

test('supplied social card keeps the stable URL and explicit image metadata',()=>{
  const png=fs.readFileSync('public/social.png');
  assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
  assert.ok(png.length<60000,'social card stays below 60 kB');
  const metadata=read('src/routeData.ts');
  for(const property of ['og:image','og:image:type','og:image:width','og:image:height','og:image:alt'])assert.ok(metadata.includes(`property:'${property}'`));
  for(const name of ['twitter:image','twitter:image:alt'])assert.ok(metadata.includes(`name:'${name}'`));
  assert.equal((metadata.match(/site\.origin\+'\/social\.png'/g)||[]).length,2);
});
