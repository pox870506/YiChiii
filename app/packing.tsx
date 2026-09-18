'use client';
import {useMemo,useState} from 'react';
import {Backpack,Droplets,Package,Pill,Shirt,Smartphone,WalletCards,type LucideIcon} from 'lucide-react';
import {type Plan} from '@/lib/journey';

const categoryIcons:Record<string,LucideIcon>={
 '衣物':Shirt,
 '證件與金錢':WalletCards,
 '電子用品':Smartphone,
 '盥洗保養':Droplets,
 '藥品':Pill,
 '隨身用品':Backpack,
 '其他':Package
};

function PackingIcon({category}:{category:string}){
 const Icon=categoryIcons[category]||Package;
 return <span className="j-pack-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8}/></span>;
}

export default function Packing({plan,update}:{plan:Plan;update:(p:Plan)=>void}){
 const categories=useMemo(()=>[...new Set(plan.packing.map(x=>x.category))],[plan.packing]);
 const [category,setCategory]=useState(categories[0]||'衣物');
 const [name,setName]=useState('');
 const [removed,setRemoved]=useState<Plan['packing'][number]|null>(null);
 const done=plan.packing.filter(x=>x.done).length;

 return <section>
  <p className="j-kicker">PACK LIGHT, TRAVEL WELL</p>
  <h2>行李</h2>
  <div className="j-pack-summary">
   <div><strong>{done}／{plan.packing.length}</strong><span> 件已準備</span></div>
   <progress max={plan.packing.length||1} value={done}/>
  </div>

  <form className="j-card j-form" onSubmit={e=>{
   e.preventDefault();
   if(name.trim()&&category.trim()){
    update({...plan,packing:[...plan.packing,{id:crypto.randomUUID(),category:category.trim(),name:name.trim(),done:false}]});
    setName('');
   }
  }}>
   <div className="j-grid">
    <label>分類
     <select value={category} required onChange={e=>setCategory(e.target.value)}>
      {[...new Set(['衣物','證件與金錢','電子用品','盥洗保養','藥品','隨身用品','其他',...plan.packing.map(x=>x.category)])].map(c=><option key={c}>{c}</option>)}
     </select>
    </label>
    <label>新增物品
     <input required maxLength={300} value={name} onChange={e=>setName(e.target.value)} placeholder="例：備用眼鏡"/>
    </label>
   </div>
   <button className="j-primary">加入行李清單</button>
  </form>

  {removed&&<p role="status">已刪除 {removed.name} <button onClick={()=>{update({...plan,packing:[...plan.packing,removed]});setRemoved(null);}}>復原</button></p>}

  <div className="j-pack-groups">
   {categories.map(c=>{
    const items=plan.packing.filter(x=>x.category===c);
    const completed=items.filter(x=>x.done).length;
    return <details className="j-card j-pack-group" key={c}>
     <summary>
      <PackingIcon category={c}/>
      <span className="j-pack-title">{c}</span>
      <span className="j-pack-count">{completed}/{items.length}</span>
      <span className="j-pack-chevron" aria-hidden="true">›</span>
     </summary>
     <div className="j-pack-progress"><progress max={items.length||1} value={completed}/></div>
     <div className="j-pack-items">
      {items.map(x=><div className="j-pack-row" key={x.id}>
       <label>
        <input type="checkbox" checked={x.done} onChange={e=>update({...plan,packing:plan.packing.map(y=>y.id===x.id?{...y,done:e.target.checked}:y)})}/>
        <span className={x.done?'j-done':''}>{x.name}</span>
       </label>
       <button className="j-delete" aria-label={`刪除 ${x.name}`} onClick={()=>{setRemoved(x);update({...plan,packing:plan.packing.filter(y=>y.id!==x.id)});}}>刪除</button>
      </div>)}
     </div>
    </details>;
   })}
  </div>
  {!plan.packing.length&&<p>清單已清空，可以自由加入需要的物品。</p>}
 </section>;
}
