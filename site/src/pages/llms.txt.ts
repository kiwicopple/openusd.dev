import {getCollection} from 'astro:content';
import {providers,networks,handbookTasks} from '../lib/registry';
import {site} from '../config';

export async function GET() {
  if(!site.indexing)return new Response('# Open USD developer reference\n\nPreview build: agent exports are disabled.\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
  const origin='https://openusd.dev';
  const docs=await getCollection('docs',({data})=>!data.draft);
  const page=(id:string)=>{
    const entry=docs.find(doc=>doc.id===id);
    if(!entry)throw new Error(`Missing agent-index page: ${id}`);
    return {path:id==='index'?'':id,title:entry.data.title,description:entry.data.description||''};
  };
  const groups=[
    {title:'Concepts',pages:['guides/what-is-open-usd','guides/concepts'].map(page)},
    {title:'Tasks',pages:['start',...handbookTasks.map(task=>`guides/${task.slug}`),'guides/integration-architecture'].map(page)},
    {title:'Comparisons',pages:['guides/open-usd-vs-usdc','guides/open-usd-vs-usdg','guides/open-usd-vs-usdt','guides/open-usd-vs-open-issuance'].map(page)},
    {title:'Providers',pages:[page('ecosystem'),...providers.filter(p=>p.detail).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>({path:`providers/${p.id}`,title:p.profile!.title,description:p.description}))]},
    {title:'Networks',pages:[page('networks'),...networks.filter(n=>n.profile).map(n=>({path:`networks/${n.id}`,title:n.profile!.title,description:`Token identity, setup, fees, provider routes, and operational limits on ${n.name}.`}))]},
    {title:'Data',pages:[page('data')]},
    {title:'Optional',pages:['index','changelog','about','privacy'].map(page)},
  ];
  const lines=[
    '# Open USD (OUSD) developer reference',
    '',
    '> Independent documentation for Open USD (OUSD), the payments stablecoin created by Open Standard.',
    '',
    'This reference concerns Open Standard’s OUSD. It is unrelated to Pixar’s Universal Scene Description (OpenUSD) and Origin Dollar (also called OUSD).',
    '',
    'Start with Concepts, choose a task, then read the provider and network references. Product support, account eligibility, network availability, and testing status are separate facts. For accurate reuse, preserve the meaning of source limitations; illustrative code is not a tested integration.',
    '',
    'Markdown copies are generated from the same rendered pages as this website. Each copy identifies its original URL; links and section fragments point to the original pages. The JSON dataset is linked below and remains the structured source for providers, products, networks, addresses, and provenance.',
    '',
  ];
  for(const group of groups){
    lines.push(`## ${group.title}`,'');
    for(const entry of group.pages){
      const url=`${origin}/${entry.path}${entry.path?'/':''}`;
      const markdown=`${origin}/${entry.path||'index'}.md`;
      lines.push(`- [${entry.title}](${markdown}): ${entry.description} [Original page](${url}).`);
    }
    if(group.title==='Data')lines.push(
      `- [Ecosystem JSON dataset](${origin}/data/ecosystem.json): The 0.1 alpha dataset, with CC0-1.0 for the original compilation within the maintainer’s rights. Check each record’s review date and sources.`,
      `- [Dataset license notice](${origin}/data/LICENSE.txt): Scope of CC0 reuse; cited third-party material retains its own rights.`,
      `- [JSON Schema](${origin}/data/ecosystem.schema.json): Validate records against the current dataset contract.`,
    );
    if(group.title==='Optional')lines.push(`- [Full documentation](${origin}/llms-full.txt): All exported pages in one file. Use individual pages for focused retrieval.`);
    lines.push('');
  }
  return new Response(lines.join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
