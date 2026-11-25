import {site} from '../config';
// Preserve the original discovery URL while Starlight generates the sitemap.
export function GET(){return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${site.origin}/sitemap-0.xml</loc></sitemap></sitemapindex>`,{headers:{'Content-Type':'application/xml'}});}
