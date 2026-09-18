import type {Plan} from '@/lib/journey';

type RouteNode={label:string;dateLabel:string;dayIndex:number;segmentDayIndex?:number};

const shortDate=(date:string)=>date.slice(5).replace('-','/');
const clean=(city:string)=>city.replace(/一日遊/g,'').trim();

function segmentSummary(day:Plan['days'][number]){
 const travelLine=day.timeline.find(([,text])=>/(MU\d+|ICE|Intercity|Sprinter|火車|地鐵|巴士|電車|機場聯絡線|出發)/i.test(text))?.[1];
 const firstSentence=day.transport.split('。')[0]?.trim();
 let text=(travelLine||firstSentence||'移動').replace(/（.*?）/g,'').trim();
 if(text.length>46)text=text.slice(0,46)+'…';
 return text;
}

function segmentIcon(text:string){
 if(/MU\d+|起飛|航班|機場/i.test(text))return '✈';
 if(/ICE|Intercity|Sprinter|火車|鐵路|Hbf|Centraal/i.test(text))return '🚆';
 if(/巴士|公車|電車|地鐵|U\d+/i.test(text))return '🚋';
 return '↳';
}

function buildNodes(plan:Plan){
 const preferred=plan.days
  .map((day,index)=>({day,index}))
  .filter(({day,index})=>{
   if(index===0||index===plan.days.length-1)return true;
   if(day.city.includes('→'))return true;
   if(/科隆|海牙|豪達|贊斯|鹿特丹|阿姆斯特丹|杜塞道夫/.test(day.city)){
    const prev=plan.days[index-1]?.city;
    return prev!==day.city||/一日遊|海牙|豪達|贊斯/.test(day.city);
   }
   return false;
  });

 const nodes:RouteNode[]=[];
 for(const {day,index} of preferred){
  const label=clean(day.city);
  if(nodes[nodes.length-1]?.label===label)continue;
  nodes.push({label,dateLabel:shortDate(day.date),dayIndex:index,segmentDayIndex:index});
 }

 // Extend multi-day bases into date ranges without hiding side trips.
 for(const node of nodes){
  const stay=plan.stays.find(s=>node.label.includes(s.city));
  if(stay)node.dateLabel=shortDate(stay.checkIn)+'–'+shortDate(stay.checkOut);
 }
 return nodes;
}

export default function RouteOverview({plan,onSelect}:{plan:Plan;onSelect:(index:number)=>void}){
 const nodes=buildNodes(plan);
 return <section className="j-route-card" aria-label="旅行路線">
  <div className="j-route-head"><span aria-hidden="true">⌘</span><h3>旅行路線</h3></div>
  <div className="j-route-line">
   {nodes.map((node,index)=>{
    const segmentDay=node.segmentDayIndex===undefined?null:plan.days[node.segmentDayIndex];
    const segment=index===0?'':segmentDay?segmentSummary(segmentDay):'';
    return <div className="j-route-stop" key={node.label+node.dateLabel}>
     <div className="j-route-marker" aria-hidden="true"><span className="j-route-dot"/>{index<nodes.length-1&&<span className="j-route-dash"/>}</div>
     <div className="j-route-copy">
      <button className="j-route-place" onClick={()=>onSelect(node.dayIndex)}>
       <strong>{node.label}</strong><time>{node.dateLabel}</time>
      </button>
      {segment&&<p className="j-route-move"><span aria-hidden="true">{segmentIcon(segment)}</span>{segment}</p>}
     </div>
    </div>;
   })}
  </div>
  <p className="j-route-foot">點城市可直接跳到該段每日行程。</p>
 </section>;
}
