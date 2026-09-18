import type {Plan} from '@/lib/journey';

type RouteNode={
 label:string;
 dateLabel:string;
 dayIndex:number;
 segmentDayIndex?:number;
};

const shortDate=(date:string)=>date.slice(5).replace('-','/');
const destination=(city:string)=>city.split('→').pop()?.trim()||city.trim();

function segmentSummary(day:Plan['days'][number]){
 const travelLine=day.timeline.find(([,text])=>/(MU\d+|ICE|Intercity|Sprinter|火車|地鐵|巴士|機場聯絡線)/i.test(text))?.[1];
 const firstSentence=day.transport.split('。')[0]?.trim();
 let text=(travelLine||firstSentence||'移動').replace(/（.*?）/g,'').trim();
 if(text.length>46)text=text.slice(0,46)+'…';
 const duration=day.transport.match(/(?:約|留)\s*\d+(?:[–-]\d+)?\s*(?:分鐘|分|小時(?:\s*\d+\s*分)?)/)?.[0];
 if(duration&&!text.includes(duration))text+=' · '+duration;
 return text;
}

function segmentIcon(text:string){
 if(/MU\d+|起飛|航班|機場/i.test(text))return '✈';
 if(/ICE|Intercity|Sprinter|火車|鐵路|Hbf|Centraal/i.test(text))return '🚆';
 if(/巴士|公車|電車|地鐵|U\d+/i.test(text))return '🚋';
 return '↳';
}

export default function RouteOverview({plan,onSelect}:{plan:Plan;onSelect:(index:number)=>void}){
 const first=plan.days[0];
 const lastStay=plan.stays[plan.stays.length-1];
 const nodes:RouteNode[]=[];

 if(first){
  const firstStayDate=plan.stays[0]?.checkIn||first.date;
  nodes.push({
   label:destination(first.city)+(first.title.includes('會合')?'・會合':''),
   dateLabel:first.date===firstStayDate?shortDate(first.date):shortDate(first.date)+'–'+shortDate(firstStayDate),
   dayIndex:0
  });
 }

 for(const stay of plan.stays){
  const dayIndex=Math.max(0,plan.days.findIndex(d=>d.date===stay.checkIn));
  nodes.push({
   label:stay.city,
   dateLabel:shortDate(stay.checkIn)+'–'+shortDate(stay.checkOut),
   dayIndex,
   segmentDayIndex:dayIndex
  });
 }

 if(lastStay){
  const after=plan.days
   .map((day,index)=>({day,index}))
   .filter(({day})=>day.date>lastStay.checkOut);

  for(const {day,index} of after){
   const label=destination(day.city);
   if(nodes[nodes.length-1]?.label===label)continue;
   nodes.push({
    label,
    dateLabel:shortDate(day.date),
    dayIndex:index,
    segmentDayIndex:day.city.includes('→')?index:Math.max(0,index-1)
   });
  }
 }

 return <section className="j-route-card" aria-label="旅行路線">
  <div className="j-route-head">
   <span aria-hidden="true">⌘</span>
   <h3>旅行路線</h3>
  </div>
  <div className="j-route-line">
   {nodes.map((node,index)=>{
    const segmentDay=node.segmentDayIndex===undefined?null:plan.days[node.segmentDayIndex];
    const segment=segmentDay?segmentSummary(segmentDay):'';
    return <div className="j-route-stop" key={node.label+node.dateLabel}>
     <div className="j-route-marker" aria-hidden="true"><span className="j-route-dot"/>{index<nodes.length-1&&<span className="j-route-dash"/>}</div>
     <div className="j-route-copy">
      <button className="j-route-place" onClick={()=>onSelect(node.dayIndex)}>
       <strong>{node.label}</strong>
       <time>{node.dateLabel}</time>
      </button>
      {segment&&<p className="j-route-move"><span aria-hidden="true">{segmentIcon(segment)}</span>{segment}</p>}
     </div>
    </div>;
   })}
  </div>
  <p className="j-route-foot">點城市可直接跳到該段每日行程。</p>
 </section>;
}
