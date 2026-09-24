'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {categories,categoryName,cents,defaultRates,expenseParticipants,expenseSettlement,expenseShares,jingyiFamily,ledgerBalances,money,settlementName,travelers,type Expense,type Plan,type SettlementMode} from '@/lib/journey';

const icons=['🍴','🚆','🏨','🎁','🎫','🧾'];
const categoryIcon=(category:string)=>icons[Math.max(0,categories.indexOf(categoryName(category)))];
const blank=(name='益萁'):Expense=>({id:'',date:'2026-11-13',category:'吃飯',detail:'',amount:0,currency:'EUR',rate:defaultRates.EUR,payer:name,consumer:name,scope:'personal',participants:[name],settlement:'personal',settlementStatus:'settled',note:'',status:'已付'});
const asTwd=(e:Expense)=>cents(e)/100;
const twdText=(amount:number)=>`NT$${money(Math.round(amount))}`;
const recommend=(participants:string[],payer:string,viewer:string):SettlementMode=>{
 if(participants.length===1&&participants[0]===viewer&&payer===viewer)return 'personal';
 if(participants.length>0&&participants.every(person=>jingyiFamily.includes(person))&&jingyiFamily.includes(payer))return 'family';
 return 'settle';
};
const modeOptions:[SettlementMode,string,string][]=[['settle','🔄 要結算','需要還款的份額會列入轉帳清單。'],['family','👪 家庭支付','靖宜、益萁、耘欣之間不互相算欠款。'],['host','🎁 我請客','其他人不用還款。'],['personal','👤 個人支付','這筆只算在一位旅客名下。']];

