import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {contentDates,significantDate,latestDate} from '../src/lib/content-dates';

test('significant dates reject invalid inputs rather than inventing build dates',()=>{
 for(const date of [undefined,null,'','yesterday','2026-02-30','2026-2-01','2026-10-12T12:00:00Z'])assert.equal(significantDate(date),undefined);
 assert.equal(significantDate('2026-10-12'),'2026-10-12');
 assert.equal(latestDate(undefined,'2026-09-20','2026-10-01'),'2026-10-01');
 assert.equal(latestDate(),undefined);
});

test('page dates follow only their significant content dependencies',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ousd-dates-'));
 try{
  fs.mkdirSync(path.join(root,'src/content/docs/guides'),{recursive:true});
  fs.mkdirSync(path.join(root,'src/data'),{recursive:true});
  const doc=(name:string,fields:string)=>fs.writeFileSync(path.join(root,'src/content/docs',name+'.md'),'---\n'+fields+'\n---\nExample');
  doc('index',"modifiedAt: '2026-09-01'");doc('about','reviewedAt: 2026-10-10');
  doc('guides/unchanged','modifiedAt: 2026-09-02\nreviewedAt: 2026-10-12');
  doc('guides/draft','modifiedAt: 2026-10-12\ndraft: true');
  for(const [name,data] of Object.entries({
   providers:[{id:'alpha',modifiedAt:'2026-09-03'},{id:'beta',modifiedAt:'2026-09-04'}],
   capabilities:[{providerId:'alpha',modifiedAt:'2026-09-08',ousdSupport:'documented',networks:['One']},{providerId:'beta',modifiedAt:'2026-10-08',ousdSupport:'documented',networks:['Other']}],
   networks:[{id:'one',name:'One',modifiedAt:'2026-09-06'}],
   updates:[{type:'ecosystem',date:'2026-09-07',modifiedAt:'2026-09-07'},{type:'site',date:'2026-10-09',modifiedAt:'2026-10-09'}],
   license:{modifiedAt:'2026-10-11'},
  }))fs.writeFileSync(path.join(root,'src/data',name+'.json'),JSON.stringify(data));
  const dates=contentDates(root);
  assert.equal(dates['/providers/alpha/'],'2026-09-08');
  assert.equal(dates['/providers/beta/'],'2026-10-08');
  assert.equal(dates['/networks/one/'],'2026-09-08');
  assert.equal(dates['/networks/'],'2026-09-06');
  assert.equal(dates['/data/'],'2026-10-11');
  assert.equal(dates['/ecosystem/'],'2026-10-08');
  assert.equal(dates['/changelog/'],'2026-10-09');
  assert.equal(dates['/'],'2026-09-07');
  assert.equal(dates['/guides/unchanged/'],'2026-09-02');
  assert.equal(dates['/about/'],undefined);
  assert.ok(!('/guides/draft/' in dates));
  assert.deepEqual(contentDates(root),dates,'Repeated reads/builds are deterministic');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
