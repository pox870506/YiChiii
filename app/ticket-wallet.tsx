'use client';
import {useEffect,useState} from 'react';
import Gallery from './gallery';

const categories=[['flights','✈️','機票'],['rail','🚆','火車與跨國交通'],['local','🚋','市區交通'],['admission','🎟️','景點與展覽門票'],['other','📄','其他交通與憑證']] as const;
type Category=typeof categories[number][0];
type Receipt={id:string;category:Category;name:string;blob:Blob};
type ImageReceipt=Omit<Receipt,'blob'>&{src:string};
const seed:ImageReceipt[]=[
 {id:'air-yuying',category:'flights',name:'玉穎｜NT$27,117・玉穎付款',src:'/tickets/flight-yuying.png'},
 {id:'air-yichi',category:'flights',name:'益萁｜NT$31,132・靖宜付款',src:'/tickets/flight-yichi.png'},
 {id:'air-group',category:'flights',name:'耘欣、靖宜、靖枝｜NT$81,351・靖宜付款',src:'/tickets/flight-group.png'},
];
function openDb():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open('de-nl-ticket-wallet-2026',1);req.onupgradeneeded=()=>req.result.createObjectStore('receipts',{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function readReceipts():Promise<Receipt[]>{const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction('receipts','readonly');const req=tx.objectStore('receipts').getAll();tx.oncomplete=()=>{db.close();resolve(req.result);};tx.onabort=()=>{db.close();reject(tx.error);};});}
async function saveReceipts(items:Receipt[]){const db=await openDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction('receipts','readwrite');for(const item of items)tx.objectStore('receipts').put(item);tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>{db.close();reject(tx.error);};});}
async function deleteReceipt(id:string){const db=await openDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction('receipts','readwrite');tx.objectStore('receipts').delete(id);tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>{db.close();reject(tx.error);};});}

export default function TicketWallet(){
 const [records,setRecords]=useState<Receipt[]>([]),[images,setImages]=useState<ImageReceipt[]>([]),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[remove,setRemove]=useState('');
 useEffect(()=>{let active=true;readReceipts().then(rows=>{if(active){setRecords(rows);setReady(true);}}).catch(()=>{if(active)setMessage('無法開啟圖片儲存空間，請允許瀏覽器儲存資料後重新整理。');});return()=>{active=false;};},[]);
 useEffect(()=>{const next=records.map(({blob,...item})=>({...item,src:URL.createObjectURL(blob)}));setImages(next);return()=>next.forEach(item=>URL.revokeObjectURL(item.src));},[records]);
 async function upload(category:Category,files:File[]){
  if(!files.length)return;
  if(files.some(f=>!['image/png','image/jpeg','image/webp','image/avif'].includes(f.type)||f.size>20*1024*1024)){setMessage('請選 PNG、JPG、WebP 或 AVIF 圖片，每張最多 20 MB。');return;}
  setBusy(true);setMessage('正在儲存圖片…');
  try{const added=files.map(blob=>({id:crypto.randomUUID(),category,name:blob.name.replace(/\.[^.]+$/,''),blob}));await saveReceipts(added);setRecords(prev=>[...prev,...added]);setMessage(`已新增 ${added.length} 張明細，點圖片可放大。`);}catch{setMessage('圖片未儲存，可能是瀏覽器空間不足；請保留原始截圖後再試。');}finally{setBusy(false);}
 }
 async function removeImage(id:string){try{await deleteReceipt(id);setRecords(prev=>prev.filter(x=>x.id!==id));setRemove('');setMessage('已刪除此張圖片。');}catch{setMessage('刪除失敗，請再試一次。');}}
 return <section className="j-ticket-wallet" aria-label="票券與電子明細">
  <p className="j-note">點開分類查看票券；點圖片可放大，也可以加入新的電子明細截圖。</p>
  {categories.map(([id,icon,label])=>{const items=[...seed,...images].filter(x=>x.category===id);return <details className="j-card j-ticket-category" key={id}>
   <summary><span>{icon} {label}</span><span>{items.length} 張 <span aria-hidden="true">⌄</span></span></summary>
   <div className="j-ticket-content">
    {items.length?items.map(item=><article className="j-ticket-item" key={item.id}><h4>{item.name}</h4><Gallery images={[item.src]} label={item.name} showCaption={false}/><div className="j-actions"><a className="j-link" href={item.src} download={item.name}>下載圖片</a>{!seed.some(s=>s.id===item.id)&&<>{remove===item.id?<><span>刪除這張明細？</span><button onClick={()=>removeImage(item.id)}>確認刪除</button><button onClick={()=>setRemove('')}>保留</button></>:<button onClick={()=>setRemove(item.id)}>刪除</button>}</>}</div></article>):<p className="j-muted">還沒有明細，訂好後可以把截圖放在這裡。</p>}
    <label className="j-ticket-upload">＋ 新增{label}截圖<input aria-label={`新增${label}截圖`} type="file" accept="image/png,image/jpeg,image/webp,image/avif" multiple disabled={!ready||busy} onChange={e=>{const files=Array.from(e.currentTarget.files||[]);e.currentTarget.value='';void upload(id,files);}}/></label>
   </div>
  </details>;})}
  <p role="status">{message}</p><p className="j-muted">自行新增的圖片只儲存在這台裝置的瀏覽器，不會自動同步給其他家人；請保留原始檔案。新增截圖不會自動新增帳目，已入帳的機票不用再記一次。</p>
 </section>;
}
