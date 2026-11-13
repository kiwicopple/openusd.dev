import {site} from '../config';
export function GET(){return new Response(site.indexing?`User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap-index.xml\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain'}});}
