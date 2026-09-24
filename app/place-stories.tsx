import {useState,type ComponentProps, type ReactNode} from 'react';
import type {Plan} from '@/lib/journey';
import Gallery from './gallery';
import {extraStoryMedia,storyMedia,type StoryMediaItem} from '@/lib/story-media';

const hiddenStoryIds=new Set(['carrousel']);

// Keep opened content mounted (including its photo index), but do not create
// hidden galleries and observers before the reader opens their story.
function StoryDetails({summary,renderContent,...props}:Omit<ComponentProps<'details'>,'children'>&{summary:ReactNode;renderContent:()=>ReactNode}){
 const [visited,setVisited]=useState(false);
 return <details {...props} onToggle={event=>{if(event.target===event.currentTarget&&event.currentTarget.open)setVisited(true);}}>{summary}{visited&&renderContent()}</details>;
}

function resolvedMedia(plan:Plan,items:StoryMediaItem[]){
 return items
  .map(item=>({...item,src:item.src||(item.photoKey?plan.photos[item.photoKey]:'')}))
  .filter(item=>Boolean(item.src))
  .slice(0,5);
}

function fallbackMedia(plan:Plan,day:string,title:string):StoryMediaItem[]{
 const keys=(plan.dayPhotos as Record<string,string[]>)[day]||[];
 const normalized=title.toLowerCase();
 const ordered=[...keys].sort((a,b)=>{
  const score=(key:string)=>{
   const k=key.toLowerCase();
   return normalized.includes(k)||k.includes(normalized)||k.split('・').some(part=>part.length>2&&normalized.includes(part))?1:0;
  };
  return score(b)-score(a);
 });
 return ordered.slice(0,3).map(photoKey=>({photoKey,alt:title}));
}

function StoryImages({plan,items,title}:{plan:Plan;items:StoryMediaItem[];title:string}){
 const media=resolvedMedia(plan,items);
 if(!media.length)return null;
 return <div className={'j-story-media-grid '+(media.length>1?'is-multiple':'')}>
  {media.map((item,i)=><figure className="j-story-media" key={(item.src||item.photoKey||title)+i}>
   <Gallery images={[item.src]} label={item.alt||title} showCaption={false}/>
   {item.caption&&<figcaption><span>{item.caption}</span></figcaption>}
  </figure>)}
 </div>;
}

export default function PlaceStories({plan,date,city}:{plan:Plan;date:string;city:string}){
 const day=date.slice(-2);
 const stories=plan.stories
  .filter(s=>s.day===day&&!hiddenStoryIds.has(s.id))
  .sort((a,b)=>{
   const cityOrder=['dusseldorf','cologne','rotterdam','hague','gouda','amsterdam'];
   const rank=(s:typeof a)=>cityOrder.includes(s.id)?cityOrder.indexOf(s.id):-1;
   return (rank(a)<0?99:rank(a))-(rank(b)<0?99:rank(b));
  });
 const covered=(name:string)=>stories.some(s=>s.aliases.some(a=>name.toLowerCase().includes(a.toLowerCase())));
 const extras=[
  ...plan.cityStories.filter(s=>s.date===date&&!covered(s.city)).map(s=>({key:s.city,name:'初到'+s.city,text:s.text,media:extraStoryMedia[s.city]||[]})),
  ...plan.landmarks.filter(s=>s.day===day&&!covered(s.name+' '+s.label)).map(s=>({key:s.name,name:s.label,text:s.intro,media:extraStoryMedia[s.name]||extraStoryMedia[s.label]||[]}))
 ];

 if(!stories.length&&!extras.length&&date!=='2026-11-21')return null;

 return <StoryDetails className="j-card j-stories" aria-label={city+'故事與歷史'} summary={<summary>📖 故事與歷史</summary>} renderContent={()=> <>
  <div className="j-stories-content">
   {stories.map(s=>{
    return <StoryDetails className="j-place-story" key={s.id} summary={<summary><strong>{s.title}</strong><span>{s.summary}</span></summary>} renderContent={()=>{
     const media=storyMedia[s.id]?.length?storyMedia[s.id]:fallbackMedia(plan,day,s.title);
     return <>
     <div className="j-story-body">
      <StoryImages plan={plan} items={media} title={s.title}/>
      <p className="j-story-lede">{s.summary}</p>
      <div className="j-story-copy">
       {s.paragraphs.map((p,i)=>['歷史與故事','現今樣貌','品牌歷史與百年秘方'].includes(p)?<h4 key={i}>{p}</h4>:<p key={i}>{p}</p>)}
      </div>
     </div>
     </>;
    }}/>
   })}
   {extras.map((s,i)=>{
    return <StoryDetails className="j-place-story" key={s.key+i} summary={<summary><strong>{s.name}</strong></summary>} renderContent={()=>{
     const media=s.media.length?s.media:fallbackMedia(plan,day,s.name);
     return <>
     <div className="j-story-body">
      <StoryImages plan={plan} items={media} title={s.name}/>
      <div className="j-story-copy"><p>{s.text}</p></div>
     </div>
     </>;
    }}/>
   })}
   {date==='2026-11-21'&&<StoryDetails className="j-place-story" summary={<summary><strong>梵谷美術館・先認識這幾幅畫</strong><span>向日葵、杏花、吃馬鈴薯的人與臥室。</span></summary>} renderContent={()=> <>
    <p>下列為館藏代表作，實際展出依借展與輪換安排。</p>
    <div className="j-food-grid">
     {plan.artworks.map(a=><article className="j-card" key={a.name}>
      <Gallery images={[a.image]} label={a.name}/>
      <h4>{a.name}</h4>
      <p>{a.intro}</p>
     </article>)}
    </div>
   </>}/>}
  </div>
 </>}/>;
}
