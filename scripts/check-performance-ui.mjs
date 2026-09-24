import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
const base=process.env.TEST_URL||'http://127.0.0.1:4173/';
const key='de-nl-travel-2026-v6';
const initial=JSON.parse(fs.readFileSync('lib/plan-v6.json','utf8'));
const errors=[];
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const tab=async name=>{await page.locator('.j-tabs button').filter({hasText:name}).click();await page.locator('#journey-panel').filter({has:page.locator('section')}).waitFor();};
 await page.goto(base);
 // Seed an existing phone backup in this isolated test browser only.
 const existing={...initial,notes:{...initial.notes,'2026-11-19':'保留手機筆記'}};
 await page.evaluate(({key,existing})=>localStorage.setItem(key,JSON.stringify(existing)),{key,existing});
 await page.reload();
 await tab('每日');
 await page.locator('#day-select').selectOption('5');
 assert((await page.locator('.j-day').innerText()).includes('2026-11-17'));
 assert.equal(await page.locator('.j-group-schedule').count(),2);
 await page.getByRole('button',{name:'下一天 →',exact:true}).click();
 assert((await page.locator('.j-day .j-kicker').first().innerText()).includes('2026-11-18'));
 await page.getByRole('button',{name:'← 前一天',exact:true}).click();
 await page.locator('#day-select').selectOption('1');
 assert.equal(await page.locator('.j-stories .j-story-body').count(),0);
 await page.locator('.j-stories > summary').click();
 await page.locator('.j-place-story > summary').first().click();
 await page.locator('.j-story-body').first().waitFor();
 assert((await page.locator('.j-story-body').first().innerText()).length>100);
 await page.locator('.j-day > .j-gallery .j-image-button').click();
 await page.locator('.j-lightbox-full').evaluate(img=>img.decode());
 const first=await page.locator('.j-lightbox-full').getAttribute('src');
 await page.keyboard.press('ArrowRight');
 await page.locator('.j-lightbox-full').evaluate(img=>img.decode());
 assert.notEqual(await page.locator('.j-lightbox-full').getAttribute('src'),first);
 await page.keyboard.press('ArrowLeft');
 assert.equal(await page.locator('.j-lightbox-full').getAttribute('src'),first);
 await page.keyboard.press('Escape');assert.equal(await page.locator('.j-lightbox').count(),0);
 await tab('記帳');await page.locator('.j-ledger-form').waitFor();
 await page.getByRole('group',{name:'選擇目前帳本旅客'}).getByRole('button',{name:'益萁',exact:true}).click();
 await page.getByPlaceholder('輸入金額',{exact:true}).fill('32');
 await page.getByPlaceholder('例：科隆來回火車票').fill('效能驗證帳目');
 await page.getByRole('button',{name:'👩 靖宜幫我付',exact:true}).click();
 await page.getByRole('button',{name:'👪 家庭支付',exact:false}).click();
 await page.getByRole('button',{name:'加進帳本',exact:true}).click();
 const stored=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 let saved=await stored();const added=saved.expenses.find(e=>e.detail==='效能驗證帳目');
 assert.equal(added.payer,'靖宜');assert.equal(added.settlement,'family');assert.equal(added.amount,32);
 for(const e of initial.expenses)assert.deepEqual(saved.expenses.find(x=>x.id===e.id),e);
 assert.equal(saved.notes['2026-11-19'],'保留手機筆記');
 await page.reload();await tab('記帳');await page.locator('.j-ledger-form').waitFor();
 assert.equal(await page.getByRole('group',{name:'選擇目前帳本旅客'}).getByRole('button',{name:'益萁',exact:true}).getAttribute('aria-pressed'),'true');
 const entry=page.locator('.j-entry').filter({hasText:'效能驗證帳目'});
 await entry.locator('..').locator('summary').click();
 await entry.getByRole('button',{name:'編輯',exact:true}).click();
 await page.getByPlaceholder('輸入金額',{exact:true}).fill('33');
 await page.getByRole('button',{name:'儲存修改',exact:true}).click();
 assert.equal((await stored()).expenses.find(e=>e.id===added.id).amount,33);
 const csvPromise=page.waitForEvent('download');await page.getByRole('button',{name:'下載明細',exact:true}).click();
 const csv=fs.readFileSync(await (await csvPromise).path(),'utf8');assert(csv.includes('付款人'));assert(csv.includes('家庭支付'));
 await page.getByText('資料備份',{exact:true}).click();
 const backupPromise=page.waitForEvent('download');await page.getByRole('button',{name:'下載資料備份',exact:true}).click();
 const backup=fs.readFileSync(await (await backupPromise).path());
 await page.locator('input[type=file][accept=".json,application/json"]').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:backup});
 await page.getByText('已匯入，並下載匯入前的備份。',{exact:true}).waitFor();
 assert.equal((await stored()).expenses.find(e=>e.id===added.id).amount,33);
 await page.locator('.j-entry').filter({hasText:'效能驗證帳目'}).getByRole('button',{name:'刪除',exact:true}).click();
 await page.getByRole('button',{name:'確認刪除',exact:true}).click();
 assert(!(await stored()).expenses.some(e=>e.id===added.id));
 await tab('行李');await page.getByPlaceholder('例：備用眼鏡').fill('效能驗證行李');
 await page.getByRole('button',{name:'加入行李清單',exact:true}).click();
 const pack=page.locator('.j-pack-row').filter({hasText:'效能驗證行李'});
 await pack.locator('../..').locator('summary').click();await pack.getByRole('checkbox').check();
 assert((await stored()).packing.find(p=>p.name==='效能驗證行李').done);
 await pack.getByRole('button',{name:'刪除 效能驗證行李',exact:true}).click();
 await page.getByRole('button',{name:'復原',exact:true}).click();
 assert((await stored()).packing.some(p=>p.name==='效能驗證行李'));
 await tab('交通與票券');await page.locator('.j-ticket-category').first().locator('summary').click();
 assert.equal(await page.locator('.j-ticket-item').count(),3);
 await page.getByLabel('新增機票截圖',{exact:true}).setInputFiles({name:'效能驗證票券.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')});
 await page.getByText('已新增 1 張明細，點圖片可放大。',{exact:true}).waitFor();
 await page.reload();await tab('交通與票券');await page.locator('.j-ticket-category').first().locator('summary').click();
 const ticket=page.locator('.j-ticket-item').filter({hasText:'效能驗證票券'});await ticket.waitFor();
 await ticket.getByRole('button',{name:'刪除',exact:true}).click();await ticket.getByRole('button',{name:'確認刪除',exact:true}).click();
 await page.getByText('已刪除此張圖片。',{exact:true}).waitFor();
 for(const width of [375,430,1280]){
  await page.setViewportSize({width,height:844});
  for(const name of ['快覽','每日','住宿','交通與票券','記帳','行李','天氣','要下載的app','美食與購物']){
   await tab(name);await page.waitForTimeout(150);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width} ${name}`);
  }
  await page.getByRole('button',{name:'購物',exact:true}).click();await page.locator('.j-shopping').waitFor();
  for(const country of ['🇳🇱 荷蘭購物','🇩🇪 德國購物']){
   await page.getByRole('button',{name:country,exact:true}).click();
   for(const category of ['超市','藥妝','伴手禮']){await page.getByRole('button',{name:category,exact:true}).click();assert(await page.locator('.j-gift').count()>0);}
  }
 }
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS: daily/stories/photos, preserved expenses, ledger CRUD/CSV/backup, packing, IndexedDB tickets, shopping, mobile/desktop overflow; no page errors.');
}finally{await browser.close();}
