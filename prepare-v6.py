from pathlib import Path
import json,re,ast,shutil
root=Path('.')
if Path('lib/plan-v6.json').exists():
 raise SystemExit('Existing v6 data preserved. Edit lib/plan-v6.json directly; do not regenerate over it.')
p=json.loads(Path('C:/Users/User/Downloads/德荷旅遊-planRevision5-20260909.json').read_text(encoding='utf-8-sig'))
# Reuse the previously verified factual corrections without executing the booklet builder.
tree=ast.parse(Path('build-editorial.py').read_text(encoding='utf8'))
fn=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='clean')
exec(compile(ast.Module(body=[fn],type_ignores=[]),'clean','exec'))
def fix(v):
 if isinstance(v,str):return clean(v).replace('我','益萁').replace('你們','大家').replace('你在','益萁在').replace('与你','與益萁').replace('与你','與益萁').replace('與你','與益萁').replace('你直接','益萁直接')
 if isinstance(v,list):return [fix(x) for x in v]
 if isinstance(v,dict):return {k:fix(x) for k,x in v.items()}
 return v
p=fix(p);p['planRevision']=6;p['schemaVersion']=2
p.pop('changelog',None)
p['stays']=p['stays'][:3]
for s in p['stays']:
 s['booking']='入住時間 15:00–22:00' if s['city']=='鹿特丹' else ''
 s['nearbySupermarkets']=[re.sub(r'｜.*營業至.*$','',x) for x in s.get('nearbySupermarkets',[])]
days={d['date'][-2:]:d for d in p['days']}
days['19'].update(city='Delft・海牙',title='上午市集，午後名畫與老城',morning='09:00 從鹿特丹出發，約 09:45 抵 Delft 老城。慢逛 Markt 廣場的 Thursday Market，看看起司、花卉與日常攤位，再沿運河走走。',afternoon='12:00 在 Delft 吃午餐，13:00 左右搭火車往海牙。14:00 預約 Mauritshuis，留約 90 分鐘看畫；15:45 到 Hofvijver 湖畔與 Passage 拱廊慢逛、喝咖啡。',evening='17:00–17:30 返回鹿特丹，自煮晚餐，收拾隔日行李。',timeline=[['09:00','鹿特丹出發'],['09:45–12:00','Delft Thursday Market・運河散步'],['12:00','Delft 午餐'],['13:00','火車前往海牙'],['14:00–15:30','Mauritshuis（預約時段）'],['15:45–17:00','Hofvijver・Passage・咖啡'],['17:00–17:30','啟程返回鹿特丹']],transport='Rotterdam → Delft → Den Haag → Rotterdam。每段均依 NS 當日最早抵達路線選車，含走到車站、候車及市區步行，各留 30–45 分鐘。',transportSteps=['住宿步行至 Blaak，查 NS 前往 Delft 的最順班次；可能需在 Rotterdam Centraal 轉乘。','Delft 站步行約 10–15 分鐘到 Markt；上午留足兩小時逛市集與運河。','Delft → Den Haag Centraal；若班次到 HS，依 9292 轉電車進市中心。','海牙市中心步行／電車回車站，再搭 NS 返回鹿特丹。'],food='早餐、晚餐自煮；中午在 Delft 市集或廣場周邊用餐。海牙下午茶 Bookstore Café 或 Single Estate 擇一；Waroeng Padang Lapek 留作想吃正餐的替代。',alerts=[],rain='Delft 縮短露天市集，在廣場咖啡店休息；海牙保留已預約的 Mauritshuis 與 Passage 拱廊。')
days['21'].update(title='週六市集與梵谷的色彩',morning='09:00 Noordermarkt 農夫市集，接著慢逛 Lindengracht。11:30 Winkel 43 蘋果派；人太多改到附近 The Papeneiland。',afternoon='12:30 午餐後沿九街散步，Fabel Friet 或 Lanskroon Bakery 擇一分享。14:15 啟程往 Museumplein，15:00 梵谷美術館 Van Gogh Museum，保留約兩小時，先訂好五人的入場時段。',evening='18:30 Moeders 傳統荷蘭菜晚餐（先訂位）；沒訂到可選 Foodhallen。',timeline=[['09:00','Noordermarkt・Lindengracht 市集'],['11:30','Winkel 43／The Papeneiland'],['12:30','午餐・九街散步'],['14:15','前往 Museumplein'],['15:00–17:00','梵谷美術館（必排，預約入場）'],['18:30','Moeders 晚餐／Foodhallen 備選']],transport='Cityden → Jordaan 市集 → 九街 → Museumplein → Moeders → Cityden。市集區以步行串聯，14:15 起依 GVB／9292 查電車前往美術館，預留候車與走到入口的時間。',transportSteps=['早上依 GVB／9292 從 Cityden 前往 Noordermarkt。','Noordermarkt、Lindengracht、The Papeneiland 可步行串聯。','下午搭電車前往 Museumplein，至少提前 15 分鐘到梵谷美術館入口。','看展後前往 Rozengracht 251 的 Moeders；依訂位時間安排交通。'],food='Winkel 43 或 The Papeneiland 蘋果派；Fabel Friet 薯條、Lanskroon 大片焦糖煎餅擇一。晚餐 Moeders 荷蘭家常菜，五人可分享不同主餐。',rain='縮短市集與九街，在咖啡店或室內午餐休息；梵谷美術館仍依成功預約的時段入場。',alerts=[['good','梵谷美術館先預約 15:00 五人入場；Moeders 另訂晚餐。點心挑喜歡的分享即可。']])
for k in ['12','24','25']:
 d=days[k];d['stay']=''
 if k=='24':d.update(title='抵達上海，四位旅伴轉機',afternoon='14:00 抵達上海浦東。益萁在上海結束旅程，四位旅伴辦理轉機與行李相關手續。',evening='四位旅伴在浦東等候隔日航班，不安排住宿。',timeline=[['14:00','MU772 抵達浦東'],['抵達後','益萁結束旅程；四位旅伴轉機']],transport='依東航指引確認行李與隔日航班報到安排。',transportSteps=[],alerts=[],food='在機場依當日需求用餐。')
