'use client';
import {useState} from 'react';
import type {Plan} from '@/lib/journey';
import Gallery from './gallery';

export default function Shopping({plan}:{plan:Plan}){
 const [country,setCountry]=useState('荷蘭'),[category,setCategory]=useState('超市');
 const categories=['超市','藥妝','伴手禮'];
 const products=plan.giftProducts.filter(g=>g.country===country&&g.category===category);
 return <section className="j-shopping">
 <div className="j-shopping-filters j-shopping-countries" aria-label="購物國家">{['荷蘭','德國'].map(c=><button key={c} aria-pressed={country===c} onClick={()=>setCountry(c)}>{c==='荷蘭'?'🇳🇱 荷蘭購物':'🇩🇪 德國購物'}</button>)}</div>
 <div className="j-shopping-filters" aria-label="商品類別">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
 <p className="j-shopping-count" aria-live="polite">{country}・{category}　{products.length} 則</p>
 <div className="j-food-grid">{products.map(g=><article className="j-card j-gift" key={country+g.name}><Gallery images={g.images?.length?g.images:[g.image]} label={g.name} showCaption={false}/><p className="j-kicker">{g.where}</p><h3>{g.name}</h3><p>{g.intro}</p>{g.tips?.length>0&&<details className="j-shopping-tips"><summary>挑選與採買小筆記</summary><ul>{g.tips.map((tip,i)=><li key={i}>{tip}</li>)}</ul></details>}</article>)}</div>
 {products.length===0&&<p>這個分類暫時沒有商品，試試另一個類別。</p>}
 </section>;
}
