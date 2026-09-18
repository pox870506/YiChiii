import type {Plan} from '@/lib/journey';

function matchPhoto(plan:Plan,day:string,title:string,aliases:string[]){
 const names=(plan.dayPhotos as Record<string,string[]>)[day]||[];
 const hay=[title,...aliases].join(' ').toLowerCase();
 const exact=names.find(n=>hay.includes(n.toLowerCase())||n.toLowerCase().split('・').some(p=>p.length>2&&hay.includes(p)));
 return exact?plan.photos[exact]:'';
}

function matchTimeline(plan:Plan,date:string,title:string,aliases:string[]){
 const day=plan.days.find(d=>d.date===date);
 if(!day)return null;
 const needles=[title,...aliases].map(x=>x.toLowerCase());
 return day.timeline.find(([,text])=>needles.some(n=>text.toLowerCase().includes(n)||n.includes(text.toLowerCase().replace(/（.*?）/g,''))))||null;
}

export default function PlaceStories({plan,date,city}:{plan:Plan;date:string;city:string}){
 const day=date.slice(-2);
 const stories=plan.stories.filter(s=>s.day===day);
 const covered=(name:string)=>stories.some(s=>s.aliases.some(a=>name.toLowerCase().includes(a.toLowerCase())));
 const extras=plan.landmarks
  .filter(s=>s.day===day&&!covered(s.name+' '+s.label))
  .map(s=>({id:'landmark-'+s.name,title:s.label,summary:s.intro,aliases:[s.name,s.label],paragraphs:[s.intro]}));
 const cards=[...stories,...extras];

 if(!cards.length)return null;

 return <section className="j-attractions" aria-label={city+'景點'}>
  <div className="j-attractions-heading"><span aria-hidden="true">🏛️</span><h3>景點</h3></div>
  {cards.map(s=>{
   const photo=matchPhoto(plan,day,s.title,s.aliases);
   const timing=matchTimeline(plan,date,s.title,s.aliases);
   return <article className="j-attraction-card" key={s.id}>
    {photo&&<img className="j-attraction-photo" src={photo} alt={s.title}/>}
    <div className="j-attraction-main">
     <h4>{s.title}</h4>
     <p className="j-attraction-sub">{s.summary}</p>
     <div className="j-attraction-pills">
      {timing&&<span>◷ {timing[0]}</span>}
      {timing&&/(ICE|Intercity|Sprinter|巴士|電車|地鐵|步行)/i.test(timing[1])&&<span>🚋 {timing[1]}</span>}
     </div>
    </div>
    <details className="j-attraction-detail">
     <summary>📖 詳細介紹 <span aria-hidden="true">▼</span></summary>
     <div className="j-attraction-story">
      {s.paragraphs.map((p,i)=>['歷史與故事','現今樣貌','品牌歷史與百年秘方'].includes(p)?<h5 key={i}>{p}</h5>:<p key={i}>{p}</p>)}
     </div>
    </details>
   </article>;
  })}
 </section>;
}
