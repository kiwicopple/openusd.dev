import {dataset} from '../../lib/registry';
export function GET(){return new Response(JSON.stringify(dataset,null,2),{headers:{'Content-Type':'application/json; charset=utf-8','X-Robots-Tag':'noindex'}});}
