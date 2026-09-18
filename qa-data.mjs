import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from './node_modules/typescript/lib/typescript.js';
const src=fs.readFileSync('lib/journey.ts','utf8').replace("import initial from './plan-v6.json';",'const initial='+fs.readFileSync('lib/plan-v6.json','utf8')+';');
const js=ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const moduleUrl='data:text/javascript;base64,'+Buffer.from(js).toString('base64');
const {initialPlan,parsePlan,totals,planMarkdown}=await import(moduleUrl);
assert.equal(totals(initialPlan.expenses,5).total,121804);assert.equal(totals(initialPlan.expenses,5).perPerson,24361);
const roundtrip=parsePlan(JSON.parse(JSON.stringify(initialPlan)));assert.deepEqual(parsePlan(roundtrip),roundtrip);
for(const mutate of [p=>p.expenses[0].amount=NaN,p=>p.expenses[0].rate=-1,p=>p.expenses[0].currency='???',p=>p.people=0,p=>p.expenses.push(p.expenses[0]),p=>p.days[0].timeline=[[{},'x']],p=>p.reference.ticketDeadlines[0].url='javascript:alert(1)',p=>p.reference.foodLists[0].items[0].address={x:1},p=>p.exchangeRates.EUR=0,p=>p.expenses[0].scope='invalid']){const p=structuredClone(initialPlan);mutate(p);assert.throws(()=>parsePlan(p));}
const empty=structuredClone(initialPlan);empty.packing=[];empty.expenses=[];assert.equal(parsePlan(empty).packing.length,0);assert.equal(totals(empty.expenses,5).total,0);
const entry={...initialPlan.expenses[0],confirmedTwd:undefined,bookingId:undefined,id:'test',currency:'EUR',amount:15,rate:100,category:'吃飯',scope:'shared'};
const mixed=totals([entry,{...entry,id:'personal',scope:'personal',amount:10}],5,initialPlan.exchangeRates);
assert.equal(mixed.shared,551.25);assert.equal(mixed.personal,367.5);assert.equal(mixed.perPerson,110);assert.equal(mixed.total,918.75);
const legacy=structuredClone(initialPlan);legacy.planRevision=6;delete legacy.exchangeRates;legacy.notes['2026-11-19']='keep me';legacy.expenses=[entry];legacy.packing=[];
const migrated=parsePlan(legacy);assert.equal(migrated.planRevision,8);assert.equal(migrated.notes['2026-11-19'],'keep me');assert.equal(migrated.expenses.find(e=>e.id==='test').amount,15);assert.equal(migrated.expenses.find(e=>e.id==='test').rate,36.75);assert.equal(migrated.packing.length,0);
const paths=new Set([...Object.values(initialPlan.photos),...initialPlan.artworks.map(a=>a.image),...initialPlan.giftProducts.map(a=>a.image),...initialPlan.reference.foodLists.flatMap(c=>c.items.flatMap(f=>f.images))]);for(const path of paths)assert.ok(fs.existsSync('public'+path),path);
assert.equal(initialPlan.dayPhotos['19'][0],'珍珠耳環少女');assert.ok(initialPlan.days[7].transport.includes('Gouda'));assert.ok(!initialPlan.days[7].morning.includes('Delft'));
fs.writeFileSync('exports/德荷旅遊.md',planMarkdown(initialPlan));fs.writeFileSync('exports/德荷旅遊.json',JSON.stringify(initialPlan,null,2));console.log('PASS: fixed FX, personal/shared totals, integer split, legacy migration, imports, all media paths; exports refreshed');

assert.equal(initialPlan.stays.map(s=>s.nights).join(','),'5,2,3');
assert.equal(initialPlan.days[5].stay,'杜塞道夫');
assert.ok(initialPlan.days[6].transport.includes('Düsseldorf Hbf'));
assert.ok(initialPlan.days[3].evening.includes('Ravensburg Towerstars'));
assert.ok(initialPlan.days[5].evening.includes('Starbulls Rosenheim'));
assert.equal(initialPlan.dayPhotos['21'][0],'Van Gogh Museum');
const old=structuredClone(initialPlan);old.planRevision=7;old.expenses[0].amount=31797;old.expenses.push({...entry,id:'own-keep',scope:'personal',consumer:'耘欣',owner:'耘欣'});old.notes['2026-11-13']='保留';old.packing=[];
const newPlan=parsePlan(old);assert.equal(newPlan.expenses.length,4);assert.equal(newPlan.expenses.find(e=>e.id==='stay-0').confirmedTwd,58036);assert.equal(newPlan.expenses.find(e=>e.id==='own-keep').amount,15);assert.equal(newPlan.notes['2026-11-13'],'保留');assert.equal(newPlan.packing.length,0);
const bad=structuredClone(initialPlan);bad.expenses[0].confirmedTwd=-1;assert.throws(()=>parsePlan(bad));
const fixed=structuredClone(initialPlan);fixed.exchangeRates.EUR=500;assert.equal(parsePlan(fixed).exchangeRates.EUR,36.75);
console.log('PASS: revised stays, seed migration without duplicate charges, artwork order, hockey dates, fixed formulas');

