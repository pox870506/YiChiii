import {categoryName,type Expense} from './journey';
export function parseSpokenExpense(text:string,travelers:string[]):Partial<Expense>{
 const result:Partial<Expense>={detail:text.replace(/[，,。]/g,' ').trim()};
 const normalized=text.replace(/十五/g,'15').replace(/二十/g,'20').replace(/三十/g,'30').replace(/五十/g,'50').replace(/一百/g,'100');
 const match=normalized.match(/(\d+(?:[.點点]\d+)?)\s*(歐元|欧元|歐|欧|美金|美元|人民幣|人民币|台幣|臺幣|台币|元|EUR|USD|CNY|TWD)/i);
 if(match){result.amount=Number(match[1].replace(/[點点]/,'.'));result.currency=/歐|欧|EUR/i.test(match[2])?'EUR':/美|USD/i.test(match[2])?'USD':/人民|CNY/i.test(match[2])?'CNY':'TWD';result.detail=normalized.replace(match[0],'').replace(/[，,。]/g,' ').trim();}
 const payer=travelers.find(n=>new RegExp(n+'\\s*(付|付款|支付|出)').test(text));if(payer){result.payer=payer;result.detail=result.detail?.replace(new RegExp(payer+'\\s*(付的|付款|支付|付|出的|出)'),'').trim();}
 result.category=categoryName(/午餐|晚餐|早餐|吃|香腸|咖啡|餐廳|点心|點心|超市/.test(text)?'吃飯':/火車|車票|交通|機票|計程車|地鐵/.test(text)?'交通':/住宿|飯店|旅館/.test(text)?'住宿':/門票|博物館|美術館/.test(text)?'門票娛樂':/伴手|買|購物/.test(text)?'購物伴手':'其他雜支');
 if(/個人|自己|私人/.test(text)){result.scope='personal';result.consumer=payer||travelers.find(n=>text.includes(n))||travelers[0];}else if(/公費|均分|大家|一起/.test(text))result.scope='shared';
 return result;
}
