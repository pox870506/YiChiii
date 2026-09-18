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

const local=(photoKey:string,alt:string,caption?:string):StoryMediaItem=>({photoKey,alt,caption});

export const storyMedia:Record<string,StoryMediaItem[]>={
 'dusseldorf':[
  commons('Düsseldorf, de Altstadt en de Rijn vanaf de Rheinkniebrücke IMG 8784 2019-03-22 14.53.jpg','從萊茵河望向杜塞道夫老城與河岸','Michielverbeek / Wikimedia Commons','萊茵河、老城與現代城市輪廓，是認識杜塞道夫最直接的第一印象。'),
  local('杜賽道夫','杜塞道夫城市與萊茵河景觀'),
  local('杜賽道夫-2','杜塞道夫老城街景'),
  local('Burgplatz','杜塞道夫 Burgplatz 城堡廣場')
 ],
 'cologne-cathedral':[
  commons('Cologne Cathedral in 2026.jpg','科隆大教堂外觀與哥德式雙塔','Jorge Franganillo / Wikimedia Commons','大教堂的尺度、雙塔與深色石材，是科隆天際線最鮮明的識別。'),
  local('科隆','科隆大教堂與城市景觀'),
  local('Hohenzollernbrücke','霍亨索倫橋望向科隆大教堂'),
  commons('Cologne Cathedral and the Hohenzollern Bridge.jpg','科隆大教堂與霍亨索倫橋','Jiuguang Wang / Wikimedia Commons')
 ],
 'cologne':[
  commons('Cologne Cathedral and the Hohenzollern Bridge.jpg','科隆大教堂、霍亨索倫橋與萊茵河','Jiuguang Wang / Wikimedia Commons'),
  local('科隆','科隆城市與大教堂'),
  local('Hohenzollernbrücke','科隆霍亨索倫橋'),
  local('Schokoladenmuseum','科隆萊茵河畔與巧克力博物館')
 ],
 'markthal':[
  commons('Markthal Rotterdam1.jpg','鹿特丹 Markthal 拱門市場外觀','Jorge Franganillo / Wikimedia Commons','住宅、市場與大型拱形空間被整合成同一座建築。'),
  local('鹿特丹','鹿特丹 Markthal 與市中心'),
  local('Oude Haven','Markthal 附近的鹿特丹老港'),
  local('Kubuswoningen','Markthal 附近的方塊屋')
 ],
 'cube':[
  commons('Cube houses in Rotterdam.jpg','鹿特丹方塊屋 Kubuswoningen','Wikimedia Commons','Piet Blom 將立方體住宅傾斜架高，形成像幾何森林一樣的街區。'),
  local('Kubuswoningen','鹿特丹方塊屋近景'),
  local('Oude Haven','方塊屋旁的 Oude Haven 老港'),
  local('鹿特丹-2','鹿特丹現代建築街景')
 ],
 'depot':[
  commons('Boijmans Depot.jpg','鹿特丹 Depot Boijmans 鏡面建築','Wikimedia Commons','鏡面碗狀外牆讓典藏庫本身也成為城市景觀的一部分。'),
  local('Depot','Depot Boijmans 建築外觀'),
  local('鹿特丹-3','鹿特丹博物館區與城市建築'),
  local('Erasmusbrug','鹿特丹現代城市景觀與伊拉斯謨橋')
 ],
 'rotterdam':[
  commons('Rotterdam-Skyline.jpg','鹿特丹天際線與伊拉斯謨橋','acediscovery / Wikimedia Commons','戰後重建讓鹿特丹形成與荷蘭其他老城非常不同的現代城市輪廓。'),
  local('鹿特丹','鹿特丹市中心'),
  local('Kubuswoningen','鹿特丹方塊屋'),
  local('Oude Haven','鹿特丹老港'),
  local('Erasmusbrug','鹿特丹伊拉斯謨橋')
 ],
 'ah':[
  commons('Opening of an Albert Heijn supermarket, Oude Noorden, Rotterdam (2021) 02.jpg','鹿特丹 Albert Heijn 超市','Wikimedia Commons'),
  commons('Albert Heijn Karel Doormanstraat, Rotterdam-Centrum, Rotterdam (2022) 02.jpg','鹿特丹市中心 Albert Heijn 超市外觀','Wikimedia Commons'),
  commons('Albert Heijn Rotterdam Zuidplein.jpg','鹿特丹 Zuidplein 的 Albert Heijn','Wikimedia Commons'),
  commons('Albert Heijn huishoudartikelenafdeling foto 1.JPG','Albert Heijn 超市內部貨架','Wikimedia Commons')
 ],
 'kamphuisen':[
  commons('Stroopwafel syrup gouda.jpg','豪達糖漿煎餅與糖漿','Delphine Ménard / Wikimedia Commons','糖漿與薄脆餅皮是豪達 stroopwafel 風味的核心。'),
  commons('Town Hall Gouda, The Netherlands.jpg','豪達 Markt 廣場與市政廳','Tulumnes / Wikimedia Commons'),
  local('Gouda Markt','Kamphuisen 所在的豪達 Markt 廣場'),
  local('Gouda Waag','豪達 Markt 一帶的歷史秤量所')
 ],
 'cheese':[
  commons('Gouda Cheese.JPG','豪達起司輪','Wikimedia Commons','熟成時間與製作方式，會讓豪達起司呈現完全不同的風味。'),
  local('新增・豪達起司1','豪達起司店內的起司'),
  local('新增・豪達起司2','不同熟成程度的豪達起司'),
  local('Gouda Waag','與豪達起司交易歷史相關的秤量所')
 ],
 'mauritshuis':[
  commons('Hofvijver Mauritshuis.jpg','海牙宮廷池旁的 Mauritshuis','Steven Lek / Wikimedia Commons','Mauritshuis 的尺度更接近一座歷史宅邸，而不是巨型博物館。'),
  local('珍珠耳環少女','維梅爾《戴珍珠耳環的少女》'),
  local('Hofvijver','Mauritshuis 旁的 Hofvijver 宮廷池'),
  commons('The hague hofvijver.jpg','海牙 Hofvijver 與歷史建築','Prasenberg / Wikimedia Commons')
 ],
 'gouda':[
  commons('Town Hall Gouda, The Netherlands.jpg','豪達 Markt 廣場上的哥德式市政廳','Tulumnes / Wikimedia Commons','獨立矗立在市場廣場中央的市政廳，是豪達老城最具辨識度的城市景觀。'),
  local('Gouda Markt','豪達 Markt 廣場'),
  local('Gouda Waag','豪達 De Goudse Waag'),
  local('Sint-Janskerk','豪達聖約翰教堂')
 ],
 'hague':[
  commons('The hague hofvijver.jpg','海牙 Hofvijver 宮廷池與歷史建築','Prasenberg / Wikimedia Commons','宮廷池、Binnenhof 與周邊建築把海牙的政治與宮廷歷史濃縮在同一片水景旁。'),
  local('Hofvijver','海牙 Hofvijver 宮廷池'),
  local('珍珠耳環少女','海牙 Mauritshuis 館藏《戴珍珠耳環的少女》'),
  commons('Hofvijver Mauritshuis.jpg','Mauritshuis 與 Hofvijver','Steven Lek / Wikimedia Commons')
 ],
 'sintjan':[
  commons('Sint-Janskerk Gouda1.jpg','豪達聖約翰教堂 Sint-Janskerk 外觀','W.E. Jonk / Wikimedia Commons','聖約翰教堂以長尺度教堂空間與彩繪玻璃聞名。'),
  local('Sint-Janskerk','豪達聖約翰教堂'),
  local('Gouda Markt','豪達老城 Markt 廣場'),
  local('Gouda Waag','豪達歷史街區與 De Goudse Waag')
 ],
 'amsterdam':[
  commons('Amsterdam Canals.jpg','阿姆斯特丹運河與沿岸建築','Wikimedia Commons','運河不只是風景，也是阿姆斯特丹城市擴張、運輸與居住發展的骨架。'),
  local('荷蘭11月 照片','阿姆斯特丹秋日運河'),
  local('Albert Cuyp Markt 街景','阿姆斯特丹街市與城市日常'),
  local('Anne Frank Huis','阿姆斯特丹運河屋與安妮之家')
 ],
 'albert':[
  commons('NL-amsterdam-albert-cuyp-markt-1.jpg','阿姆斯特丹 Albert Cuyp 市集','Balou46 / Wikimedia Commons','市場攤位、食物與街區日常，讓 De Pijp 成為適合邊走邊吃的區域。'),
  commons('Albert Cuyp markt, foto1.JPG','Albert Cuyp 市集攤位與街景','Alf van Beem / Wikimedia Commons'),
  commons('Albert Cuyp markt, foto7.JPG','Albert Cuyp 市集人潮與攤位','Alf van Beem / Wikimedia Commons'),
  local('Albert Cuyp Markt 街景','Albert Cuyp 市集街景')
 ],
 'dam':[
  commons('Dam square -.jpg','阿姆斯特丹水壩廣場 Dam Square','Elekes Andor / Wikimedia Commons','今天的水壩廣場仍是理解 Amsterdam 名稱與城市起源的重要地點。'),
  commons('Dam square, Amsterdam, North Holland, the Netherlands, 1890s.jpg','19 世紀末的阿姆斯特丹水壩廣場','Library of Congress / Wikimedia Commons'),
  local('荷蘭11月 照片','阿姆斯特丹歷史市中心與運河城市景觀')
 ],
 'vangogh':[
  commons('Van Gogh Museum, Amsterdam.jpg','阿姆斯特丹梵谷博物館外觀','Silva.1994 / Wikimedia Commons','館舍收藏與家族保存的畫作、書信共同構成今天我們認識梵谷的重要脈絡。'),
  local('Van Gogh Museum','梵谷博物館建築'),
  local('向日葵｜1889','梵谷《向日葵》'),
  local('臥室｜1888','梵谷《臥室》'),
  local('杏花盛開｜1890','梵谷《杏花盛開》')
 ],
 'noorder-sat':[
  commons('Noordermarkt foto 1.JPG','週六的阿姆斯特丹 Noordermarkt 市集','Alf van Beem / Wikimedia Commons','週六的 Noordermarkt 以農夫市集與食物為主，是 Jordaan 很有生活感的一面。'),
  commons('Noorderkerk, Noordermarkt.JPG','Noordermarkt 與 Noorderkerk','Alf van Beem / Wikimedia Commons'),
  commons('Noordermarkt foto11.JPG','Noordermarkt 市集攤位','Alf van Beem / Wikimedia Commons'),
  local('Lindengracht Markt','Noordermarkt 附近的 Lindengracht 市集街區')
 ],
 'linden':[
  commons('Lindengracht.jpg','阿姆斯特丹 Lindengracht 街景','Wikimedia Commons','今天的 Lindengracht 已填平為街道，但仍保留過去運河街區的城市尺度。'),
  commons('Lindengracht, Theo Thijssen beeld foto 1.jpg','Lindengracht 街區與 Theo Thijssen 雕像','Alf van Beem / Wikimedia Commons'),
  local('Lindengracht Markt','Lindengracht 市集街景'),
  local('荷蘭11月 照片','阿姆斯特丹 Jordaan 周邊運河街景')
 ],
 'zaanse':[
  commons('Windmills in Zaanse Schans.jpg','贊斯風車村河岸風車','Wikimedia Commons','風車曾經是木材、油料與顏料加工的重要動力來源，而不是單純的觀光背景。'),
  commons('Zaanse Schans windmills.jpg','贊斯風車村多座歷史風車','Gokul Ganesh Murali / Wikimedia Commons'),
  commons('Zaanse Schans Windmills.jpg','贊斯風車村與河岸風景','Marchia Kalyanitta / Wikimedia Commons'),
  local('Zaanse Schans','贊斯風車村')
 ],
 'anne':[
  commons('Anne Frank House, Amsterdam (26184622442).jpg','阿姆斯特丹安妮之家外觀','Tobias Niepel / Wikimedia Commons','王子運河 263 號的建築外觀，連結著後宅藏匿與安妮日記的歷史。'),
  commons('AnneFrankHuisAmsterdam.jpg','黃昏時的安妮之家與運河屋','Massimo Catarinella / Wikimedia Commons'),
  commons('Anne Frank House, Amsterdam.JPG','從西南側看安妮之家','Supercarwaar / Wikimedia Commons'),
  local('Anne Frank Huis','安妮之家與王子運河街景')
 ],
 'ndsm':[
  commons('NDSM Wharf @ Amsterdam (18302338988).jpg','NDSM Wharf 舊造船廠廣場','Guilhem Vellut / Wikimedia Commons','NDSM 廣場與工業建築。'),
  commons('Foot of crane at NDSM with graffiti.JPG','NDSM 吊車下方的塗鴉','Mark Ahsmann / Wikimedia Commons','舊工業設施與街頭藝術。'),
  commons('"MAKE ART NOT€" @ NDSM Wharf @ Amsterdam (18302280528).jpg','NDSM Wharf 戶外塗鴉作品','Guilhem Vellut / Wikimedia Commons','NDSM 戶外藝術。'),
  commons('Slipway; crane; NDSM wharf Amsterdam.JPG','NDSM 船台與吊車','Wikimedia Commons','造船廠留下的船台與工業結構。')
 ],
 'eye-noord':[
  commons('EYE Filmmuseum @ Amsterdam (22563494720).jpg','Eye Filmmuseum 河岸側外觀','Guilhem Vellut / Wikimedia Commons','從 IJ 河岸看 Eye Filmmuseum。'),
  commons('Amsterdam EYE Filmmuseum.jpg','Eye Filmmuseum 白色幾何外觀','Wikimedia Commons','從河岸看 Eye 建築全貌。'),
  commons('EYE Filmmuseum @ On the Ferry to Amsterdam-Noord @ IJ River @ Amsterdam (16184265745).jpg','從 IJ 渡輪看 Eye Filmmuseum','Guilhem Vellut / Wikimedia Commons','渡輪上的 Eye 河景視角。'),
  commons('Inside the EYE Filmmuseum @ Amsterdam-Noord @ Amsterdam (16184704411).jpg','Eye Filmmuseum 室內公共空間','Guilhem Vellut / Wikimedia Commons','Eye 建築內部的階梯與公共空間。')
 ],
 'adam-lookout':[
  commons("A'DAM lookout and Eye Film Museum in Amsterdam.jpg","A'DAM Tower 與 Eye Filmmuseum 河岸全景",'Wikimedia Commons','從 IJ 一帶看 Amsterdam-Noord 天際線。'),
  commons("A'DAM Lookout-01-Entry.jpg","A'DAM LOOKOUT 入口",'Muck / Wikimedia Commons',"A'DAM Tower 觀景台入口。"),
  commons("A'DAM Lookout-02.jpg","A'DAM LOOKOUT 觀景空間",'Muck / Wikimedia Commons','塔頂觀景區。'),
  commons("A'DAM Lookout-07-Panorama Southwest.jpg","A'DAM LOOKOUT 向西南方的城市全景",'Muck / Wikimedia Commons','Amsterdam Centraal 與市中心方向的高空視野。'),
  commons("A'DAM Lookout-06-Panorama Southeast.jpg","A'DAM LOOKOUT 向東南方的城市全景",'Muck / Wikimedia Commons','IJ 河與阿姆斯特丹東南方向的高空視野。')
 ],
 'schloss-burg':[
  commons('Schloss Burg, Solingen (North Rhine-Westphalia).png','Schloss Burg 山城與建築全景','Nico Vogel / Wikimedia Commons','Schloss Burg 建築群位在 Wupper 河谷上方。'),
  commons('Schloss Burg, Solingen.jpg','從遠處看 Schloss Burg 與 Bergisches Land 山坡','Morty / Wikimedia Commons'),
  commons('The buildings of Schloss Burg, Solingen (North Rhine-Westphalia).png','Schloss Burg 建築群與山城空間','Nico Vogel / Wikimedia Commons'),
  commons('Seilbahn Burg.JPG','Unterburg 往 Schloss Burg 的 Seilbahn Burg 纜車','Morty / Wikimedia Commons'),
  commons('02-Schloss-Burg.jpg','Schloss Burg 城門與外觀','Bozena Radowski / Wikimedia Commons')
 ],
 'muengsten':[
  commons('Müngstener Brücke - Wupperweg zw. Müngsten u. Burg (1).jpg','從 Wupper 河谷步道看 Müngstener Brücke','DiAuras / Wikimedia Commons','森林、Wupper 河與鋼鐵巨橋是下午散步的主角。'),
  commons('Müngstener Brücke u. Schwebefähre über die Wupper.jpg','Müngstener Brücke 與 Wupper 河景','DiAuras / Wikimedia Commons'),
  commons('Muengstener Bruecke 02.jpg','Müngstener Brücke 橫跨 Wupper 河谷','Wikimedia Commons'),
  commons('Muengstener Bruecke.jpg','Müngstener Brücke 與通過橋上的列車','Wikimedia Commons'),
  commons('Muengstener Bruecke Wuppertal n 201902.jpg','冬季 Wupper 河谷與 Müngstener Brücke','Matthias Nonnenmacher / Wikimedia Commons')
 ]
};

