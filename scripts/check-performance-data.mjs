import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
process.on('uncaughtException',error=>{console.error(error.message);process.exit(1);});

// Compare migrations and exports to the last release, including user-edited data.
const baseline=process.argv[2]||'3c660296e519587a3dac4dc84fbbd46af0bd9d7b';
const gitFile=file=>execFileSync('git',['show',`${baseline}:${file}`],{encoding:'utf8',maxBuffer:10*1024*1024});
const initial=fs.readFileSync('lib/plan-v6.json','utf8');
const baselinePlan=JSON.parse(gitFile('lib/plan-v6.json'));
const contentCheck=JSON.parse(initial);
const editedDay=contentCheck.days.find(day=>day.date==='2026-11-14');
const originalDay=baselinePlan.days.find(day=>day.date==='2026-11-14');
for(const key of ['afternoon','timeline','food'])editedDay[key]=originalDay[key];
contentCheck.reference.foodLists.find(row=>row.city==='科隆').items=baselinePlan.reference.foodLists.find(row=>row.city==='科隆').items;
assert.deepEqual(contentCheck,baselinePlan,'Only the requested Cologne lunch entry may change travel data');
const photoMeta=JSON.parse(fs.readFileSync('lib/photo-meta.json','utf8'));
delete photoMeta['/photos/fruh-am-dom.webp'];
assert.deepEqual(photoMeta,JSON.parse(gitFile('lib/photo-meta.json')),'Photo catalog content must otherwise stay unchanged');
async function load(source){
 const code=source.replace("import initial from './plan-v6.json';",`const initial=${initial};`);
 const js=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
 return import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
}
const before=await load(gitFile('lib/journey.ts')),after=await load(fs.readFileSync('lib/journey.ts','utf8'));
let cases=0;
for(const revision of [6,7,8,9,10,11])for(const migrated of [false,true]){
 const fixture=structuredClone(before.initialPlan);
 fixture.planRevision=revision;
 if(!migrated)for(const key of ['ledgerRevision','paymentRevision','flightRevision','shoppingRevision'])delete fixture[key];
 fixture.notes['2026-11-19']='個人筆記保留測試';
 fixture.expenses=fixture.expenses.filter(e=>e.id!=='stay-1');
 fixture.expenses.push({id:'user-custom',date:'2026-11-19',category:'吃飯',detail:'個人記帳測試',amount:32,currency:'EUR',rate:36.75,payer:'靖宜',consumer:'益萁',owner:'益萁',scope:'personal',participants:['益萁'],settlement:'family',settlementStatus:'settled',status:'已付',note:'請保留'});
 fixture.packing.push({id:'user-pack',category:'其他',name:'自訂行李',done:true});
 const expected=before.parsePlan(structuredClone(fixture)),actual=after.parsePlan(structuredClone(fixture));
 assert.deepEqual(actual,expected,`Revision ${revision}, migrated ${migrated}`);
 const outcome=(module,value)=>{try{return {value:module.parsePlan(value)};}catch(error){return {error:error.message};}};
 assert.deepEqual(outcome(after,actual),outcome(before,expected));
 assert.equal(after.planMarkdown(actual),before.planMarkdown(expected));
 assert.deepEqual(after.ledgerBalances(actual.expenses),before.ledgerBalances(expected.expenses));
 cases++;
}
assert.deepEqual(after.migrateLegacy({notes:{'2026-11-13':'舊手機筆記'}}),before.migrateLegacy({notes:{'2026-11-13':'舊手機筆記'}}));
const plan=after.parsePlan(structuredClone(after.initialPlan));
for(const name of ['益萁','耘欣'])assert.deepEqual(after.ledgerBalances(plan.expenses.filter(e=>e.id.startsWith('flight-')&&e.consumer===name)),[]);
assert(plan.expenses.some(e=>e.consumer==='靖枝'&&after.ledgerBalances([e]).some(t=>t.from==='靖枝'&&t.to==='靖宜')));
const shared={...plan.expenses[0],amount:50000,confirmedTwd:50000,currency:'TWD',rate:1,payer:'靖宜',participants:[...after.travelers],settlement:'settle',settlementStatus:'pending'};
assert.deepEqual(after.ledgerBalances([shared]),[{from:'靖枝',to:'靖宜',amount:1000000},{from:'玉穎',to:'靖宜',amount:1000000}]);
assert.deepEqual(after.ledgerBalances([{...shared,settlement:'host'}]),[]);
for(const value of [0,-1,0.005,36.75,1e9,Infinity,NaN])assert.equal(after.money(value),before.money(value));
function time(module){const start=performance.now();for(let i=0;i<10000;i++)module.money(i/3);return performance.now()-start;}
const formatting={beforeMs:time(before),afterMs:time(after),calls:10000};
console.log(JSON.stringify({migrationCases:cases,legacy:true,requestedCologneLunchOnly:true,ledgerCases:true,markdownUnchanged:true,formatting},null,2));
