import { chromium } from 'file:///C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage();
await page.goto('https://www.google.com/maps/search/Winkel+43+Amsterdam/',{waitUntil:'domcontentloaded',timeout:60000});
await page.getByRole('heading',{name:'Winkel 43',exact:true}).waitFor({timeout:45000}).catch(()=>{});
await page.waitForTimeout(2000);
console.log((await page.locator('body').innerText()).slice(0,4500));
fs.writeFileSync('outputs/maps-images.json',JSON.stringify(await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.src,alt:i.alt}))),null,2));
await page.screenshot({path:'outputs/maps.png'});
await browser.close();

