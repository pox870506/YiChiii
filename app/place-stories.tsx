import type {Plan} from '@/lib/journey';
import Gallery from './gallery';
import {extraStoryMedia,storyMedia,type StoryMediaItem} from '@/lib/story-media';

function resolvedMedia(plan:Plan,items:StoryMediaItem[]){
 return items.map(item=>({...item,src:item.src||(item.photoKey?plan.photos[item.photoKey]:'')})).filter(item=>Boolean(item.src));
}

function fallbackMedia(plan:Plan,day:string,title:string):StoryMediaItem[]{
 const keys=(plan.dayPhotos as Record<string,string[]>)[day]||[];
 const normalized=title.toLowerCase();
 const matched=keys.find(k=>{
  const key=k.toLowerCase();
  return normalized.includes(key)||key.includes(normalized)||key.split('・').some(part=>part.length>2&&normalized.includes(part));
 });
 const photoKey=matched||keys[0];
 return photoKey?[{photoKey,alt:title,caption:'當日行程相關影像'}]:[];
}

function StoryImages({plan,items,title}:{plan:Plan;items:StoryMediaItem[];title:string}){
 const media=resolvedMedia(plan,items);
 if(!media.length)return null;
 return <div className={'j-story-media-grid '+(media.length>1?'is-multiple':'')}>
  {media.map((item,i)=><figure className="j-story-media" key={(item.src||item.photoKey||title)+i}>
   <img src={item.src} alt={item.alt||title} loading="lazy" decoding="async"/>
   {(item.caption||item.credit)&&<figcaption>
    {item.caption&&<span>{item.caption}</span>}
    {item.credit&&(item.sourceUrl?<a href={item.sourceUrl} target="_blank" rel="noreferrer">Photo: {item.credit} ↗</a>:<small>Photo: {item.credit}</small>)}
   </figcaption>}
  </figure>)}
 </div>;
}

export default function PlaceStories({plan,date,city}:{plan:Plan;date:string;city:string}){
 const day=date.slice(-2);
 const stories=plan.stories.filter(s=>s.day===day).sort((a,b)=>{
  const cityOrder=['dusseldorf','cologne','rotterdam','hague','gouda','amsterdam'];
  const rank=(s:typeof a)=>cityOrder.includes(s.id)?cityOrder.indexOf(s.id):-1;
  return (rank(a)<0?99:rank(a))-(rank(b)<0?99:rank(b));
 });
 const covered=(name:string)=>stories.some(s=>s.aliases.some(a=>name.toLowerCase().includes(a.toLowerCase())));
 const extras=[
  ...plan.cityStories.filter(s=>s.date===date&&!covered(s.city)).map(s=>({key:s.city,name:'初到'+s.city,text:s.text,media:extraStoryMedia[s.city]||[]})),
  ...plan.landmarks.filter(s=>s.day===day&&!covered(s.name+' '+s.label)).map(s=>({key:s.name,name:s.label,text:s.intro,media:extraStoryMedia[s.name]||extraStoryMedia[s.label]||[]})),
  ...plan.reference.foodLists.flatMap(c=>c.items).filter(f=>f.when.includes('11/'+day)&&!covered(f.name)).map(f=>({
   key:f.name,
   name:f.name,
   text:f.intro+' '+f.dish,
   media:(f.images?.length?f.images:[f.image]).filter(Boolean).map(src=>({src,alt:f.name,caption:f.dish}))
  }))
 ];

 return <details className="j-card j-stories" aria-label={city+'故事與歷史'}>
  <summary>故事與歷史</summary>
  <div className="j-stories-content">
   {stories.map(s=>{
    const media=storyMedia[s.id]?.length?storyMedia[s.id]:fallbackMedia(plan,day,s.title);
    return <details className="j-place-story" key={s.id}>
     <summary><strong>{s.title}</strong><span>{s.summary}</span></summary>
     <div className="j-story-body">
      <StoryImages plan={plan} items={media} title={s.title}/>
      <p className="j-story-lede">{s.summary}</p>
      <div className="j-story-copy">
       {s.paragraphs.map((p,i)=>['歷史與故事','現今樣貌','品牌歷史與百年秘方'].includes(p)?<h4 key={i}>{p}</h4>:<p key={i}>{p}</p>)}
      </div>
     </div>
    </details>;
   })}
   {extras.map((s,i)=>{
    const media=s.media.length?s.media:fallbackMedia(plan,day,s.name);
    return <details className="j-place-story" key={s.key+i}>
     <summary><strong>{s.name}</strong></summary>
     <div className="j-story-body">
      <StoryImages plan={plan} items={media} title={s.name}/>
      <div className="j-story-copy"><p>{s.text}</p></div>
     </div>
    </details>;
   })}
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
