from pathlib import Path
p=Path('lib/trip.ts')
s=p.read_text(encoding='utf-8')
a=s.index("{date:'2026-11-17'")
b=s.index("{date:'2026-11-19'",a)
s=s[:a]+"""{date:'2026-11-17',city:'杜塞道夫 → 鹿特丹',title:'MEDICA 第二天，傍晚前往鹿特丹',stay:'鹿特丹',morning:'退房並寄放行李，按展場開門時間入場。優先回訪重要展商與預約會面。',afternoon:'約 14:30 結束參展，回住宿取行李後前往 Düsseldorf Hbf；目標搭 16:00 左右列車。此日無法安排完整下午參展。',evening:'規劃約 20:00–21:00 抵鹿特丹並入住。選可晚到入住的住宿，事先確認取鑰匙方式；不安排景點。',transport:'展場 → U78／U79 回市區取行李 → Düsseldorf Hbf → Utrecht Centraal → Rotterdam Centraal。跨國段估 3–4 小時，含緩衝留 4–5 小時；16:00 為規劃目標、非已確認班次。購票前查 11/17 實際車次與後續備援，不要押末班車。',food:'展場午餐；取行李後買可上車的簡餐，抵達後只安排輕食。',rain:'參展與搭車為主，預留行李移動緩衝。',sources:['medica','messe','cross']},
{date:'2026-11-18',city:'鹿特丹',title:'建築、市場與港口完整一日',stay:'鹿特丹',morning:'10:00 慢慢出門，Markthal 拱廊市場 → 方塊屋外觀 → Oude Haven，步調以散步為主。',afternoon:'午餐後往 Erasmusbrug 河岸與 Kop van Zuid；天氣好可選港口遊船（船期與票價待查），不再塞遠郊。',evening:'River Bar 列河畔晚餐候選，先確認營業及訂位；或 Witte de Withstraat 周邊自由選餐。',transport:'鹿特丹市區步行＋RET 地鐵／電車；Blaak 周邊景點集中，分區間預留 15–30 分。河岸風大可直接搭車，住宿門到門路線待地址補入。',food:'Markthal 試炸魚塊 kibbeling、薯條或起司；River Bar 為 Threads 原文推薦候選。',rain:'以 Markthal 室內與方塊屋周邊為主，取消河岸長走與遊船，改室內咖啡館。',sources:['thread-river','ns']},
"""+s[b:]
s=s.replace("checkOut:'2026-11-18'","checkOut:'2026-11-17'").replace("checkIn:'2026-11-18'","checkIn:'2026-11-17'")
s=s.replace("'德國基地由附件法蘭克福調整為杜塞道夫，是為參展所做的規劃建議；住宿未訂。'","'依最新要求：杜塞道夫 11/13–11/17 共 4 晚；11/17 晚起住鹿特丹至 11/20 共 3 晚；阿姆斯特丹 3 晚。11/17 需提早離開催展場，住宿未訂。'")
p.write_text(s,encoding='utf-8')
p=Path('app/page.tsx');s=p.read_text(encoding='utf-8').replace('杜塞道夫 <small>5 晚','杜塞道夫 <small>4 晚').replace('鹿特丹 <small>2 晚','鹿特丹 <small>3 晚').replace('11/18 跨國火車','11/17 傍晚跨國火車');p.write_text(s,encoding='utf-8')
p=Path('verify.mjs');s=p.read_text(encoding='utf-8').replace("assert(markdown(d).includes('TPE → FRA'));","assert.equal(d.days.find(x=>x.date==='2026-11-17').stay,'鹿特丹');assert.equal(d.stays[0].checkOut,'2026-11-17');assert.equal(d.stays[1].checkIn,'2026-11-17');assert(markdown(d).includes('TPE → FRA')); ");p.write_text(s,encoding='utf-8')
