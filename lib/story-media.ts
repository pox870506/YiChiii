export type StoryMediaItem={
 src?:string;
 photoKey?:string;
 alt:string;
 caption?:string;
 credit?:string;
 sourceUrl?:string;
};

const commons=(file:string,alt:string,credit:string,caption?:string):StoryMediaItem=>({
 src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(file)+'?width=2400',
 alt,
 caption,
 credit,
 sourceUrl:'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file.replace(/ /g,'_'))
});

export const storyMedia:Record<string,StoryMediaItem[]>={
 'dusseldorf':[
  commons(
   'Düsseldorf, de Altstadt en de Rijn vanaf de Rheinkniebrücke IMG 8784 2019-03-22 14.53.jpg',
   '從萊茵河望向杜塞道夫老城與河岸',
   'Michielverbeek / Wikimedia Commons',
   '萊茵河、老城與現代城市輪廓，是認識杜塞道夫最直接的第一印象。'
  )
 ],
 'cologne-cathedral':[
  commons(
   'Cologne Cathedral in 2026.jpg',
   '科隆大教堂外觀與哥德式雙塔',
   'Jorge Franganillo / Wikimedia Commons',
   '大教堂的尺度、雙塔與深色石材，是科隆天際線最鮮明的識別。'
  )
 ],
 'cologne':[
  commons(
   'Cologne Cathedral and the Hohenzollern Bridge.jpg',
   '科隆大教堂、霍亨索倫橋與萊茵河',
   'Jiuguang Wang / Wikimedia Commons',
   '把教堂、鐵路橋和萊茵河放在同一個畫面裡，就能讀到科隆作為交通與宗教城市的關係。'
  )
 ],
 'markthal':[
  commons(
   'Markthal Rotterdam1.jpg',
   '鹿特丹 Markthal 拱門市場外觀',
   'Jorge Franganillo / Wikimedia Commons',
   '住宅、市場與大型拱形空間被整合成同一座建築。'
  )
 ],
 'cube':[
  commons(
   'Cube houses in Rotterdam.jpg',
   '鹿特丹方塊屋 Kubuswoningen',
   'Wikimedia Commons',
   'Piet Blom 將立方體住宅傾斜架高，形成像幾何森林一樣的街區。'
  )
 ],
 'depot':[
  commons(
   'Boijmans Depot.jpg',
   '鹿特丹 Depot Boijmans 鏡面建築',
   'Wikimedia Commons',
   '鏡面碗狀外牆讓典藏庫本身也成為城市景觀的一部分。'
  )
 ],
 'rotterdam':[
  commons(
   'Rotterdam-Skyline.jpg',
   '鹿特丹天際線與伊拉斯謨橋',
   'acediscovery / Wikimedia Commons',
   '戰後重建讓鹿特丹形成與荷蘭其他老城非常不同的現代城市輪廓。'
  )
 ],
 'ah':[
  commons(
   'Opening of an Albert Heijn supermarket, Oude Noorden, Rotterdam (2021) 02.jpg',
   '鹿特丹 Albert Heijn 超市',
   'Wikimedia Commons',
   'Albert Heijn 是荷蘭旅途中最常遇到的日常超市之一。'
  )
 ],
 'kamphuisen':[
  commons(
   'Stroopwafel syrup gouda.jpg',
   '豪達市集上的糖漿煎餅焦糖糖漿',
   'Delphine Ménard / Wikimedia Commons',
   '這張照片呈現豪達糖漿煎餅製作的核心元素；Kamphuisen 的實際工廠體驗以現場為準。'
  )
 ],
 'cheese':[
  commons(
   'Gouda Cheese.JPG',
   '豪達起司輪',
   'Wikimedia Commons',
   '熟成時間與製作方式，會讓同樣以牛乳製成的豪達起司呈現完全不同的風味。'
  )
 ],
 'mauritshuis':[
  commons(
   'Hofvijver Mauritshuis.jpg',
   '海牙宮廷池旁的 Mauritshuis',
   'Steven Lek / Wikimedia Commons',
   'Mauritshuis 的尺度更接近一座歷史宅邸，而不是巨型博物館。'
  ),
  {photoKey:'珍珠耳環少女',alt:'維梅爾《戴珍珠耳環的少女》',caption:'館內最具代表性的作品之一；實際展出依館方當日安排。'}
 ],
 'gouda':[
  commons(
   'Town Hall Gouda, The Netherlands.jpg',
   '豪達 Markt 廣場上的哥德式市政廳',
   'Tulumnes / Wikimedia Commons',
   '獨立矗立在市場廣場中央的市政廳，是豪達老城最具辨識度的城市景觀。'
  )
 ],
 'hague':[
  commons(
   'The hague hofvijver.jpg',
   '海牙 Hofvijver 宮廷池與歷史建築',
   'Prasenberg / Wikimedia Commons',
   '宮廷池、Binnenhof 與周邊建築把海牙的政治與宮廷歷史濃縮在同一片水景旁。'
  )
 ],
 'sintjan':[
  commons(
   'Sint-Janskerk Gouda1.jpg',
   '豪達聖約翰教堂 Sint-Janskerk 外觀',
   'W.E. Jonk / Wikimedia Commons',
   '聖約翰教堂以長尺度教堂空間與彩繪玻璃聞名。'
  )
 ],
 'amsterdam':[
  commons(
   'Amsterdam Canals.jpg',
   '阿姆斯特丹運河與沿岸建築',
   'Wikimedia Commons',
   '運河不只是風景，也是阿姆斯特丹城市擴張、運輸與居住發展的骨架。'
  )
 ],
 'albert':[
  commons(
   'NL-amsterdam-albert-cuyp-markt-1.jpg',
   '阿姆斯特丹 Albert Cuyp 市集',
   'Balou46 / Wikimedia Commons',
   '市場攤位、食物與街區日常，讓 De Pijp 成為適合邊走邊吃的區域。'
  )
 ],
 'dam':[
  commons(
   'Dam square -.jpg',
   '阿姆斯特丹水壩廣場 Dam Square',
   'Elekes Andor / Wikimedia Commons',
   '今天的水壩廣場仍是理解 Amsterdam 名稱與城市起源的重要地點。'
  )
 ],
 'carrousel':[
  {photoKey:'新增・鬆餅店1',alt:'阿姆斯特丹荷式鬆餅店與鬆餅',caption:'荷式 Pannenkoeken 與 Poffertjes 都很適合當作行程中的彈性補給。'}
 ],
 'vangogh':[
  commons(
   'Van Gogh Museum, Amsterdam.jpg',
   '阿姆斯特丹梵谷博物館外觀',
   'Silva.1994 / Wikimedia Commons',
   '館舍收藏與家族保存的畫作、書信共同構成今天我們認識梵谷的重要脈絡。'
  )
 ],
 'noorder-sat':[
  commons(
   'Noordermarkt 1.jpg',
   '阿姆斯特丹 Noordermarkt 市集周邊',
   'Marion Golsteijn / Wikimedia Commons',
   '週六的 Noordermarkt 以農夫市集與食物為主，是 Jordaan 很有生活感的一面。'
  )
 ],
 'linden':[
  commons(
   'Lindengracht.jpg',
   '阿姆斯特丹 Lindengracht 街景',
   'Wikimedia Commons',
   '今天的 Lindengracht 已填平為街道，但仍保留過去運河街區的城市尺度。'
  )
 ],
 'zaanse':[
  commons(
   'Windmills in Zaanse Schans.jpg',
   '贊斯風車村河岸風車',
   'Wikimedia Commons',
   '風車曾經是木材、油料與顏料加工的重要動力來源，而不是單純的觀光背景。'
  )
 ],
 'anne':[
  commons(
   'Anne Frank House, Amsterdam (26184622442).jpg',
   '阿姆斯特丹安妮之家外觀',
   'Tobias Niepel / Wikimedia Commons',
   '王子運河 263 號的建築外觀，連結著後宅藏匿與安妮日記的歷史。'
  )
 ],
 'noorder-mon':[
  commons(
   'Noordermarkt 1.jpg',
   '阿姆斯特丹 Noordermarkt',
   'Marion Golsteijn / Wikimedia Commons',
   '同一座廣場到了週一會轉為跳蚤市場，和週六農夫市集的氣氛完全不同。'
  )
 ]
};