export const extraStoryMedia:Record<string,StoryMediaItem[]>={
 'Hohenzollernbrücke':[
  local('Hohenzollernbrücke','科隆霍亨索倫橋'),
  local('科隆','霍亨索倫橋與科隆大教堂'),
  commons('Cologne Cathedral and the Hohenzollern Bridge.jpg','霍亨索倫橋與科隆大教堂','Jiuguang Wang / Wikimedia Commons')
 ],
 'Schokoladenmuseum':[
  local('Schokoladenmuseum','科隆巧克力博物館'),
  local('科隆','科隆萊茵河畔城市景觀'),
  local('Hohenzollernbrücke','科隆萊茵河與霍亨索倫橋')
 ],
 'MedienHafen':[
  local('MedienHafen','杜塞道夫 MedienHafen 媒體港建築'),
  local('杜賽道夫-3','杜塞道夫媒體港與現代建築'),
  local('杜賽道夫','杜塞道夫萊茵河城市景觀')
 ],
 'PSD BANK DOME Düsseldorf':[
  local('PSD BANK DOME','杜塞道夫 PSD BANK DOME'),
  local('杜賽道夫-3','杜塞道夫城市與場館周邊'),
  local('杜賽道夫','杜塞道夫城市景觀')
 ],
 'Oude Haven':[
  local('Oude Haven','鹿特丹 Oude Haven 老港'),
  local('Kubuswoningen','Oude Haven 旁的方塊屋'),
  local('鹿特丹','鹿特丹老港與現代城市')
 ],
 'Erasmusbrug':[
  local('Erasmusbrug','鹿特丹伊拉斯謨橋'),
  local('鹿特丹','鹿特丹天際線'),
  local('鹿特丹-2','鹿特丹現代城市景觀')
 ],
 'Hofvijver':[
  local('Hofvijver','海牙 Hofvijver 宮廷池'),
  local('珍珠耳環少女','Mauritshuis 館藏《戴珍珠耳環的少女》'),
  commons('The hague hofvijver.jpg','海牙 Hofvijver 與歷史建築','Prasenberg / Wikimedia Commons')
 ],
 'Gouda Waag':[
  local('Gouda Waag','豪達 De Goudse Waag 起司秤量所'),
  local('Gouda Markt','豪達 Markt 廣場'),
  local('Sint-Janskerk','豪達聖約翰教堂')
 ],
 '珍珠耳環少女':[
  local('珍珠耳環少女','維梅爾《戴珍珠耳環的少女》'),
  local('Hofvijver','Mauritshuis 所在的 Hofvijver 宮廷池'),
  commons('Hofvijver Mauritshuis.jpg','海牙 Mauritshuis 外觀','Steven Lek / Wikimedia Commons')
 ],
 'Gouda Markt':[
  local('Gouda Markt','豪達 Markt 廣場與市政廳'),
  local('Gouda Waag','豪達 De Goudse Waag'),
  local('Sint-Janskerk','豪達聖約翰教堂')
 ],
 'Anne Frank Huis':[
  local('Anne Frank Huis','阿姆斯特丹安妮之家'),
  commons('AnneFrankHuisAmsterdam.jpg','黃昏時的安妮之家','Massimo Catarinella / Wikimedia Commons'),
  commons('Anne Frank House, Amsterdam.JPG','安妮之家外觀','Supercarwaar / Wikimedia Commons')
 ],
 'Albert Cuyp Markt 街景':[
  local('Albert Cuyp Markt 街景','阿姆斯特丹 Albert Cuyp 市集街景'),
  commons('Albert Cuyp markt, foto1.JPG','Albert Cuyp 市集攤位','Alf van Beem / Wikimedia Commons'),
  commons('Albert Cuyp markt, foto7.JPG','Albert Cuyp 市集人潮與攤位','Alf van Beem / Wikimedia Commons')
 ],
 '科隆':[
  local('科隆','科隆城市與大教堂'),
  local('Hohenzollernbrücke','科隆霍亨索倫橋'),
  local('Schokoladenmuseum','科隆巧克力博物館')
 ],
 '鹿特丹':[
  local('鹿特丹','鹿特丹城市景觀'),
  local('Oude Haven','鹿特丹 Oude Haven'),
  local('Erasmusbrug','鹿特丹伊拉斯謨橋')
 ],
 'Kubuswoningen':[
  local('Kubuswoningen','鹿特丹方塊屋'),
  local('Oude Haven','方塊屋旁 Oude Haven'),
  local('鹿特丹-2','鹿特丹現代建築街景')
 ],
 'Depot':[
  local('Depot','鹿特丹 Depot Boijmans'),
  local('鹿特丹-3','鹿特丹博物館區'),
  local('Erasmusbrug','鹿特丹現代天際線')
 ],
 'Van Gogh Museum':[
  local('Van Gogh Museum','阿姆斯特丹梵谷博物館'),
  local('向日葵｜1889','梵谷《向日葵》'),
  local('杏花盛開｜1890','梵谷《杏花盛開》')
 ],
 'Zaanse Schans':[
  local('Zaanse Schans','贊斯風車村'),
  commons('Zaanse Schans windmills.jpg','贊斯風車村歷史風車','Gokul Ganesh Murali / Wikimedia Commons'),
  commons('Zaanse Schans Windmills.jpg','贊斯風車村河岸風景','Marchia Kalyanitta / Wikimedia Commons')
 ],
 'Kaaswinkeltje':[
  local('新增・豪達起司1','豪達起司店與起司'),
  local('新增・豪達起司2','不同熟成程度的豪達起司'),
  commons('Gouda Cheese.JPG','豪達起司輪','Wikimedia Commons')
 ]
};