for d in p['days']:
 d['ticketingSteps']=[re.sub(r'，每張多收 €1 卡片費','，費用依購票畫面',x) for x in d.get('ticketingSteps',[])]
 if d['date']=='2026-11-13':d['timeline']=[['08:15–08:45' if t=='07:45' else ('10:00–10:30' if t=='09:30' else t),v] for t,v in d['timeline']]
 if d['date']=='2026-11-14':d['transportSteps']=['Bilk → Düsseldorf Hbf，依 DB 查詢最早抵達 Köln Hbf 的 ICE／IC 或 RE。','確認車票適用車種；區域票不能搭 ICE。含接駁及候車，單程留約一小時。']
 d['sources']=[]
r=p['reference']
for key in ['sources','budget','budgetItems','budgetAssumptions','budgetPolicy','lodgingQuotes','openQuestions','assumptions']:r.pop(key,None)
for city in r['foodLists']:
 city.pop('note',None)
 for f in city['items']:f['note']='';f['image']=''
am=r['foodLists'][-1]['items']
am.extend([dict(name=n,address=a,dish=d,when=w,note='',image='') for n,a,d,w in [
 ('The Papeneiland','Prinsengracht 2','荷式蘋果派','11/21 Winkel 43 排隊太久時替換'),
 ("Pat’s Poffertjes Nieuwendijk",'Nieuwendijk 32','奶油糖粉荷蘭小鬆餅','11/23 上午市中心散步'),
 ('Frens Haringhandel','Koningsplein／Singel','Haring 鯡魚配洋蔥與酸黃瓜','11/21 九街散步時，先點一份切塊分享'),
 ('Lanskroon Bakery','Singel 385','Koningsstroopwafel 大片焦糖煎餅','11/21 九街附近點心，亦可 11/23 順路'),
 ('Moeders','Rozengracht 251','Stamppot 薯泥與荷蘭燉肉','11/21 18:30 晚餐，先訂位')]])
days['23']['food']='早餐後在市中心散步，可選 Pat’s Poffertjes Nieuwendijk 小鬆餅；午餐吃飽，機場依需要補充。'
r['ticketDeadlines']=[{'name':'梵谷美術館','detail':'11/21 15:00 五人時段，優先預約。','url':'https://www.vangoghmuseum.nl/en/visit/tickets-and-ticket-prices'},{'name':'安妮之家','detail':'11/22 參觀：預計 10/13 週二荷蘭 10:00（台灣／上海 16:00）開賣；依售票日曆確認。','url':'https://www.annefrank.org/en/museum/tickets/choose-your-ticket/'},{'name':'Mauritshuis','detail':'11/19 14:00，留約 90 分鐘。','url':'https://www.mauritshuis.nl/en/visit'}]
p['expenses']=[{'id':f'stay-{i}','date':s['checkIn'],'category':'住宿','detail':s['name'],'amount':a,'currency':'TWD','rate':1,'payer':'待填','note':'','status':'待確認'} for i,(s,a) in enumerate(zip(p['stays'],[31797,25301,43000]))]
p['packing']=[{'id':f'pack-{i}-{j}','category':g['group'],'name':x,'done':False} for i,g in enumerate(r.pop('packingList')) for j,x in enumerate(g['items'])]
p['travelers']=['益萁','耘欣','靖宜','靖枝','玉穎'];p['people']=5
src=Path('C:/Users/User/OneDrive/桌面/旅遊團的照片');dst=Path('public/photos');dst.mkdir(parents=True,exist_ok=True)
photos={}
for i,f in enumerate(sorted(src.iterdir())):
 if f.stat().st_size<100:continue
 name=f'journey-{i:02d}{f.suffix.lower()}';shutil.copy2(f,dst/name);photos[f.stem]='/photos/'+name
p['photos']=photos
Path('lib/plan-v6.json').write_text(json.dumps(p,ensure_ascii=False,indent=2),encoding='utf8')
print('Prepared',len(p['days']),'days,',len(photos),'photos')
