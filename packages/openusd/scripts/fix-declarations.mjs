// TypeScript 5.9 omits JSON import attributes from this inferred declaration.
import {readFile,writeFile} from 'node:fs/promises';
const url=new URL('../dist/index.d.ts',import.meta.url);
const text=await readFile(url,'utf8');
await writeFile(url,text.replace("import snapshot from './ecosystem.json';", "import snapshot from './ecosystem.json' with { type: 'json' };"));
