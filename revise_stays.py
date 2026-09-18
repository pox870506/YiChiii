from pathlib import Path
import json
p=Path('lib/trip.ts');s=p.read_text(encoding='utf-8');old=json.loads(Path('exports/德荷旅遊.json').read_text(encoding='utf-8'))
Path('lib/previous-plan.ts').write_text('export const previousDays = '+json.dumps(old['days'],ensure_ascii=False)+';\n',encoding='utf-8')
s="import {budgetMarkdown} from './budget.ts';\nimport {previousDays} from './previous-plan.ts';\n"+s
s=s.replace("export const sources = [","export const sources = [\n{id:'id-hotel',title:'ID Aparthotel 官方位置與廚房',url:'https://www.amsterdamidaparthotel.com/about-us',kind:'官方',note:'Naritaweg 51，近 Amsterdam Sloterdijk；提供廚房，實際房型依訂單。'},\n{id:'budget-fx',title:'台銀歐元匯率參考',url:'https://rate.bot.com.tw/xrt/quote/ltm/EUR?Lang=en-US',kind:'官方',note:'2026/9/8 即期賣出 36.83；預算改用 38，非實際交易價。'},\n{id:'rijks-price',title:'Rijksmuseum 票價',url:'https://www.rijksmuseum.nl/en/visit/practical-info/opening-hours-and-prices',kind:'官方',note:'成人 €25；指定時段仍需預約。'},\n{id:'maurits-price',title:'Mauritshuis 票價',url:'https://www.mauritshuis.nl/en/visit',kind:'官方',note:'成人 €21；依購票日公告為準。'},")
s=s.replace('住宿未訂。','住宿名稱與報價已由使用者提供；付款與訂單條件未核對。').replace('飲食限制與預算未提供。','早餐與多數晚餐自煮，午餐外食；飲食限制未提供。')
s=s.replace("name:'',address:'',booking:''},{city:'鹿特丹'","name:'2 Raum City-Apartment 5min zum HBF Grupello-2',address:'完整門牌待訂單確認；名稱標示距 Düsseldorf Hbf 約 5 分鐘，非已核實步行時間',booking:'4 晚全組 TWD 42,521；每人 TWD 10,630.25；預訂平台、稅費與廚房設備待確認'},{city:'鹿特丹'",1)
s=s.replace("name:'',address:'',booking:''},{city:'阿姆斯特丹'","name:'Airbnb（正式房源名稱待補）',address:'Speeltuin Sint-Jacobsplaats 附近；此為定位地標，不是住宿名稱或門牌',booking:'Airbnb；3 晚全組 TWD 25,307；每人 TWD 6,326.75；晚到入住、廚具及總價所含費用待確認'},{city:'阿姆斯特丹'",1)
s=s.replace("name:'',address:'',booking:''},{city:'上海轉機","name:'Amsterdam ID Aparthotel',address:'Naritaweg 51, 1043 BP Amsterdam；Amsterdam Sloterdijk 車站旁',booking:'Booking.com；3 晚全組 TWD 27,937；每人 TWD 6,984.25；城市稅是否已含請核對訂單'},{city:'上海轉機",1)
# Change only planned fields on relevant dates.
updates={
'2026-11-13':{'evening':'入住 Grupello-2 後到附近超市採買早餐及兩天晚餐食材，簡單煮飯並休息。德國週日採買不作既定安排。','food':'午餐可選德式餐廳；晚餐住宿自煮。今天先買麵包、蛋、牛奶、蔬菜、義大利麵與簡單蛋白質。'},
'2026-11-14':{'evening':'約 17:00–18:00 回杜塞道夫，週六補足週日食材，回 Grupello-2 自煮晚餐。','food':'早餐住宿自煮、科隆午餐外食，晚餐回住宿煮。'},
'2026-11-15':{'evening':'住宿自煮晚餐；整理 MEDICA 票、展商名單及會面時間，早睡。','food':'早餐、晚餐自煮（食材週六先買）；午餐 Little Tokyo 或老城外食。','transport':'住宿以 Düsseldorf Hbf 周邊為基地，步行搭配 U-Bahn／電車；完整門牌待補，勿把名稱的 5 分鐘當保證。'},
'2026-11-16':{'evening':'回 Grupello-2 自煮晚餐，留 30 分鐘整理展會重點。','food':'早餐自煮、展場午餐外食、晚餐自煮；帶水與小點心。'},
'2026-11-17':{'evening':'預計 20:00–21:00 抵鹿特丹，前往 Sint-Jacobsplaats 地標附近 Airbnb。先確認晚到入住；今晚車上簡餐，不依賴晚間超市採買。','food':'早餐用完住宿食材、展場午餐；上車前買晚餐與隔日簡單早餐，避免晚到才找食物。'},
'2026-11-18':{'morning':'早餐後先在 Airbnb 附近採買兩日食材。約 10:00 出門：Markthal → 方塊屋外觀 → Oude Haven。','evening':'回 Airbnb 自煮晚餐。River Bar 改為可選外食備案，不列必吃。','transport':'以 Speeltuin Sint-Jacobsplaats 附近作概略起點，Blaak／Markthal 區域以步行為主，精確距離待房東地址；跨河可搭 RET。','food':'早餐、晚餐自煮；午餐 Markthal 炸魚或其他餐點。先買 11/19 晚餐食材。'},
'2026-11-19':{'evening':'17:00–18:00 返回鹿特丹 Airbnb，自煮晚餐，收拾明日行李。','food':'早餐、晚餐 Airbnb 自煮；海牙午餐外食，海灘炸魚是天氣好才加的小吃。'},
'2026-11-20':{'morning':'早餐後退房，約 09:30–10:00 出發，目的站改 Amsterdam Sloterdijk，步行至 ID Aparthotel 寄放行李。','evening':'選配有遮蔽船艙的運河遊船後，回 Sloterdijk 周邊採買、住宿自煮晚餐。薄餅餐廳改午餐候選。','transport':'Rotterdam Centraal → Amsterdam Sloterdijk，优先查經 Den Haag／Leiden 的一般 IC，預留約 60–90 分及候車。不要先繞 Amsterdam Zuid 再折返。飯店往 Centraal 搭 NS 約 5–10 分，另加步行及候車；時刻需查當日。','food':'早餐自煮、午餐外食；Winkel 43 蘋果派列點心，晚餐回 ID Aparthotel 自煮。'},
'2026-11-21':{'transport':'ID Aparthotel 走到 Sloterdijk；可查 GVB 電車 19 往博物館區再步行／轉乘，或 NS 到 Centraal 換車。單程門到門暫留 35–50 分；NS 與 GVB 分開計票。','food':'早餐自煮，午餐市集外食；今晚 Foodhallen 作第二次外食晚餐，若想全自煮可改午餐時段。'},
'2026-11-22':{'evening':'回 ID Aparthotel 自煮最後一晚晚餐，消耗剩餘食材，整理行李、退稅單與隔日機場交通。','transport':'從 Amsterdam Sloterdijk 查火車至 Zaandijk Zaanse Schans，再步行約 15–20 分；單程整體先抓 40–60 分。回程直接 Sloterdijk，不必繞 Centraal。','food':'早餐與晚餐自煮；午餐風車村或回市區外食，採買只買當天份量。'},
'2026-11-23':{'morning':'ID Aparthotel 自煮早餐後退房寄放行李，附近散步或市區最後採買。','afternoon':'若去市區，先返回 ID Aparthotel 取行李，約 15:30 從 Sloterdijk 出發，目標 16:30–17:00 前到 Schiphol。','transport':'ID Aparthotel → 步行至 Amsterdam Sloterdijk → NS 至 Schiphol Airport。火車約 10–15 分；步行、候車與行李處理合計留 45–60 分，當日先查工程。'}
}
import re
for date,fields in updates.items():
 a=s.index("{date:'"+date+"'");b=s.index('\n',a);row=s[a:b]
 for k,v in fields.items():row=re.sub(k+":'[^']*'",lambda m:k+":'"+v+"'",row)
 if date>='2026-11-20':row=row.replace("sources:[","sources:['id-hotel',",1)
 s=s[:a]+row+s[b:]
s=s.replace('schemaVersion:1;updatedAt','schemaVersion:1;planRevision?:number;updatedAt').replace("schemaVersion:1,updatedAt:'2026-09-08'","schemaVersion:1,planRevision:2,updatedAt:'2026-09-08'")
s=s.replace("'## 航班分組'","budgetMarkdown(),'## 航班分組'",1)
s += """\nexport function migrateDraft(saved:Draft):Draft {if((saved.planRevision||0)>=2)return saved;return {...saved,planRevision:2,days:saved.days.map((day,i)=>{const next={...day};for(const key of ['morning','afternoon','evening','transport','food'] as const){if(day[key]===previousDays[i][key])next[key]=days[i][key];}next.sources=Array.from(new Set([...day.sources,...days[i].sources]));return next;}),stays:saved.stays.map((stay,i)=>i<3?{...initialStays[i],booking:initialStays[i].booking+(stay.booking?'；原本機備註：'+stay.booking:'')}:stay)};}\n"""
p.write_text(s,encoding='utf-8')