// Existing published plans gain stories without resetting any personal records.
const beforeStories=structuredClone(initialPlan);delete beforeStories.stories;
beforeStories.expenses=[{...entry,id:'keep-my-ledger',scope:'personal',consumer:'益萁'}];beforeStories.packing=[];beforeStories.notes['2026-11-19']='我的集合時間';
const withStories=parsePlan(beforeStories);assert.equal(withStories.stories.length,24);assert.equal(withStories.expenses.length,1);assert.equal(withStories.expenses[0].id,'keep-my-ledger');assert.equal(withStories.packing.length,0);assert.equal(withStories.notes['2026-11-19'],'我的集合時間');
const customStory=structuredClone(initialPlan);customStory.stories[0].paragraphs=['Claude 修改後的故事'];assert.deepEqual(parsePlan(customStory).stories[0].paragraphs,customStory.stories[0].paragraphs);
const malformedStory=structuredClone(initialPlan);malformedStory.stories[0].paragraphs=[{}];assert.throws(()=>parsePlan(malformedStory));
console.log('PASS: story upgrade retains personal records; editable stories round trip; malformed stories rejected');

const paymentOld=structuredClone(initialPlan);delete paymentOld.paymentRevision;
paymentOld.expenses[0].amount=1581;paymentOld.expenses[0].note='靖宜代付，信用卡刷歐元。共 2 次扣款：房東接受後第一次，10/29 第二次；各次金額以訂單為準。\n自填備註';
paymentOld.expenses.push({...entry,id:'my-shopping',detail:'自己的伴手禮',scope:'personal'});
paymentOld.packing=[];paymentOld.notes['2026-11-19']='保留集合備註';
const paymentNew=parsePlan(paymentOld);
assert.equal(paymentNew.expenses[0].amount,1581.06);assert.ok(paymentNew.expenses[0].note.includes('自填備註'));
assert.ok(paymentNew.expenses[0].note.includes('€768.06'));assert.ok(paymentNew.stays[1].booking.includes('12:00'));
assert.ok(paymentNew.stays[1].paymentText.includes('10/11'));assert.ok(paymentNew.stays[2].paymentText.includes('110.47'));
assert.equal(paymentNew.expenses.at(-1).id,'my-shopping');assert.equal(paymentNew.packing.length,0);assert.equal(paymentNew.notes['2026-11-19'],'保留集合備註');
assert.deepEqual(parsePlan(paymentNew),paymentNew);
const removed=structuredClone(paymentOld);removed.expenses=[];assert.equal(parsePlan(removed).expenses.length,0);
assert.equal(new Set(initialPlan.giftProducts.map(g=>g.name)).size,initialPlan.giftProducts.length);
assert.ok(initialPlan.giftProducts.every(g=>g.category&&fs.existsSync('public'+g.image)));
const {renderToStaticMarkup}=await import('react-dom/server');const React=await import('react');
const storySrc=fs.readFileSync('app/place-stories.tsx','utf8').replace("import Gallery from './gallery';",'const Gallery=()=>null;');
const storyJs=ts.transpileModule(storySrc,{compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace('export default function PlaceStories','function PlaceStories');
const renderStory=new Function('React',storyJs+';return PlaceStories;')(React);
for(const day of initialPlan.days){const html=renderToStaticMarkup(React.createElement(renderStory,{plan:initialPlan,date:day.date,city:day.city}));assert.match(html,/^<details class="j-card j-stories"[^>]*><summary>故事與歷史<\/summary>/);assert.ok(!html.includes(' open=""'));}
const hague=renderToStaticMarkup(React.createElement(renderStory,{plan:initialPlan,date:'2026-11-19',city:'海牙・豪達'}));assert.ok(hague.indexOf('初到海牙')<hague.indexOf('初到豪達'));assert.ok(hague.indexOf('初到豪達')<hague.indexOf('Kamphuisen'));
const page=fs.readFileSync('app/journey-page.tsx','utf8');assert.ok(!page.includes("tab==='exchange'"));assert.ok(page.includes("['food','🍽️','城市的味道']"));
console.log('PASS: payment migration preserves custom records, nested stories default closed, city stories first, categorized media');

const beforeShopping=structuredClone(initialPlan);delete beforeShopping.shoppingRevision;
for(const city of beforeShopping.reference.foodLists)city.items=city.items.filter(f=>!initialPlan.shoppingDiningNames.includes(f.name));
beforeShopping.notes['2026-11-19']='自己的筆記';beforeShopping.expenses=[entry];beforeShopping.packing=[];
const shoppingUpgrade=parsePlan(beforeShopping);
for(const name of initialPlan.shoppingDiningNames)assert.equal(shoppingUpgrade.reference.foodLists.flatMap(c=>c.items).filter(f=>f.name===name).length,1,name);
assert.equal(shoppingUpgrade.notes['2026-11-19'],'自己的筆記');assert.equal(shoppingUpgrade.expenses.length,1);assert.equal(shoppingUpgrade.packing.length,0);
const removedDining=structuredClone(shoppingUpgrade);for(const city of removedDining.reference.foodLists)city.items=city.items.filter(f=>f.name!==initialPlan.shoppingDiningNames[0]);
assert.ok(!parsePlan(removedDining).reference.foodLists.flatMap(c=>c.items).some(f=>f.name===initialPlan.shoppingDiningNames[0]));
console.log('PASS: new dining options migrate once; personal records and subsequent removals retained');
