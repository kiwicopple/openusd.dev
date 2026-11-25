import {defineRouteMiddleware} from '@astrojs/starlight/route-data';
import {site} from './config';
import {dataset} from './lib/registry';
export const onRequest=defineRouteMiddleware(({locals,url})=>{
 const route=locals.starlightRoute;
 const utility=['/search/','/status/','/guides/','/contribute/','/404','/404/','/404.html'].includes(url.pathname);
 const retired:Record<string,string>={'/status/':'/ecosystem/','/guides/':'/guides/what-is-open-usd/','/contribute/':'/about/'};
 const canonical=site.origin+(retired[url.pathname]??url.pathname);
 // Centralize metadata through Starlight route data; retain its default Head component.
 route.head=route.head.filter(h=>{
  if(h.tag==='link'&&h.attrs?.rel==='canonical')return false;
  if(h.tag!=='meta')return true;
  const name=String(h.attrs?.name??'');const property=String(h.attrs?.property??'');
  return name!=='robots'&&!/^twitter:(card|image)(:|$)/.test(name)&&property!=='og:url'&&!/^og:image(:|$)/.test(property);
 });
 route.head.push({tag:'meta',attrs:{name:'robots',content:site.indexing&&!utility?'index,follow':'noindex,follow'}},{tag:'link',attrs:{rel:'canonical',href:canonical}},{tag:'meta',attrs:{property:'og:url',content:canonical}},
 {tag:'meta',attrs:{property:'og:image',content:site.origin+'/social.png'}},
 {tag:'meta',attrs:{property:'og:image:type',content:'image/png'}},
 {tag:'meta',attrs:{property:'og:image:width',content:'1200'}},
 {tag:'meta',attrs:{property:'og:image:height',content:'630'}},
 {tag:'meta',attrs:{property:'og:image:alt',content:'openusd.dev — Open USD for developers. Payments, payouts, wallets and balances.'}},
 {tag:'meta',attrs:{name:'twitter:card',content:'summary_large_image'}},
 {tag:'meta',attrs:{name:'twitter:image',content:site.origin+'/social.png'}},
 {tag:'meta',attrs:{name:'twitter:image:alt',content:'openusd.dev — Open USD for developers. Payments, payouts, wallets and balances.'}});
 const publisher={'@type':'Person',name:site.ownerName,url:site.origin+'/about/'};
 const structured=url.pathname==='/data/'?{
 '@context':'https://schema.org','@type':'Dataset',name:'OUSD providers and networks',url:canonical,description:dataset.description,version:dataset.schemaVersion,dateModified:dataset.modifiedAt,creator:publisher,publisher,license:dataset.license?.url,isAccessibleForFree:true,
 distribution:{'@type':'DataDownload',contentUrl:site.origin+'/data/ecosystem.json',encodingFormat:'application/json'},isBasedOn:[...new Set(dataset.capabilities.flatMap(c=>c.sources.map(s=>s.url)))]
 }:url.pathname==='/'?{'@context':'https://schema.org','@type':'WebSite',name:site.title,alternateName:site.alternateName,url:site.origin+'/',description:site.description,publisher}:null;
 if(structured)route.head.push({tag:'script',attrs:{type:'application/ld+json'},content:JSON.stringify(structured).replace(/</g,'\\u003c')});
});
