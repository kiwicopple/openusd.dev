import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Check rendered links, not source spellings: shared components and Markdown both count.
export function inspectNavigation(html, pageUrl, directoryRoutes) {
  const errors = [];
  const origin = new URL(pageUrl).origin;
  const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  for (const match of markup.matchAll(/<a\b[^>]*?\shref\s*=\s*(["'])(.*?)\1/gi)) {
    const href = match[2].replace(/&(?:amp|quot|apos|#39|#x[\da-f]+|#\d+);/gi, entity => {
      const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&#39;': "'" };
      return named[entity] ?? String.fromCodePoint(parseInt(entity.slice(entity[2].toLowerCase() === 'x' ? 3 : 2, -1), entity[2].toLowerCase() === 'x' ? 16 : 10));
    });
    let url;
    try { url = new URL(href, pageUrl); } catch { errors.push(`Invalid link: ${href}`); continue; }
    if (url.origin !== origin) continue;
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { errors.push(`Invalid path encoding: ${href}`); continue; }
    const canonical = pathname.endsWith('/index.html') ? pathname.slice(0, -10) : `${pathname}/`;
    if (!pathname.endsWith('/') && directoryRoutes.has(canonical)) {
      errors.push(`${href} → use ${canonical}${url.search}${url.hash} (avoid a redirect)`);
    }
  }
  return errors;
}

export function checkNavigation(root = 'dist', origin = 'https://openusd.dev') {
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
  const files = walk(root).filter(file => file.endsWith('.html'));
  const relative = file => path.relative(root, file).split(path.sep).join('/');
  const directoryRoutes = new Set(files.filter(file => relative(file).endsWith('index.html')).map(file => `/${relative(file).slice(0, -10)}`));
  const errors = files.flatMap(file => {
    const route = `/${relative(file).replace(/index\.html$/, '')}`;
    return inspectNavigation(fs.readFileSync(file, 'utf8'), new URL(route, origin), directoryRoutes).map(error => `${relative(file)}: ${error}`);
  });
  return { pages: files.length, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const started = performance.now();
  const { pages, errors } = checkNavigation();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`PASS: direct internal navigation across ${pages} HTML pages (${Math.round(performance.now() - started)} ms; no network requests).`);
}
