import initial from './plan-v6.json';
export type Expense={id:string;date:string;category:string;detail:string;amount:number;currency:string;rate:number;payer:string;note:string;status:string;scope?:"shared"|"personal";consumer?:string;owner?:string;confirmedTwd?:number;bookingId?:string};
export type PackItem={id:string;category:string;name:string;done:boolean};
export type Plan=Omit<typeof initial,'expenses'|'packing'|'photos'|'notes'> & {expenses:Expense[];packing:PackItem[];photos:Record<string,string>;notes:Record<string,string>};
export const initialPlan:Plan={...initial,expenses:initial.expenses.map(e=>({...e,scope:e.scope as Expense['scope']}))};
export const mapUrl=(q:string)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
export const money=(n:number)=>new Intl.NumberFormat('zh-TW',{minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
export const defaultRates:Record<string,number>={TWD:1,EUR:36.75,USD:31.65,CNY:4.72};
export const categories=['吃飯','交通','住宿','購物伴手','門票娛樂','其他雜支'];
export const categoryName=(s:string)=>({'餐飲':'吃飯','機票':'交通','購物':'購物伴手','超市':'吃飯','門票':'門票娛樂','其他':'其他雜支'}[s]|| (categories.includes(s)?s:'其他雜支'));
export const cents=(e:Expense,_rates?:Record<string,number>)=>Math.round((e.confirmedTwd??e.amount*(defaultRates[e.currency]??e.rate))*100);
export function totals(entries:Expense[],people:number,rates?:Record<string,number>){const total=entries.reduce((n,e)=>n+cents(e,rates),0)/100;const shared=entries.filter(e=>e.scope!=='personal').reduce((n,e)=>n+cents(e,rates),0)/100;return{total,shared,personal:Math.round((total-shared)*100)/100,perPerson:Math.round(shared/people),count:entries.length};}
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const string=(v:unknown)=>typeof v==='string'&&v.length<=20000;
const rows=(v:unknown,p:(v:Record<string,unknown>)=>boolean)=>Array.isArray(v)&&v.length<=2000&&v.every(x=>record(x)&&p(x));
const unique=(v:{id:string}[])=>new Set(v.map(x=>x.id)).size===v.length;
const https=(v:unknown)=>{try{return typeof v==='string'&&new URL(v).protocol==='https:';}catch{return false;}};
export function parsePlan(value:unknown):Plan{
 if(!record(value)||!Array.isArray(value.days)||value.days.length!==14||!Array.isArray(value.stays)||!record(value.notes))throw Error('行程格式不完整');
 const dates=initialPlan.days.map(d=>d.date);
 if(!value.days.every((d,i)=>record(d)&&d.date===dates[i]&&['weekday','city','title','stay','morning','afternoon','evening','transport','food','rain'].every(k=>string(d[k]))&&(d.ticketingNote===undefined||string(d.ticketingNote))))throw Error('請保留 14 天日期與行程文字');
 if(!Object.values(value.notes).every(string))throw Error('備註必須是文字');
 if(value.schemaVersion!==2||![6,7,8,9,10,11].includes(Number(value.planRevision)))throw Error('請先匯出目前版本 JSON 再修改與匯入');
 if(!Number.isInteger(value.people)||Number(value.people)<1||Number(value.people)>100)throw Error('分攤人數需為 1–100');
 if(!rows(value.expenses,e=>['id','date','category','detail','currency','payer','note','status'].every(k=>string(e[k]))&&typeof e.amount==='number'&&Number.isFinite(e.amount)&&e.amount>=0&&e.amount<=1e9&&typeof e.rate==='number'&&Number.isFinite(e.rate)&&e.rate>0&&e.rate<=1e6))throw Error('帳目金額或欄位不正確');
 if(!rows(value.packing,e=>['id','category','name'].every(k=>string(e[k]))&&typeof e.done==='boolean'))throw Error('行李清單格式不正確');
 if(!unique(value.expenses as Expense[])||!unique(value.packing as PackItem[]))throw Error('帳目或行李 ID 重複');
 if((value.expenses as Expense[]).some(e=>!e.id.trim()||!e.category.trim()||!e.detail.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!['TWD','EUR','CNY','USD'].includes(e.currency)||(e.currency==='TWD'&&e.rate!==1)||!Number.isSafeInteger(cents(e)))||!Number.isSafeInteger((value.expenses as Expense[]).reduce((n,e)=>n+cents(e),0)))throw Error('帳目日期、幣別或換算金額不正確');
 if(value.stays.length!==3||!value.stays.every(s=>record(s)&&Number.isInteger(s.nights)&&['city','checkIn','checkOut','name','address','booking'].every(k=>string(s[k]))&&Array.isArray(s.nearbySupermarkets)&&s.nearbySupermarkets.every(string)))throw Error('住宿欄位不完整');
 if(Number(value.planRevision)>=8&&!value.stays.every(s=>record(s)&&https(s.bookingUrl)&&['priceText','paymentText','perNightText','accessNote'].every(k=>string(s[k]))))throw Error('住宿付款資訊或連結不完整');
 // Reject malformed reference data before replacing any saved state.
 if(!record(value.reference)||!rows(value.reference.foodLists,c=>string(c.city)&&rows(c.items,f=>['name','dish','when'].every(k=>string(f[k]))))||!rows(value.reference.apps,a=>['name','country','why'].every(k=>string(a[k])))||!rows(value.reference.flights,f=>['group','route','detail'].every(k=>string(f[k])))||!rows(value.reference.ticketDeadlines,t=>['name','detail','url'].every(k=>string(t[k]))))throw Error('共編資料不完整');
 if(!(value.reference.ticketDeadlines as {url:unknown}[]).every(t=>https(t.url))||(value.reference.foodLists as {items:{address?:unknown}[]}[]).some(c=>c.items.some(f=>f.address!==undefined&&!string(f.address))))throw Error('連結或餐廳地址格式不正確');
 for(const d of value.days as Record<string,unknown>[]){for(const k of ['transportSteps','ticketingSteps'])if(d[k]!==undefined&&(!Array.isArray(d[k])||!(d[k] as unknown[]).every(string)))throw Error('交通欄位需為文字清單');if(!Array.isArray(d.timeline)||!d.timeline.every(x=>Array.isArray(x)&&x.length===2&&x.every(string)))throw Error('時間軸格式不正確');}
 if(value.exchangeRates!==undefined&&(!record(value.exchangeRates)||!['EUR','USD','CNY'].every(k=>typeof (value.exchangeRates as Record<string,unknown>)[k]==='number'&&Number.isFinite((value.exchangeRates as Record<string,number>)[k])&&(value.exchangeRates as Record<string,number>)[k]>0&&(value.exchangeRates as Record<string,number>)[k]<=1e6)))throw Error('設定匯率不正確');
 if((value.expenses as Expense[]).some(e=>(e.scope!==undefined&&!['shared','personal'].includes(e.scope))||(e.consumer!==undefined&&!string(e.consumer))))throw Error('消費分攤方式不正確');
 if((value.expenses as Expense[]).some(e=>(e.confirmedTwd!==undefined&&(typeof e.confirmedTwd!=='number'||!Number.isFinite(e.confirmedTwd)||e.confirmedTwd<0||e.confirmedTwd>1e9))||(e.owner!==undefined&&!string(e.owner))||(e.bookingId!==undefined&&!string(e.bookingId))))throw Error('帳目確認金額或付款人格式不正確');
 const safe=(Number(value.planRevision)<8?{...structuredClone(initialPlan),expenses:structuredClone(value.expenses),packing:structuredClone(value.packing),notes:structuredClone(value.notes),people:value.people}:structuredClone(value)) as unknown as Plan;
 if(value.stories!==undefined&&!rows(value.stories,s=>['id','day','title','summary'].every(k=>string(s[k]))&&Array.isArray(s.aliases)&&s.aliases.every(string)&&Array.isArray(s.paragraphs)&&s.paragraphs.every(string)))throw Error('故事內容格式不正確');
 safe.stories=value.stories===undefined?structuredClone(initialPlan.stories):structuredClone(value.stories) as Plan['stories'];
 if(Number(value.planRevision)<9){
  const northDay=initialPlan.days.find(d=>d.date==='2026-11-23')!;
  safe.days=safe.days.map(d=>d.date==='2026-11-23'?structuredClone(northDay):d);
  safe.stories=[...safe.stories.filter(s=>s.day!=='23'),...structuredClone(initialPlan.stories.filter(s=>s.day==='23'))];
  const adamDeadline=initialPlan.reference.ticketDeadlines.find(t=>t.name==='A\'DAM LOOKOUT');
  if(adamDeadline){
   const index=safe.reference.ticketDeadlines.findIndex(t=>t.name==='A\'DAM LOOKOUT');
   if(index>=0)safe.reference.ticketDeadlines[index]=structuredClone(adamDeadline);
   else safe.reference.ticketDeadlines.push(structuredClone(adamDeadline));
  }
  safe.planRevision=9;
 }
 if(Number(value.planRevision)<10){
  const splitDay=initialPlan.days.find(d=>d.date==='2026-11-17')!;
  safe.days=safe.days.map(d=>d.date==='2026-11-17'?structuredClone(splitDay):d);
  safe.stories=[...safe.stories.filter(s=>s.day!=='17'),...structuredClone(initialPlan.stories.filter(s=>s.day==='17'))];
  safe.planRevision=10;
 }
 if(Number(value.planRevision)<11){
  const refreshDates=new Set(['2026-11-17','2026-11-23']);
  safe.days=safe.days.map(d=>refreshDates.has(d.date)?structuredClone(initialPlan.days.find(seed=>seed.date===d.date)!):d);
  safe.stories=[...safe.stories.filter(s=>s.day!=='23'),...structuredClone(initialPlan.stories.filter(s=>s.day==='23'))];
  safe.planRevision=11;
 }
 safe.exchangeRates={TWD:1,EUR:36.75,USD:31.65,CNY:4.72};
 if(Number(value.planRevision)<8){const seedIds=new Set(['stay-0','stay-1','stay-2']);safe.expenses=[...structuredClone(initialPlan.expenses),...safe.expenses.filter(e=>!seedIds.has(e.id))];}
 safe.expenses=safe.expenses.map(e=>({...e,category:categoryName(e.category),scope:e.scope||'shared',consumer:e.consumer||e.payer,rate:safe.exchangeRates[e.currency as keyof typeof safe.exchangeRates]}));
 // Apply the confirmed payment update once; retain personal entries and deleted seeds.
 if(Number(value.paymentRevision||0)<1){
  safe.stays=safe.stays.map((stay,i)=>({...stay,priceText:initialPlan.stays[i].priceText,paymentText:initialPlan.stays[i].paymentText,...(i===1?{booking:initialPlan.stays[i].booking}:{})}));
  const oldPaymentNotes=[
   '靖宜代付，信用卡刷歐元。共 2 次扣款：房東接受後第一次，10/29 第二次；各次金額以訂單為準。',
   '靖宜代付，信用卡刷歐元。共 1 次扣款：10 月中，確切日期待確認。',
   '靖宜代付。微信支付人民幣 8,324；抵達現場另刷城市稅 €110，已包含在這筆住宿總額內。'
  ];
  safe.expenses=safe.expenses.map(e=>{const seed=initialPlan.expenses.find(x=>x.id===e.id&&x.bookingId===e.bookingId);if(!seed)return e;const oldNote=oldPaymentNotes[Number(e.id.slice(-1))];const note=e.note.includes(oldNote)?e.note.replace(oldNote,seed.note):e.note===seed.note?e.note:seed.note+(e.note?'\n'+e.note:'');return {...e,note,status:e.status==='扣款依安排'?seed.status:e.status,...(e.id==='stay-0'&&e.amount===1581?{amount:1581.06}:{})};});
  safe.days=safe.days.map(d=>d.date==='2026-11-18'?{...d,timeline:d.timeline.map(([time,text])=>[time,text.replace('目標抵鹿特丹、午餐；無法寄放行李時先用車站寄物','目標抵鹿特丹；12:00 起可先到住宿寄放行李，再吃午餐')])}:d);
 }
 safe.paymentRevision=1;
 if(!safe.reference.apps.some(a=>a.name==='Reclamefolder'))safe.reference.apps.push(structuredClone(initialPlan.reference.apps.find(a=>a.name==='Reclamefolder')!));
 safe.travelers=[...initialPlan.travelers];
 safe.artworks=structuredClone(initialPlan.artworks);safe.giftProducts=structuredClone(initialPlan.giftProducts);
 safe.dayPhotos=structuredClone(initialPlan.dayPhotos);safe.stayPhotos=structuredClone(initialPlan.stayPhotos);safe.cityStories=structuredClone(initialPlan.cityStories);safe.landmarks=structuredClone(initialPlan.landmarks);safe.shopping=structuredClone(initialPlan.shopping);safe.transportBooking=structuredClone(initialPlan.transportBooking);
 safe.photos={...initialPlan.photos}; // Keep trusted site asset locations.
 if(Number(value.shoppingRevision||0)<2){
  for(const city of initialPlan.reference.foodLists){
   const added=city.items.filter(f=>initialPlan.shoppingDiningNames.includes(f.name));
   let target=safe.reference.foodLists.find(c=>c.city===city.city);
   if(!target){target={city:city.city,items:[]};safe.reference.foodLists.push(target);}
   for(const item of added)if(!target.items.some(f=>f.name===item.name))target.items.push(structuredClone(item));
  }
 }
 safe.shoppingRevision=2;
 for(const c of safe.reference.foodLists)for(const f of c.items){const original=initialPlan.reference.foodLists.flatMap(x=>x.items).find(x=>x.name===f.name);f.image=original?.image||'';f.images=original?.images||[];f.intro=typeof f.intro==='string'?f.intro:original?.intro||'';}
 return safe;
}
export function migrateLegacy(raw:unknown):Plan{
 const next=structuredClone(initialPlan);
 if(!record(raw))return next;
 if(record(raw.notes))for(const [k,v]of Object.entries(raw.notes))if(typeof v==='string')next.notes[k]=v;
 // Existing saved plans remain recoverable in a separate local backup.
 return next;
}
export function planMarkdown(p:Plan){return '# 德國、荷蘭之旅\n\n'+p.travelers.join('、')+'\n\n'+p.days.map(d=>`## ${d.date} ${d.title}\n\n${d.morning}\n\n${d.afternoon}\n\n${d.evening}\n\n交通：${d.transport}\n\n餐食：${d.food}\n\n備註：${(p.notes as Record<string,string>)[d.date]||''}`).join('\n\n')+'\n\n## MEDICA 參觀全攻略\n\n[下載完整繁體中文 PDF](https://germany-netherlands-nov2026-travel.pox870506.chatgpt.site/guides/medica-2026-updated.pdf)\n\n'+p.stories.map(s=>'### 11/'+s.day+' '+s.title+'\n\n'+s.paragraphs.join('\n\n')).join('\n\n')+'\n\n## 城市與沿途故事\n\n'+p.cityStories.map(s=>s.date+' '+s.city+'：'+s.text).join('\n\n')+'\n\n'+p.landmarks.map(s=>s.label+'：'+s.intro).join('\n\n')+'\n\n## 超市與伴手禮\n\n'+['荷蘭','德國'].map(country=>'### '+country+'購物\n\n'+['超市','藥妝','伴手禮'].map(category=>'#### '+category+'\n\n'+p.giftProducts.filter(g=>g.country===country&&g.category===category).map(g=>'##### '+g.name+'\n\n'+g.where+'\n\n'+g.intro+'\n\n'+g.tips.map(t=>'- '+t).join('\n')+'\n\n'+g.images.map(src=>'!['+g.name+'](https://germany-netherlands-nov2026-travel.pox870506.chatgpt.site'+src+')').join('\n')).join('\n\n')).join('\n\n')).join('\n\n')+'\n\n## 住宿\n\n'+p.stays.map(s=>`${s.name}\n${s.checkIn} — ${s.checkOut}\n${s.address}\n${s.booking}`).join('\n\n')+'\n\n## 城市的味道\n\n'+p.reference.foodLists.map(c=>`### ${c.city}\n\n`+c.items.map(f=>`${f.name}：${f.dish}｜${f.when}\n${f.intro}`).join('\n\n')).join('\n\n')+'\n\n## 帳本\n\n'+p.expenses.map(e=>`${e.date}｜${e.category}｜${e.detail}｜${e.currency} ${e.amount}｜匯率 ${p.exchangeRates[e.currency as keyof typeof p.exchangeRates]}｜${e.scope==='personal'?'個人消費：'+e.consumer:'公費均分'}｜${e.payer}｜${e.note}`).join('\n\n')+`\n\n總額 NT$${money(totals(p.expenses,p.people,p.exchangeRates).total)}；${p.people} 人均分 NT$${money(totals(p.expenses,p.people,p.exchangeRates).perPerson)}\n\n## 行李\n\n`+p.packing.map(x=>`- [${x.done?'x':' '}] ${x.category}｜${x.name}`).join('\n');}