export const extraStoryMedia:Record<string,StoryMediaItem[]>={
 'MedienHafen':[{photoKey:'MedienHafen',alt:'杜塞道夫 MedienHafen 媒體港建築'}],
 'PSD BANK DOME Düsseldorf':[{photoKey:'PSD BANK DOME',alt:'杜塞道夫 PSD BANK DOME'}],
 'Oude Haven':[{photoKey:'Oude Haven',alt:'鹿特丹 Oude Haven 老港'}],
 'Erasmusbrug':[{photoKey:'Erasmusbrug',alt:'鹿特丹伊拉斯謨橋'}],
 'Hofvijver':[{photoKey:'Hofvijver',alt:'海牙 Hofvijver 宮廷池'}],
 'Sint-Janskerk':[{photoKey:'Sint-Janskerk',alt:'豪達聖約翰教堂'}],
 'Gouda Waag':[{photoKey:'Gouda Waag',alt:'豪達 De Goudse Waag 起司秤量所'}],
 'Anne Frank Huis':[{photoKey:'Anne Frank Huis',alt:'阿姆斯特丹安妮之家'}],
 'Albert Cuyp Markt 街景':[{photoKey:'Albert Cuyp Markt 街景',alt:'阿姆斯特丹 Albert Cuyp 市集街景'}],
 '科隆':[{photoKey:'科隆',alt:'科隆城市與大教堂'}],
 '鹿特丹':[{photoKey:'鹿特丹',alt:'鹿特丹城市景觀'}],
 'Kubuswoningen':[{photoKey:'Kubuswoningen',alt:'鹿特丹方塊屋'}],
 'Depot':[{photoKey:'Depot',alt:'鹿特丹 Depot Boijmans'}],
 '珍珠耳環少女':[{photoKey:'珍珠耳環少女',alt:'維梅爾《戴珍珠耳環的少女》'}],
 'Gouda Markt':[{photoKey:'Gouda Markt',alt:'豪達 Markt 廣場'}],
 'Van Gogh Museum':[{photoKey:'Van Gogh Museum',alt:'阿姆斯特丹梵谷博物館'}],
 'Zaanse Schans':[{photoKey:'Zaanse Schans',alt:'贊斯風車村'}],
 'Carrousel':[{photoKey:'新增・鬆餅店1',alt:'阿姆斯特丹荷式鬆餅'}],
 'Kaaswinkeltje':[{photoKey:'新增・豪達起司1',alt:'豪達起司店與起司'}]
};
