import {datasetJsonSchema} from '../../lib/schema';
export function GET(){return new Response(JSON.stringify(datasetJsonSchema(),null,2),{headers:{'Content-Type':'application/schema+json'}});}
