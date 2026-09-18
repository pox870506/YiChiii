type TransportFlowProps={
 transport:string;
 transportSteps?:string[];
 ticketingSteps?:string[];
 ticketingNote?:string;
};

function transportIcon(text:string){
 const t=text.toLowerCase();
 if(/mu\d+|航班|起飛|機場|airport|schiphol/.test(t))return '✈️';
 if(/ice|intercity|sprinter|火車|列車|鐵路|hbf|centraal|bahn|ns /.test(t))return '🚆';
 if(/纜車|seilbahn/.test(t))return '🚡';
 if(/地鐵|metro|u78|u-bahn/.test(t))return '🚇';
 if(/電車|tram/.test(t))return '🚋';
 if(/巴士|公車|bus/.test(t))return '🚌';
 if(/步行|走路|徒歩/.test(t))return '🚶';
 if(/計程車|叫車|taxi|大車/.test(t))return '🚕';
 if(/行李/.test(t))return '🧳';
 if(/換車|轉乘|transfer/.test(t))return '🔁';
 return '📍';
}

function ticketIcon(text:string){
 const t=text.toLowerCase();
 if(/ovpay|感應卡|信用卡|同一張卡|刷卡|支付寶|微信/.test(t))return '💳';
 if(/app|網站|官網|線上|9292|gvb|db|ns /.test(t))return '📱';
 if(/預約|訂位|預訂|時段/.test(t))return '🗓️';
 if(/附加票|toeslag|supplement/.test(t))return '➕';
 if(/票價|車票|售票|買票|購票|ticket/.test(t))return '🎟️';
 if(/退稅|tax refund/.test(t))return '🧾';
 if(/護照|登機證/.test(t))return '🪪';
 return '✅';
}

function FlowList({items,kind}:{items:string[];kind:'transport'|'ticket'}){
 return <ol className="j-icon-flow">
  {items.map((step,i)=>{
   const icon=kind==='transport'?transportIcon(step):ticketIcon(step);
   return <li className="j-icon-flow-step" key={i}>
    <div className="j-flow-rail" aria-hidden="true">
     <span className="j-flow-icon">{icon}</span>
     {i<items.length-1&&<span className="j-flow-line"/>}
    </div>
    <div className="j-flow-copy">
     <small>{String(i+1).padStart(2,'0')}</small>
     <p>{step}</p>
    </div>
   </li>;
  })}
 </ol>;
}

export default function TransportFlow({transport,transportSteps=[],ticketingSteps=[],ticketingNote}:TransportFlowProps){
 return <details className="j-card j-transport-card">
  <summary>🚆 交通與購票</summary>
  {transport&&<p className="j-transport-summary">{transport}</p>}

  {transportSteps.length>0&&<section className="j-flow-section" aria-label="交通流程">
   <h4>🧭 交通流程</h4>
   <FlowList items={transportSteps} kind="transport"/>
  </section>}

  {ticketingSteps.length>0&&<section className="j-flow-section" aria-label="購票流程">
   <h4>🎟️ 購票流程</h4>
   <FlowList items={ticketingSteps} kind="ticket"/>
  </section>}

  {ticketingNote&&<p className="j-ticket-note">💡 {ticketingNote}</p>}
 </details>;
}
