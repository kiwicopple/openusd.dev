import {spawnSync} from 'node:child_process';
// Explicit build intent keeps deployment and preview indexing consistent.
const env={...process.env,PRODUCTION_INDEXING:process.argv.includes('--preview')?'false':'true'};
for(const args of [['--import','tsx','scripts/validate.ts'],['node_modules/astro/bin/astro.mjs','build'],['scripts/check-navigation.mjs'],['--import','tsx','scripts/check-agents.ts',...(process.argv.includes('--preview')?['--preview']:[])]]){
 const result=spawnSync(process.execPath,args,{env,stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
}