export default function Ledger({plan,update}:{plan:Plan;update:(p:Plan)=>void}){
 const [viewer,setViewer]=useState('益萁');
 const [form,setForm]=useState<Expense>(()=>blank());
 const [ownership,setOwnership]=useState<'mine'|'everyone'|'family'|'choose'>('mine');
 const [payerChoice,setPayerChoice]=useState<'self'|'jingyi'|'other'>('self');
 const [showPayers,setShowPayers]=useState(false);
 const [message,setMessage]=useState('');
 const [remove,setRemove]=useState('');
 const formElement=useRef<HTMLFormElement>(null);
 const entries=plan.expenses;
 const {totalCents,transfers,pendingCents,settledCents,familyPaid,familyCost,personalCost,personPaid,owes,receivable}=useMemo(()=>{
 const totalCents=entries.reduce((sum,e)=>sum+cents(e),0);
 const transfers=ledgerBalances(entries);
 const pendingCents=transfers.reduce((sum,item)=>sum+item.amount,0);
 const settledCents=Math.max(0,totalCents-pendingCents);
 const familyEntries=entries.filter(e=>expenseParticipants(e).some(p=>jingyiFamily.includes(p)));
 const familyPaid=familyEntries.filter(e=>jingyiFamily.includes(e.payer)).reduce((sum,e)=>sum+cents(e),0);
 const familyCost=familyEntries.reduce((sum,e)=>sum+Object.entries(expenseShares(e)).filter(([person])=>jingyiFamily.includes(person)).reduce((a,[,amount])=>a+amount,0),0);
 const costs=new Map<string,number>(),paid=new Map<string,number>(),owed=new Map<string,number>(),receivables=new Map<string,number>();
 for(const entry of entries){
  paid.set(entry.payer,(paid.get(entry.payer)||0)+cents(entry));
  for(const [person,amount] of Object.entries(expenseShares(entry)))costs.set(person,(costs.get(person)||0)+amount);
 }
 for(const transfer of transfers){owed.set(transfer.from,(owed.get(transfer.from)||0)+transfer.amount);receivables.set(transfer.to,(receivables.get(transfer.to)||0)+transfer.amount);}
 const personalCost=(name:string)=>costs.get(name)||0;
 const personPaid=(name:string)=>paid.get(name)||0;
 const owes=(name:string)=>owed.get(name)||0;
 const receivable=(name:string)=>receivables.get(name)||0;
 return {totalCents,transfers,pendingCents,settledCents,familyPaid,familyCost,personalCost,personPaid,owes,receivable};
 },[entries]);
 const field=<K extends keyof Expense>(key:K,value:Expense[K])=>setForm(previous=>({...previous,[key]:value,...(['amount','currency'].includes(key)?{confirmedTwd:undefined}:{}),...(key==='settlement'&&previous.settlement!==value?{settlementStatus:value==='settle'?'pending':'settled'}:{})}));

 useEffect(()=>{try{const name=localStorage.getItem('de-nl-ledger-person');if(name&&plan.travelers.includes(name)){setViewer(name);setForm(blank(name));}}catch{}},[plan.travelers]);

 function selectPerson(name:string){
  setViewer(name);setForm(blank(name));setOwnership('mine');setPayerChoice('self');setShowPayers(false);setMessage('');
  try{localStorage.setItem('de-nl-ledger-person',name);}catch{}
 }
 function chooseOwnership(value:'mine'|'everyone'|'family'|'choose'){
  setOwnership(value);
  const participants=value==='mine'?[viewer]:value==='everyone'?[...travelers]:value==='family'?[...jingyiFamily]:form.participants||[viewer];
  const mode=recommend(participants,form.payer,viewer);
  setForm(previous=>({...previous,participants,consumer:participants.length===1?participants[0]:'全組',scope:participants.length===1?'personal':'shared',settlement:mode,settlementStatus:mode==='settle'?'pending':'settled'}));
 }
 function chooseParticipants(name:string){
  const current=form.participants||[];
  const participants=current.includes(name)?current.filter(person=>person!==name):[...current,name];
  const safe=participants.length?participants:[viewer];
  const mode=recommend(safe,form.payer,viewer);
  setForm(previous=>({...previous,participants:safe,consumer:safe.length===1?safe[0]:'全組',scope:safe.length===1?'personal':'shared',settlement:mode,settlementStatus:mode==='settle'?'pending':'settled'}));
 }
 function choosePayer(choice:'self'|'jingyi'|'other'){
  setPayerChoice(choice);
  if(choice==='self'){setShowPayers(false);field('payer',viewer);return;}
  if(choice==='jingyi'){setShowPayers(false);field('payer','靖宜');return;}
  setShowPayers(true);
 }
 function setPayer(name:string){
  setShowPayers(false);field('payer',name);
  const participants=form.participants||[viewer];
  const mode=recommend(participants,name,viewer);
  setForm(previous=>({...previous,payer:name,settlement:previous.id?previous.settlement:mode,settlementStatus:previous.id?previous.settlementStatus:mode==='settle'?'pending':'settled'}));
 }
 function save(event:React.FormEvent){
  event.preventDefault();
  if(!form.detail.trim()||!Number.isFinite(form.amount)||form.amount<=0||form.amount>1e9){setMessage('請填寫項目與正確金額。');return;}
  const participants=form.participants?.length?form.participants:[viewer];
  const settlement= form.settlement||recommend(participants,form.payer,viewer);
  const item:Expense={...form,id:form.id||crypto.randomUUID(),category:categoryName(form.category),detail:form.detail.trim(),rate:defaultRates[form.currency],participants,settlement,settlementStatus:settlement==='settle'?(form.settlementStatus||'pending'):'settled',consumer:participants.length===1?participants[0]:'全組',scope:participants.length===1?'personal':'shared',owner:form.owner||viewer,status:form.status||'已付'};
  update({...plan,ledgerRevision:1,expenses:form.id?entries.map(row=>row.id===form.id?item:row):[...entries,item]});
  setForm(blank(viewer));setOwnership('mine');setPayerChoice('self');setMessage('已儲存，這筆帳目已記為已付。');
 }
 function edit(item:Expense){
  const participants=expenseParticipants(item),isMine=participants.length===1&&participants[0]===viewer;
  setForm({...item,participants,settlement:expenseSettlement(item)});
  setOwnership(isMine?'mine':participants.length===travelers.length?'everyone':participants.length===jingyiFamily.length&&jingyiFamily.every(person=>participants.includes(person))?'family':'choose');
  setPayerChoice(item.payer===viewer?'self':item.payer==='靖宜'&&viewer!=='靖宜'?'jingyi':'other');
  setShowPayers(false);formElement.current?.scrollIntoView({block:'start',behavior:'smooth'});
 }
 function canEdit(item:Expense){return (item.owner||(item.scope==='personal'?item.consumer:item.payer))===viewer;}
 function toggleSettlement(item:Expense){update({...plan,expenses:entries.map(row=>row.id===item.id?{...row,settlementStatus:row.settlementStatus==='settled'?'pending':'settled'}:row)});}
 function exportCsv(){
  const csvRows=[['日期','大項','項目','金額','幣別','約合台幣','付款人','費用歸屬','結算方式','付款狀態','備註'],...entries.map(e=>[e.date,categoryName(e.category),e.detail,e.amount,e.currency,asTwd(e),e.payer,expenseParticipants(e).join('、'),settlementName(expenseSettlement(e)),e.status,e.note])];
  const csv='\ufeff'+csvRows.map(row=>row.map(value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download=viewer+'-德荷旅行帳本.csv';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function groups(rows:Expense[]){
  return categories.filter(category=>rows.some(item=>categoryName(item.category)===category)).map(category=>{
   const categoryRows=rows.filter(item=>categoryName(item.category)===category);
   return <details className="j-card j-ledger-group" key={category}><summary><b>{categoryIcon(category)} {category}・{categoryRows.length} 筆</b><strong>{twdText(categoryRows.reduce((sum,item)=>sum+cents(item),0)/100)}</strong></summary>
    {categoryRows.map(item=>{
     const people=expenseParticipants(item),mode=expenseSettlement(item),isShared=people.length>1;
     return <article className="j-entry j-ledger-entry" key={item.id}><p className="j-muted">{item.date}</p><h4>{categoryIcon(item.category)} {item.detail}</h4>
      <p className="j-ledger-amount">{twdText(asTwd(item))}{item.currency!=='TWD'&&<span>　{item.currency} {money(item.amount)}</span>}</p>
      <p>費用歸屬：{isShared?`${people.length} 人共同${categoryName(item.category)==='住宿'?'住宿':'分攤'}（${people.join('、')}）`:`${people[0]}的旅費`}</p>
      <p>💳 {item.payer}付款{item.bookingId&&item.status!=='已付'?`・${item.status}`:'・已付'}</p>
      {isShared&&<p>平均每人約 {twdText(Math.round(asTwd(item)/people.length))}</p>}
      <p className="j-ledger-mode">{mode==='family'?'👪 家庭支付':mode==='host'?'🎁 付款人請客':mode==='personal'?'👤 個人支付':mode==='settle'&&item.settlementStatus==='settled'?'✅ 已完成結算':'🔄 需要結算'}</p>
      {item.note&&<p className="j-muted">{item.note}</p>}
      {canEdit(item)&&<div className="j-actions"><button type="button" onClick={()=>edit(item)}>編輯</button><button type="button" onClick={()=>setRemove(item.id)}>刪除</button>{mode==='settle'&&<button type="button" onClick={()=>toggleSettlement(item)}>{item.settlementStatus==='settled'?'恢復待結算':'標記已結清'}</button>}{remove===item.id&&<><span>刪除這筆？</span><button type="button" onClick={()=>{update({...plan,expenses:entries.filter(row=>row.id!==item.id)});setRemove('');}}>確認刪除</button><button type="button" onClick={()=>setRemove('')}>保留</button></>}</div>}
     </article>;
    })}
   </details>;
  });
 }
 const recommendedMode=recommend(form.participants||[viewer],form.payer,viewer);
 const amount=asTwd(form),shareCount=form.participants?.length||1;
 return <section className="j-ledger-page">
  <div className="j-section-heading"><h2>旅行記帳</h2><button type="button" onClick={exportCsv}>下載明細</button></div>
  <div className="j-ledger-viewer"><b>目前帳本</b><div className="j-ledger-people" role="group" aria-label="選擇目前帳本旅客">{travelers.map(person=><button type="button" key={person} aria-pressed={viewer===person} onClick={()=>selectPerson(person)}>{person}</button>)}</div></div>
  <form ref={formElement} className="j-card j-form j-ledger-form" onSubmit={save}>
   <h3>{form.id?'編輯帳目':'新增一筆'}</h3>
   <div className="j-grid"><label>金額<input required type="number" inputMode="decimal" min="0.01" max="1000000000" step="0.01" placeholder="輸入金額" value={form.amount||''} onChange={event=>field('amount',Number(event.target.value))}/></label><label>幣別<select value={form.currency} onChange={event=>field('currency',event.target.value)}>{[['EUR','歐元 EUR'],['TWD','台幣 TWD'],['CNY','人民幣 CNY'],['USD','美金 USD']].map(([currency,label])=><option key={currency} value={currency}>{label}</option>)}</select></label></div>
   <label>項目<input required maxLength={500} placeholder="例：科隆來回火車票" value={form.detail} onChange={event=>field('detail',event.target.value)}/></label>
   <div className="j-grid"><label>日期<input required type="date" value={form.date} onChange={event=>field('date',event.target.value)}/></label><label>大項<select value={categoryName(form.category)} onChange={event=>field('category',event.target.value)}>{categories.map((category,index)=><option key={category} value={category}>{icons[index]} {category}</option>)}</select></label></div>

   <fieldset className="j-ledger-question"><legend>這筆是誰的？</legend><div className="j-ledger-choice-grid"><button type="button" aria-pressed={ownership==='mine'} onClick={()=>chooseOwnership('mine')}>👤 我的消費</button><button type="button" aria-pressed={ownership==='everyone'} onClick={()=>chooseOwnership('everyone')}>👥 大家一起</button><button type="button" aria-pressed={ownership==='family'} onClick={()=>chooseOwnership('family')}>👨‍👩‍👧 靖宜家庭</button><button type="button" aria-pressed={ownership==='choose'} onClick={()=>chooseOwnership('choose')}>👥 選幾個人</button></div>
    {ownership==='choose'&&<div className="j-ledger-choice-grid j-ledger-travelers">{travelers.map(person=><button type="button" key={person} aria-pressed={form.participants?.includes(person)} onClick={()=>chooseParticipants(person)}>{form.participants?.includes(person)?'✓　':''}{person}</button>)}</div>}
    <p className="j-muted">{form.participants?.length||1} 人平均分攤；每人約 {twdText(Math.round(amount/shareCount))}</p>
   </fieldset>

   <fieldset className="j-ledger-question"><legend>💳 這筆錢是誰付的？</legend><div className="j-ledger-choice-grid">
    <button type="button" aria-pressed={payerChoice==='self'} onClick={()=>choosePayer('self')}>👤 我付款</button>
    {viewer==='益萁'||viewer==='耘欣'?<><button type="button" aria-pressed={payerChoice==='jingyi'} onClick={()=>choosePayer('jingyi')}>👩 靖宜幫我付</button><button type="button" aria-pressed={payerChoice==='other'} onClick={()=>choosePayer('other')}>🤝 其他人幫我付</button></>:<button type="button" aria-pressed={payerChoice==='other'} onClick={()=>choosePayer('other')}>🤝 別人幫我付款</button>}
   </div>{showPayers&&<div className="j-ledger-choice-grid j-ledger-travelers">{travelers.filter(person=>person!==viewer).map(person=><button key={person} type="button" aria-pressed={form.payer===person} onClick={()=>setPayer(person)}>{person}</button>)}</div>}<p className="j-muted">目前付款人：{form.payer}</p></fieldset>

   <fieldset className="j-ledger-question"><legend>這筆之後要算錢嗎？</legend><div className="j-ledger-mode-grid">{modeOptions.map(([mode,title,description])=><button type="button" key={mode} aria-pressed={form.settlement===mode} onClick={()=>field('settlement',mode)}><b>{title}</b><small>{description}</small></button>)}</div><p className="j-muted">系統建議：{settlementName(recommendedMode)}；你可以手動更改。</p></fieldset>
   <label>備註（可留白）<input value={form.note} maxLength={2000} placeholder="例：5 人份、刷卡" onChange={event=>field('note',event.target.value)}/></label>
   <p className="j-ledger-paid-note">新增帳目會直接記為已付。這筆約 {twdText(amount)}。</p><button className="j-primary" type="submit">{form.id?'儲存修改':'加進帳本'}</button>{form.id&&<button type="button" onClick={()=>{setForm(blank(viewer));setOwnership('mine');}}>取消編輯</button>}<p role="status">{message}</p>
  </form>

  <div className="j-ledger-overview"><div className="j-total"><span>💳 旅行總支出</span><strong>{twdText(totalCents/100)}</strong></div><div className="j-grid j-metrics"><article><span>✅ 已結算／免還款</span><strong>{twdText(settledCents/100)}</strong></article><article><span>🔄 待結算轉帳</span><strong>{twdText(pendingCents/100)}</strong></article></div></div>
  <article className="j-card j-ledger-card"><h3>🔄 最後要轉帳給誰</h3>{transfers.length?transfers.map(item=><div className="j-ledger-transfer" key={`${item.from}-${item.to}`}><b>{item.from}　→　{item.to}</b><strong>{twdText(item.amount/100)}</strong></div>):<p className="j-ledger-clear">✅ 目前沒有需要結算的款項</p>}</article>
  <article className="j-card j-ledger-card"><h3>👨‍👩‍👧 靖宜家庭</h3><p className="j-muted">靖宜・益萁・耘欣</p><div className="j-grid j-ledger-family-totals"><div><span>家庭已付款</span><strong>{twdText(familyPaid/100)}</strong></div><div><span>家庭旅費</span><strong>{twdText(familyCost/100)}</strong></div></div><p><b>費用歸屬</b></p>{jingyiFamily.map(person=><div className="j-ledger-person-row" key={person}><span>{person}</span><strong>{twdText(personalCost(person)/100)}</strong></div>)}<p className="j-ledger-clear">家庭內待結算：NT$0</p></article>
  <div className="j-grid j-ledger-individuals">{['靖枝','玉穎'].map(person=><article className="j-card j-ledger-card" key={person}><h3>{person}</h3><div className="j-ledger-person-row"><span>旅費</span><strong>{twdText(personalCost(person)/100)}</strong></div><div className="j-ledger-person-row"><span>已付款</span><strong>{twdText(personPaid(person)/100)}</strong></div><div className="j-ledger-person-row"><span>{owes(person)?'尚需支付':'應收回'}</span><strong>{twdText((owes(person)||receivable(person))/100)}</strong></div></article>)}</div>

  <h3>帳本明細</h3><p className="j-muted">付款人、費用歸屬與結算方式分開記錄。新增帳目預設已付，住宿既有扣款狀態會保留。</p>{entries.length?groups(entries):<p className="j-card">還沒有帳目。</p>}
 </section>;
}
