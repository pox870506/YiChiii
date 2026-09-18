export const lodgingQuotes=[{city:'杜塞道夫',nights:4,totalTwd:31797},{city:'鹿特丹',nights:3,totalTwd:25301},{city:'阿姆斯特丹',nights:3,totalTwd:43000}];
export const budgetItems=[
{category:'食',item:'早餐自煮',quantity:10,low:3,high:5,note:'11/14–23，共 10 餐；每人食材分攤'},
{category:'食',item:'午餐外食',quantity:11,low:12,high:20,note:'11/13–23，含兩日展場簡餐'},
{category:'食',item:'晚餐自煮',quantity:8,low:5,high:9,note:'10 晚中自煮 8 晚；油鹽與基本食材列入'},
{category:'食',item:'晚餐外食／移動日簡餐',quantity:2,low:15,high:25,note:'11/17 搭車、11/21 Foodhallen；11/23 假設機上晚餐已含'},
{category:'食',item:'咖啡、飲水、小吃',quantity:11,low:3,high:6,note:'包含蘋果派與市場點心，不另重複加餐'},
{category:'行',item:'FRA 機場 → Düsseldorf Hbf',quantity:1,low:40,high:90,note:'ICE 估算；彈性票或臨買可能更高'},
{category:'行',item:'科隆來回',quantity:1,low:35,high:70,note:'ICE／IC 來回預算，以最早抵達為主'},
{category:'行',item:'杜塞道夫市區與展場',quantity:1,low:20,high:35,note:'市區與MEDICA兩日公共交通；Uber備用另列'},
{category:'行',item:'杜塞道夫 → 鹿特丹',quantity:1,low:45,high:110,note:'11/17 ICE＋IC 聯程，優先短旅時，未鎖價'},
{category:'行',item:'鹿特丹市區',quantity:1,low:10,high:20,note:'步行為主，必要時 RET'},
{category:'行',item:'海牙來回與當地交通',quantity:1,low:21,high:36,note:'NS 來回＋海邊電車選配'},
{category:'行',item:'鹿特丹 → Cityden（經 Schiphol）',quantity:1,low:20,high:35,note:'Intercity direct／Eurocity Direct；包含附加票預留'},
{category:'行',item:'阿姆斯特丹市區交通',quantity:1,low:30,high:50,note:'Cityden／De Vlugtlaan 基地，NS 火車與 GVB 票不可混用'},
{category:'行',item:'風車村來回',quantity:1,low:8,high:14,note:'Sloterdijk 起訖，接駁已列市區交通'},
{category:'行',item:'Lelylaan → Schiphol',quantity:1,low:5,high:8,note:'機場列車預算'},
{category:'行',item:'展會／帶行李 Uber 備用與寄存',quantity:1,low:20,high:50,note:'每人備用；5人合計€100–250，含1–2次大型車／兩台車與行李寄存，非App報價；若全搭公車地鐵可省'},
{category:'樂',item:'Rijksmuseum',quantity:1,low:25,high:25,note:'官方成人票參考；不是已預訂'},
{category:'樂',item:'Mauritshuis',quantity:1,low:21,high:21,note:'官方成人票參考'},
{category:'樂',item:'安妮之家',quantity:1,low:16.5,high:16.5,note:'官方成人票參考，須搶時段；無票可省下'},
{category:'樂',item:'阿姆斯特丹運河遊船',quantity:1,low:18,high:28,note:'營運商未選，規劃額度'},
{category:'樂',item:'風車／雨天替代景點',quantity:1,low:0,high:40,note:'選配總額，不把所有備案全部加總'},
{category:'禮品',item:'巧克力、磁鐵、焦糖煎餅等',quantity:1,low:40,high:80,note:'每人採買額度，不含精品購物'}
];
export const budgetAssumptions=['Humanitas Bergweg 與 Het AMSTELhuis 為待預約參訪；交通已含於市區交通估算，參訪費、翻譯與接待費未知，未計入。','5 位成人均分 10 晚住宿；總价視為整組 5 人合計，依使用者提供，尚未核對訂單的城市稅、清潔費及服務費；阿姆斯特丹約43,000元，鹿特丹5人最終價格仍待確認。','範圍為歐洲 11/13–23（11 天、10 晚）；國際機票、台灣／上海交通與轉機住宿、保險、網卡不含。','預算匯率採 €1＝NT$38，含簡單匯差餘裕；非交易報價。台銀 2026/9/8 即期賣出參考 36.83、現鈔賣出 37.15。','早餐 10 餐自煮、午餐 11 餐外食、晚餐 8 餐自煮＋2 餐外食；11/23 晚餐假設搭機供餐。抵達日早餐以機上供餐為主。','所有鐵路及餐食金額都是規劃範圍，未查得指定班次報價；不預設買通票比較省。','MEDICA 2026 已改票制，尚未取得適用票價；另外暫留 €100–200／實際參展者，這是準備金而非官方門票報價。若有邀請票可扣除。','住宿與晚餐自煮以廚房可用為前提；新選的三間住宿炊具、冰箱與爐具均依房東／訂單確認。'];
export function estimateBudget(rate=38,attendees=5){const lodging=lodgingQuotes.reduce((a,b)=>a+b.totalTwd,0)/5;const categories=['食','行','樂','禮品'].map(category=>({category,low:budgetItems.filter(x=>x.category===category).reduce((a,x)=>a+x.quantity*x.low,0)*rate,high:budgetItems.filter(x=>x.category===category).reduce((a,x)=>a+x.quantity*x.high,0)*rate}));const low=lodging+categories.reduce((a,x)=>a+x.low,0),high=lodging+categories.reduce((a,x)=>a+x.high,0);return {lodging,categories,low,high,medicaLow:100*rate*attendees/5,medicaHigh:200*rate*attendees/5,reserve:3000,recommendedLow:low+100*rate*attendees/5+3000,recommendedHigh:high+200*rate*attendees/5+3000};}
export function budgetMarkdown(){const b=estimateBudget();return ['## 給家人看的簡單預算（每人／新台幣）',...simpleBudget.map(x=>`- ${x.label}：約 NT$${Math.round(x.amount).toLocaleString('zh-TW')}`),`- 四大項合計：約 NT$${Math.round(simpleTotal).toLocaleString('zh-TW')}；方便記可抓 NT$55,000。`,'- 若參加 MEDICA，加展會準備金與雜支，可先抓每人 NT$65,000；不是支出上限。','- 不含國際機票、轉機住宿、保險、網卡與未確認參訪／翻譯費。','## 下方為計算明細與高低範圍',...lodgingQuotes.map(x=>`- ${x.city} ${x.nights} 晚：全組 NT$${x.totalTwd}；每人 NT$${x.totalTwd/5}`),`- 住宿合計：NT$${b.lodging}`, ...b.categories.map(x=>`- ${x.category}：NT$${Math.round(x.low)}–${Math.round(x.high)}`),`- 食住行樂與禮品小計：NT$${Math.round(b.low)}–${Math.round(b.high)}`,`- 假設五人皆參展：每人另外 MEDICA 準備金 NT$${b.medicaLow}–${b.medicaHigh}（非報價）`, `- 每人再留 NT$${b.reserve} 雜支／未含稅費緩衝；含上述準備金總額 NT$${Math.round(b.recommendedLow)}–${Math.round(b.recommendedHigh)}`,...budgetAssumptions.map(x=>`- ${x}`),'### 歐元計算明細',...budgetItems.map(x=>`- ${x.category}／${x.item}：${x.quantity} × €${x.low}–${x.high}；${x.note}`)].join('\n\n');}

export const simpleBudget=[{label:"住宿（10 晚）",amount:20019.6},{label:"餐食（多數早晚餐自煮）",amount:14000},{label:"交通（快車＋市區＋Uber 備用）",amount:14000},{label:"景點門票＋小禮品",amount:6500}];
export const simpleTotal=simpleBudget.reduce((sum,x)=>sum+x.amount,0);

