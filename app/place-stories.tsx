import type {Plan} from '@/lib/journey';
import Gallery from './gallery';

export default function PlaceStories({plan,date,city}:{plan:Plan;date:string;city:string}){
 const cityOrder=['dusseldorf','cologne','rotterdam','hague','gouda','amsterdam'];
 const stories=plan.stories.filter(s=>s.day===date.slice(-2)).sort((a,b)=>{
  const rank=(s:typeof a)=>cityOrder.includes(s.id)?cityOrder.indexOf(s.id):-1;
  return (rank(a)<0?99:rank(a))-(rank(b)<0?99:rank(b));
 });
 const covered=(name:string)=>stories.some(s=>s.aliases.some(a=>name.toLowerCase().includes(a.toLowerCase())));
 const extras=[
  ...plan.cityStories.filter(s=>s.date===date&&!covered(s.city)).map(s=>({name:'初到'+s.city,text:s.text})),
  ...plan.landmarks.filter(s=>s.day===date.slice(-2)&&!covered(s.name+' '+s.label)).map(s=>({name:s.label,text:s.intro})),
  ...plan.reference.foodLists.flatMap(c=>c.items).filter(f=>f.when.includes('11/'+date.slice(-2))&&!covered(f.name)).map(f=>({name:f.name,text:f.intro+' '+f.dish}))
 ];

 return <details className="j-card j-stories" aria-label={city+'故事與歷史'}>
  <summary>故事與歷史</summary>
  <div className="j-stories-content">
   {stories.map(s=><details className="j-place-story" key={s.id}>
    <summary><strong>{s.title}</strong></summary>
    <div className="j-story-body">
     <p>{s.summary}</p>
     {s.paragraphs.map((p,i)=>['歷史與故事','現今樣貌','品牌歷史與百年秘方'].includes(p)?<h4 key={i}>{p}</h4>:<p key={i}>{p}</p>)}
    </div>
   </details>)}
   {extras.map((s,i)=><details className="j-place-story" key={s.name+i}>
    <summary><strong>{s.name}</strong></summary>
    <div className="j-story-body"><p>{s.text}</p></div>
   </details>)}
   {date==='2026-11-21'&&<details className="j-place-story">
    <summary><strong>梵谷美術館・先認識這幾幅畫</strong><span>向日葵、杏花、吃馬鈴薯的人與臥室。</span></summary>
    <p>下列為館藏代表作，實際展出依借展與輪換安排。</p>
    <div className="j-food-grid">
     {plan.artworks.map(a=><article className="j-card" key={a.name}>
      <Gallery images={[a.image]} label={a.name}/>
      <h4>{a.name}</h4>
      <p>{a.intro}</p>
     </article>)}
    </div>
   </details>}
  </div>
 </details>;
}
