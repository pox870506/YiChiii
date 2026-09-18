from pathlib import Path
import re
p=Path('lib/trip.ts');s=p.read_text(encoding='utf-8')
s=s.replace("export const sources = [","export const sources = [\n{id:'amstelhuis',title:'Het AMSTELhuis 官方聯絡與高齡住宅介紹',url:'https://hetamstelhuis.nl/',kind:'官方',note:'Amsteldijk 35, 1074 JK Amsterdam；info@hetamstelhuis.nl；+31 20 679 4080。屬高齡者自主居住住宅，不等同護理型老人院。正式參訪需聯繫確認。'},\n{id:'humanitas',title:'Humanitas Bergweg 官方地址與聯絡',url:'https://www.stichtinghumanitas.nl/locaties/bergweg',kind:'官方',note:'Bergwegplantsoen 10, 3037 SK Rotterdam；+31 10 271 3800；klantenservice@stichtinghumanitas.nl。正式參訪時段與費用尚未確認。'},")
updates={
'2026-11-14':{'title':'科隆半日／一日遊，當天看體力選','morning':'建議半日版：09:00 從 Düsseldorf Hbf 出發，10:00 左右科隆大教堂（禮拜期間依現場開放）、老城與 Hohenzollernbrücke 河景，12:00 午餐。','afternoon':'半日版：13:30–14:00 搭車回杜塞道夫，下午採買休息。一日版：午餐後加萊茵河散步＋巧克力博物館（時段另查），約 16:30–17:00 回程；不再另加登塔。','evening':'無論選哪版都回 Grupello-2 自煮晚餐；週六補足週日早餐、晚餐食材。','transport':'Düsseldorf Hbf ↔ Köln Hbf，RE 規劃約 35–55 分／方向；半日版門到門約 5–6 小時，一日版約 8–9 小時。車費預算已含來回；一日版若入巧克力博物館由選配門票額度支應，勿另重複計算。'},
'2026-11-18':{'title':'Humanitas Bergweg 參訪與鹿特丹散步','morning':'早餐後預留 09:15 出發、10:00–11:30 Humanitas Bergweg 參訪（待對方同意，尚未預約）。地址 Bergwegplantsoen 10, 3037 SK Rotterdam。若無法接待，回到原本 Markthal／方塊屋散步。','afternoon':'午餐 Markthal → 方塊屋外觀 → Oude Haven。體力許可短走 Erasmusbrug；新增參訪後不排港口遊船，避免太趕。','transport':'Airbnb 地標 Sint-Jacobsplaats 附近 → Bergwegplantsoen 10；暫留 25–40 分搭 RET／步行，確切路線待房東門牌與當日 9292。參訪後搭車到 Blaak／Markthal，再採買回住宿；費用由市區交通預算支應。','rain':'有預約則參訪照常，下午以 Markthal 室內為主。未獲同意不直接進入住民生活區。'},
'2026-11-20':{'title':'入住阿姆斯特丹，Het AMSTELhuis 參訪','afternoon':'寄放行李並午餐後，暫排 14:00–15:30 Het AMSTELhuis 交流參訪（待同意，尚未預約）：Amsteldijk 35, 1074 JK Amsterdam。可觀察高齡住宅與社區共餐模式；無法接待則改 De Pijp 散步。','evening':'參訪後只安排阿姆斯特爾河短走，回 Sloterdijk 採買、自煮晚餐。安妮之家與 Jordaan 改到 11/22 下午，遊船改為有餘裕才加。','transport':'Rotterdam Centraal → Amsterdam Sloterdijk，優先查一般 IC，預留 60–90 分及候車。飯店寄放行李後，至 Het AMSTELhuis 可查 Sloterdijk 地鐵 50／51 → Zuid 換 52 至 De Pijp 再步行；單程門到門先抓 45–60 分，當日以 GVB／9292 為準。','food':'早餐自煮、午餐外食，晚餐 ID Aparthotel 自煮。參訪餐廳是否提供餐食、費用另確認，不當成免費餐。','rain':'參訪僅在確認接待後進行；否則 De Pijp 咖啡館、室內活動取代河岸。'},
'2026-11-22':{'afternoon':'約 14:00 回阿姆斯特丹，Jordaan 散步與 Winkel 43；安妮之家可選 15:30 後時段（須先買票，無票改九街）。若風車村回程延誤，優先保留已買票的活動。','evening':'回 ID Aparthotel 自煮、整理行李。運河遊船只作替換選項：若加遊船，就取消安妮之家或縮短風車村，不全部堆在同一天。'}
}
for date,fields in updates.items():
 a=s.index("{date:'"+date+"'");b=s.index('\n',a);row=s[a:b]
 for k,v in fields.items():row=re.sub(k+":'[^']*'",lambda m:k+":'"+v+"'",row)
 if date in ['2026-11-18','2026-11-20']:row=row.replace('sources:[',"sources:['"+('humanitas' if date.endswith('18') else 'amstelhuis')+"',",1)
 if date=='2026-11-22':row=row.replace('sources:[',"sources:['anne','thread-food',",1)
 s=s[:a]+row+s[b:]
s=s.replace("['morning','afternoon','evening','transport','food'] as const","['title','morning','afternoon','evening','transport','food','rain'] as const")
p.write_text(s,encoding='utf-8')
p=Path('lib/budget.ts');s=p.read_text(encoding='utf-8').replace("export const budgetAssumptions=[","export const budgetAssumptions=['Humanitas Bergweg 與 Het AMSTELhuis 為待預約參訪；交通已含於市區交通估算，參訪費、翻譯與接待費未知，未計入。',")
p.write_text(s,encoding='utf-8')
p=Path('app/page.tsx');s=p.read_text(encoding='utf-8').replace('<li>11/23 預留','<li>11/18 Humanitas Bergweg、11/20 Het AMSTELhuis：請先取得接待同意，確認語言、人數、參訪費與可拍照範圍；目前尚未聯繫。</li><li>11/23 預留');p.write_text(s,encoding='utf-8')
p=Path('verify.mjs');s=p.read_text(encoding='utf-8').replace("import {initialDraft,","import {estimateBudget,budgetItems,budgetAssumptions,lodgingQuotes} from './lib/budget.ts';\nimport {migrateDraft,initialDraft,")
s=s.replace('reference:{flights,sources,assumptions}','reference:{flights,sources,assumptions,budgetItems,budgetAssumptions,lodgingQuotes,budget:estimateBudget()}')
s+="\nconst b=estimateBudget();assert.equal(b.lodging,95765/4);assert.equal(b.categories[0].low,265*38);assert(markdown(initialDraft).includes('Humanitas Bergweg'));assert(markdown(initialDraft).includes('Het AMSTELhuis'));const legacy=structuredClone(initialDraft);delete legacy.planRevision;legacy.notes['2026-11-18']='保留我的備註';assert.equal(migrateDraft(legacy).notes['2026-11-18'],'保留我的備註');console.log(b);\n"
p.write_text(s,encoding='utf-8')
