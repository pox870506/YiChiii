export const climate = [
 {area:'阿姆斯特丹',station:'Schiphol 站',temperature:'平均 7.4°C；平均低溫 4.5°C／高溫 10.0°C',rainMm:85.3,wetDays:19.1,rainDays:13.4,url:'https://cdn.knmi.nl/knmi/map/page/klimatologie/klimaatatlas/tabel/stationsdata/klimtab_9120_240.pdf'},
 {area:'鹿特丹',station:'Rotterdam 站',temperature:'平均 7.5°C；平均低溫 4.4°C／高溫 10.2°C',rainMm:87.6,wetDays:18.9,rainDays:13.9,url:'https://cdn.knmi.nl/knmi/map/page/klimatologie/klimaatatlas/tabel/stationsdata/klimtab_9120_344.pdf'}
];
export const weatherNotes=[
 '以上是 KNMI 1991–2020 年的 11 月平均，不是 2026/11/17–23 的逐日預報。將月平均降水日數除以 30，可估計歷年任選一天出現降水的比例：≥0.1 mm 約 63–64%；≥1 mm 約 45–46%。海牙以鄰近鹿特丹作區域參考，不是假裝有海牙測站數據。',
 '「六成多日子有降水」不表示六成時間都在下雨，也不表示整天下雨。Schiphol 與 Rotterdam 的月平均降水時數約 74–77 小時，約佔整月 10–11%；可能集中在幾段連續陰雨，也可能是陣雨間歇。',
 '海洋性氣候：天氣轉換快，常見毛毛雨、鋒面持續雨與海上移入的陣雨。KNMI 說明典型單次陣雨常少於一小時，但連成片時可持續較久；秋季北海仍較暖，冷濕空氣經過容易形成沿海陣雨。',
 '風比雨量更影響體感：海牙海邊、鹿特丹橋面與風車村缺乏遮蔽，遇風雨會明顯濕冷。低溫或寒流時可能接近 0°C，偶有濕雪／霰；平均高低溫不是保證範圍。11 月日照短，戶外活動優先排 10:00–15:30。',
 '穿著採三層：排汗內層＋刷毛或薄羽絨保暖層＋有帽、防風防水外套；長褲、止滑防水步行鞋、替換襪子、圍巾與薄手套。進館或上車可脫保暖層，避免流汗後吹風。',
 '小折傘只當輔助，強風改戴帽雨衣；背包套與手機防水袋實用。每天帶乾襪，鞋子濕了先回住處更換。不要穿新鞋走整天。',
 '出發前 7–10 天看 KNMI 趨勢，前 48 小時確認降雨與陣風，出門前再看 Buienradar 雨雷達。小陣雨先進咖啡店等 20–40 分鐘；持續風雨就用下方城市室內路線。有強風警報時取消海邊、橋上與風車村長走。'
];
export const weatherLinks=[['KNMI 陣雨說明','https://www.knmi.nl/kennis-en-datacentrum/uitleg/buien'],['KNMI 天氣與警報','https://www.knmi.nl/nederland-nu/weer/verwachtingen'],['Buienradar 雨雷達','https://www.buienradar.nl/']];
export function weatherMarkdown(){return ['## 荷蘭 11 月氣候與穿著',...climate.map(c=>`${c.area}（${c.station}）：${c.temperature}；月雨量 ${c.rainMm} mm；≥0.1 mm 降水 ${c.wetDays} 天（約 ${Math.round(c.wetDays/30*100)}%）；≥1 mm ${c.rainDays} 天（約 ${Math.round(c.rainDays/30*100)}%）。[KNMI](${c.url})`),...weatherNotes,...weatherLinks.map(([n,u])=>`[${n}](${u})`)].join('\n\n');}
