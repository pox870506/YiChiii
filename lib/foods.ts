export type Food = {name:string;dish:string;when:string;note:string;mapsUrl?:string};
const foodEntries: {city:string;items:Food[]}[] = [
 {city:'杜塞道夫',items:[
 {name:'NANIWA Noodles & Soups',dish:'日式醬油／味噌拉麵、炒麵、煎餃',when:'11/15 午餐；想吃熱湯可選',note:'官方菜單已查；5 人可能要等位。'},
 {name:'Takumi',dish:'日式拉麵，依分店選雞湯或豚骨等口味',when:'Little Tokyo 午餐候選',note:'分店菜單不同，和 NANIWA 二選一。'},
 {name:'Schumacher Alt',dish:'萊茵地區德式家常菜、肉類主餐與 Altbier 啤酒',when:'11/13 或 11/15 午餐',note:'附件推薦，主餐依當日菜單；不喝酒可點無酒精飲料。'},
 {name:'FOOD JUNG',dish:'韓式飯食與外帶料理',when:'有順路時買簡餐',note:'11/17 不特別繞去排隊，趕車以中央站簡餐優先。'}]},
 {city:'科隆',items:[
 {name:'Brauhaus Malzmühle',dish:'德式啤酒館料理；可找豬腳或燉肉類主餐',when:'11/14 老城午餐候選',note:'附件推薦，品項與份量現場確認。'},
 {name:'Keule',dish:'德式肉類主餐，附件推薦豬腳',when:'午餐替代選項',note:'和 Malzmühle 擇一，不需兩家都吃。'},
 {name:'老城小吃攤',dish:'Reibekuchen 馬鈴薯煎餅配蘋果泥',when:'散步途中共享',note:'看現場營業，不安排指定攤位。'}]},
 {city:'鹿特丹',items:[
 {name:'Markthal 餐食攤',dish:'Kibbeling 裹粉炸魚塊、三明治等',when:'11/18 參訪後午餐',note:'挑一家主食；炸魚搭醬，魚種依攤位。'},
 {name:'Dudok Rotterdam',dish:'荷式蘋果派＋咖啡或熱茶',when:'Meent 附近下午茶',note:'可共享，留肚子回 Airbnb 自煮。'},
 {name:'Bram Ladage',dish:'現炸薯條，可選美乃滋等醬料',when:'市區散步小吃',note:'小份共享即可。'},
 {name:'Little V',dish:'越南料理，例如河粉、春捲、米飯主餐',when:'想吃亞洲熱食的午餐備案',note:'以當日菜單為準。'}]},
 {city:'海牙',items:[
 {name:'Waroeng Padang Lapek',dish:'印尼巴東風味飯食，配肉類、蔬菜與辣醬',when:'11/19 午餐候選',note:'先問辣度，不吃辣請店員搭配。'},
 {name:'Bookstore Café',dish:'咖啡、茶與糕點',when:'老城散步休息',note:'餐點供應依現場，不作必吃正餐。'},
 {name:'Single Estate',dish:'精品咖啡與咖啡館點心',when:'下午短休息',note:'與 Bookstore Café 二選一。'},
 {name:'Scheveningen 魚攤',dish:'Kibbeling 炸魚塊；haring 醃漬鯡魚',when:'只有天氣好才到海邊',note:'鯡魚不是炸魚，怕生冷口感可選炸魚。'}]},
 {city:'阿姆斯特丹',items:[
 {name:'Winkel 43',dish:'厚切荷式蘋果派，可加鮮奶油',when:'11/22 Jordaan 散步',note:'5 人可先共享幾份。'},
 {name:'Van Stapele',dish:'可可餅乾包白巧克力內餡',when:'市區順路點心或小禮物',note:'不為排隊犧牲預約；機場分店未列入。'},
 {name:'Fabel Friet／Vleminckx',dish:'荷式薯條，選醬料搭配',when:'二選一、共享小份',note:'不是兩頓正餐。'},
 {name:'Albert Cuyp 市集',dish:'現做 stroopwafel 焦糖煎餅、炸魚或鯡魚',when:'11/21 午餐與點心',note:'攤商營業依當日。'},
 {name:'Foodhallen',dish:'多國料理美食廣場，可各選飯食、漢堡等',when:'11/21 外食晚餐',note:'室內座位自行找，攤位以現場為準。'},
 {name:'The Pantry',dish:'荷蘭家常菜，例如 stamppot 蔬菜馬鈴薯泥',when:'想吃完整荷式午餐時',note:'附件推薦；先確認午餐營業與 5 人座位。'}]}
];
export const foodLists = foodEntries.map(c=>({...c,items:c.items.map(f=>({...f,mapsUrl:f.mapsUrl || 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(f.name+' '+c.city)}))}));
export function foodMarkdown(){return ['## 各城市推薦吃什麼',...foodLists.flatMap(c=>[`### ${c.city}`,...c.items.map(f=>`- ${f.name} ｜ ${f.dish}。${f.when}；${f.note}`)])].join('\n\n');}
