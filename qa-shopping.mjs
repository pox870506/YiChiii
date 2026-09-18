import fs from 'node:fs';
import assert from 'node:assert/strict';
const p=JSON.parse(fs.readFileSync('lib/plan-v6.json','utf8'));
const meta=JSON.parse(fs.readFileSync('lib/photo-meta.json','utf8'));
const products=p.giftProducts;
assert.equal(products.length,124);
const removedNames=['Delhaize 商品採買參考','Zanetti 迷你布拉塔起司','自己煮：雞肉包裝對照','自己煮：魚與海鮮包裝對照','自己煮：牛肉部位對照','自己煮：豬肉部位對照','自己煮：米與即食飯怎麼選','甜點櫃看圖選：千層、派與泡芙','乳製品看圖選：優格與牛奶','荷蘭超市採買小筆記','Pukka、Kazidomi 茶飲與超市小物','De Tuinen 護手霜與日常保養','H&B Q10 與乳薊補充品','Biover 維他命系列','水上花市與鬱金香紀念品','Lanskroon 大片糖漿煎餅','Meyco 嬰幼兒織品','Donsje 嬰幼兒鞋與配件','dm 的零食、茶包與果乾','德國超市採買小筆記','護手、護唇與身體乳','洗護與口腔清潔小物','Mivolis 維他命、發泡錠與小熊軟糖','喉糖、茶包與旅途補給'];
for(const name of removedNames)assert.ok(!products.some(product=>product.name===name),name);
assert.deepEqual([...new Set(products.map(g=>g.country))].sort(),['德國','荷蘭']);
assert.deepEqual([...new Set(products.map(g=>g.category))].sort(),['伴手禮','藥妝','超市']);
assert.equal(new Set(products.map(g=>g.country+'|'+g.name)).size,products.length);
let pictures=new Set();
for(const g of products){
 assert.ok(g.name&&g.intro&&g.where&&g.images.length);
 assert.equal(g.image,g.images[0]);assert.equal(new Set(g.images).size,g.images.length);
 for(const src of g.images){
  assert.ok(src.startsWith('/photos/fast-'));
  assert.ok(fs.existsSync('public'+src),src);
  assert.ok(meta[src]?.width>0&&meta[src]?.height>0,src);
  assert.ok(fs.existsSync('public'+meta[src].small),src);
  pictures.add(src);
 }
}
for(const c of ['荷蘭','德國'])for(const category of ['超市','藥妝','伴手禮'])assert.ok(products.some(g=>g.country===c&&g.category===category));
const shopping=fs.readFileSync('app/shopping.tsx','utf8');
assert.ok(!shopping.includes('兩國一起看'));
assert.ok(shopping.includes("useState('荷蘭')")&&shopping.includes("useState('超市')"));
assert.ok(shopping.includes('showCaption={false}'));
assert.ok(shopping.includes('<details className="j-shopping-tips">'));
const gallery=fs.readFileSync('app/gallery.tsx','utf8');
assert.ok(gallery.includes('if(!nearby||images.length<2)return'));
assert.ok(gallery.includes('observer.disconnect()'));
const renderedPhotos=[...pictures];
console.log(`PASS: ${products.length} illustrated entries; ${renderedPhotos.length} verified full photos and small variants; 2 countries × 3 populated categories; duplicate removal; collapsed notes; viewport-limited preloads`);
