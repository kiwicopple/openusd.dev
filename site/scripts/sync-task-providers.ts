import fs from 'node:fs';
import {handbookTasks} from '../src/lib/registry';
import {taskProviderMarkdown} from '../src/lib/provider-guides';
const write=process.argv.includes('--write');
for(const task of handbookTasks){
 const file=`src/content/docs/guides/${task.slug}.md`;
 const before=fs.readFileSync(file,'utf8');
 const after=before.replace(/<!-- task-providers:start -->[\s\S]*?<!-- task-providers:end -->/,`<!-- task-providers:start -->\n${taskProviderMarkdown(task.id)}\n<!-- task-providers:end -->`);
 if(after===before)continue;
 if(write)fs.writeFileSync(file,after);else throw Error(`Provider links out of sync: ${file}. Run node --import tsx scripts/sync-task-providers.ts --write`);
}
console.log(`Verified registry-driven provider lists for ${handbookTasks.length} tasks.`);
