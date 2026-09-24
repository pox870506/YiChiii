const playwrightModule=process.env.PLAYWRIGHT_MODULE||'playwright';
const {chromium}=await import(playwrightModule);
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const phase=process.argv[2]||'before';
const output=process.env.PERF_OUTPUT||`work/perf/${phase}`;
const url=process.env.PERF_URL||'http://127.0.0.1:4173/';
fs.mkdirSync(output,{recursive:true});
const root='dist/client',manifest=JSON.parse(fs.readFileSync(`${root}/.vite/manifest.json`));
const visited=new Set();
function visit(key){if(visited.has(key))return;visited.add(key);for(const key2 of manifest[key]?.imports||[])visit(key2);}
visit('app/journey-page.tsx');visit('virtual:vinext-app-browser-entry');
const initialFiles=[...new Set([...visited].flatMap(k=>[manifest[k]?.file,...(manifest[k]?.css||[])]).filter(Boolean))];
const sizes=files=>({raw:files.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0),gzip:files.reduce((n,f)=>n+gzipSync(fs.readFileSync(path.join(root,f))).length,0)});
const build={initialJs:sizes(initialFiles.filter(f=>f.endsWith('.js'))),css:sizes(fs.readdirSync(`${root}/_next/static/css`).map(f=>`_next/static/css/${f}`)),initialFiles};
const browser=await chromium.launch({headless:true,channel:'msedge'});
const runs=[];
try {
for(let i=0;i<5;i++){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const cdp=await context.newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.enable');
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
 await page.addInitScript(()=>{window.__lcp=0;new PerformanceObserver(list=>{window.__lcp=list.getEntries().at(-1).startTime;}).observe({type:'largest-contentful-paint',buffered:true});});
 await page.goto(url,{waitUntil:'networkidle'});
 await page.locator('.j-hero .j-image-button img').evaluate(img=>img.decode());
 const home=await page.evaluate(()=>({lcp:window.__lcp,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,load:performance.getEntriesByType('navigation')[0].loadEventEnd,js:performance.getEntriesByType('resource').filter(x=>x.name.endsWith('.js')).reduce((n,x)=>n+x.encodedBodySize,0)}));
 if(i===0)await page.screenshot({path:`${output}/overview.png`,fullPage:true});
 async function action(kind){return page.evaluate(async kind=>{
  let expectedDate;const start=performance.now();
  if(kind==='daily') [...document.querySelectorAll('.j-tabs button')].find(b=>b.textContent.includes('每日')).click();
  if(kind==='day'){document.querySelector('.j-day-controls .j-actions button:last-child').click();expectedDate='2026-11-14';}
  if(kind==='photo')document.querySelector('.j-day .j-image-button').click();
  if(kind==='nextPhoto')document.querySelector('.j-lightbox-next').click();
  const ready=()=>kind==='daily'?!!document.querySelector('.j-day .j-stories'):kind==='day'?document.querySelector('.j-day .j-kicker')?.textContent.includes(expectedDate):!!document.querySelector('.j-lightbox-full')?.complete&&document.querySelector('.j-lightbox-full').naturalWidth>0&&!document.querySelector('.j-lightbox-status');
  await new Promise((resolve,reject)=>{const poll=()=>{if(performance.now()-start>20000){reject(Error('Timed out '+kind));return;}if(ready())requestAnimationFrame(()=>requestAnimationFrame(resolve));else requestAnimationFrame(poll);};requestAnimationFrame(poll);});
  return performance.now()-start;
 },kind);}
 const daily=await action('daily');
 const day=await action('day');
 // Use a day with several photographs; wait for its displayed preview.
 await page.locator('#day-select').selectOption('1');
 await page.locator('.j-day .j-image-button img').first().evaluate(img=>img.decode());
 const photo=await action('photo');
 const nextPhoto=await action('nextPhoto');
 await page.getByRole('button',{name:'關閉 ✕',exact:true}).click();
 if(i===0){
  for(const label of ['記帳','住宿','交通與票券','美食與購物','行李','天氣','要下載的app']){
   await page.locator('.j-tabs button').filter({hasText:label}).click();await page.waitForTimeout(500);
   await page.screenshot({path:`${output}/${label}.png`,fullPage:true});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow: '+label);
  }
 }
 runs.push({home,daily,day,photo,nextPhoto,errors});
 await context.close();
 console.log(JSON.stringify({phase,run:i+1,...runs.at(-1)}));
}
}finally{await browser.close();}
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const summary={build,median:{lcp:median(runs.map(r=>r.home.lcp)),fcp:median(runs.map(r=>r.home.fcp)),load:median(runs.map(r=>r.home.load)),initialNetworkJs:median(runs.map(r=>r.home.js)),...Object.fromEntries(['daily','day','photo','nextPhoto'].map(k=>[k,median(runs.map(r=>r[k]))]))},runs};
fs.writeFileSync(`${output}/metrics.json`,JSON.stringify(summary,null,2));console.log(JSON.stringify(summary.median));
