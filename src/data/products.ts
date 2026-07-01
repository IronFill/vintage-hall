import type {
  Product, ProductI18n, MaterialByIcon, ConditionByCategory, IconLabels, IconPaths, SellerInfo, RecentSale
} from '../types';

/** Lightweight seller directory — gives listings "a person behind them" without a full profile-page system. */
export const SELLERS: Record<string, SellerInfo> = {
  'Vintage Hall': { rating: 4.9, salesCount: 287, yearsActive: 12, verified: true },
  'Numizmat_99': { rating: 4.7, salesCount: 134, yearsActive: 6, verified: true },
  'ArtAntique_Kharkiv': { rating: 4.8, salesCount: 76, yearsActive: 4, verified: true },
  'OldWorld_Kyiv': { rating: 4.5, salesCount: 52, yearsActive: 3, verified: false }
};

/** Homepage "recently sold" feed (#"Последние продажи" feedback) — references real seeded products
    and their actual start/current prices rather than inventing numbers; only `soldMinutesAgo` is a
    presentation detail (rotates so the feed still feels live on repeat visits within a session). */
export const RECENT_SALES: RecentSale[] = [
  { productId: 7, soldMinutesAgo: 12 },
  { productId: 2, soldMinutesAgo: 47 },
  { productId: 12, soldMinutesAgo: 95 },
  { productId: 9, soldMinutesAgo: 188 },
];

/** Demo auction deadlines are offsets from load time, not calendar dates — the storefront
    never shows "Аукціон завершено" on featured lots no matter when the site is visited.
    In the browser bundle this evaluates on every page load, so countdowns are always live. */
const hoursFromNow = (h: number): string => new Date(Date.now() + h * 3_600_000).toISOString();

export const SEEDED_PRODUCTS: Product[] = [
  { id: 1, photo: 'https://picsum.photos/seed/antique-samovar/600/450', price: 4200, icon: 'samovar', category: 'decor', seller: 'Vintage Hall', saleType: 'shop',
    conditionGrade: 'Дуже добрий', dimensions: '32 × 22 см', weight: '2.4 кг', origin: 'Росія', rarity: 'common', certified: false,
    reviews: [
      { author: 'Олена К.', rating: 5, text: 'Самовар прийшов у чудовому стані, точно як на фото. Продавець оперативно відповідав на питання.', date: '2026-05-12' },
      { author: 'Ihor M.', rating: 4, text: 'Гарна річ, трохи довше їхала доставка, але все ціле і відповідає опису.', date: '2026-04-02' },
    ] },
  { id: 2, photo: 'https://picsum.photos/seed/pocket-watch-antique/600/450', icon: 'watch', category: 'decor', seller: 'Vintage Hall', saleType: 'auction',
    startPrice: 5000, currentBid: 5600, bidStep: 200, bidsCount: 3, endTime: hoursFromNow(8), watchingNow: 23, bidsLastHour: 2, buyNowPrice: 8500,
    conditionGrade: 'Добрий, механізм робочий', dimensions: '5 × 4 см', weight: '85 г', origin: 'Швейцарія', rarity: 'rare', badge: 'expert', certified: true,
    investmentRating: 4, priceGrowthPct: 28, priceGrowthYears: 5, expertId: 'bondar',
    priceHistory: [{ year: 2021, price: 3800 }, { year: 2023, price: 4600 }, { year: 2025, price: 5200 }],
    qa: [
      { author: 'Petro_M', question: 'Механізм оригінальний чи замінений?', answerAuthor: 'Михайло Бондар', answerIsExpert: true, answer: 'Механізм оригінальний, швейцарського виробництва. Циферблат і стрілки відповідають заявленому періоду, слідів заміни не виявлено.' },
    ],
    bidHistory: [
      { user: 'Олена_К', bid: 5600, time: '2026-06-27T19:40:00Z' },
      { user: 'Ivan_K', bid: 5400, time: '2026-06-27T17:05:00Z' },
      { user: 'Petro_M', bid: 5200, time: '2026-06-27T12:20:00Z' }
    ] },
  { id: 3, photo: 'https://picsum.photos/seed/porcelain-vase/600/450', price: 3100, icon: 'vase', category: 'decor', seller: 'Vintage Hall', saleType: 'shop',
    conditionGrade: 'Добрий, невеликий скол', dimensions: '28 × 14 см', weight: '900 г', origin: 'Україна', rarity: 'common', certified: false },
  { id: 4, photo: 'https://picsum.photos/seed/bronze-candle/600/450', price: 2400, icon: 'candle', category: 'decor', seller: 'Vintage Hall', saleType: 'shop',
    conditionGrade: 'Дуже добрий', dimensions: '24 × 9 см (пара)', weight: '1.1 кг', origin: 'Франція', rarity: 'common', certified: false },
  { id: 5, photo: 'https://picsum.photos/seed/framed-mirror/600/450', price: 5600, icon: 'mirror', category: 'decor', seller: 'Vintage Hall', saleType: 'shop',
    conditionGrade: 'Добрий, часткова втрата позолоти', dimensions: '70 × 50 см', weight: '4.2 кг', origin: 'Україна', rarity: 'rare', badge: 'premium', certified: false },
  { id: 6, photo: 'https://picsum.photos/seed/jewelry-box/600/450', price: 1900, icon: 'box', category: 'decor', seller: 'Vintage Hall', saleType: 'shop',
    conditionGrade: 'Дуже добрий', dimensions: '18 × 12 × 8 см', weight: '650 г', origin: 'Україна', rarity: 'common', certified: false },
  { id: 7, photo: 'https://picsum.photos/seed/ruble-nicholas/600/450', icon: 'coin', category: 'numismatics', seller: 'Numizmat_99', saleType: 'auction',
    startPrice: 3000, currentBid: 3750, bidStep: 150, bidsCount: 5, endTime: hoursFromNow(30), watchingNow: 41, bidsLastHour: 3, buyNowPrice: 5500,
    conditionGrade: 'XF', dimensions: 'Ø 33.6 мм', weight: '20 г', origin: 'Російська імперія', rarity: 'rare', badge: 'expert', certified: true,
    investmentRating: 5, priceGrowthPct: 42, priceGrowthYears: 5, expertId: 'kovalenko',
    priceHistory: [{ year: 2022, price: 2650 }, { year: 2023, price: 3000 }, { year: 2024, price: 3400 }, { year: 2026, price: 3750 }],
    qa: [
      { author: 'Marta', question: 'Чи є патина оригінальною, чи чищена монета?', answerAuthor: 'Іван Коваленко', answerIsExpert: true, answer: 'Патина рівномірна та природна, ознак чистки чи штучного тонування не виявлено. Стан відповідає заявленому XF.' },
      { author: 'Sergiy', question: 'Чи підходить для колекції за роком, чи це поширений тираж?', answerAuthor: 'Numizmat_99', answer: 'Тираж цього року не масовий, тому монета цікава саме як показовий екземпляр періоду.' },
    ],
    bidHistory: [
      { user: 'Alex_V', bid: 3750, time: '2026-06-27T18:30:00Z' },
      { user: 'Sergiy', bid: 3600, time: '2026-06-27T16:10:00Z' },
      { user: 'Alex_V', bid: 3450, time: '2026-06-27T14:50:00Z' },
      { user: 'Marta', bid: 3300, time: '2026-06-27T10:15:00Z' },
      { user: 'Sergiy', bid: 3150, time: '2026-06-26T21:00:00Z' }
    ] },
  { id: 8, photo: 'https://picsum.photos/seed/ussr-ruble/600/450', price: 850, icon: 'coin', category: 'numismatics', seller: 'Vintage Hall', saleType: 'shop',
    conditionGrade: 'UNC', dimensions: 'Ø 31 мм', weight: '12.8 г', origin: 'СРСР', rarity: 'common', certified: false },
  { id: 9, photo: 'https://picsum.photos/seed/poltina-coin/600/450', icon: 'coin', category: 'numismatics', seller: 'Numizmat_99', saleType: 'auction',
    startPrice: 1200, currentBid: 1400, bidStep: 100, bidsCount: 2, endTime: hoursFromNow(76), watchingNow: 14, bidsLastHour: 1, buyNowPrice: 2200,
    conditionGrade: 'VF', dimensions: 'Ø 26.7 мм', weight: '10 г', origin: 'СРСР', rarity: 'rare', certified: true,
    bidHistory: [
      { user: 'Marta', bid: 1400, time: '2026-06-27T15:00:00Z' },
      { user: 'Oleh', bid: 1300, time: '2026-06-27T09:30:00Z' }
    ] },
  { id: 10, photo: 'https://picsum.photos/seed/mantel-clock/600/450', icon: 'watch', category: 'special', seller: 'Vintage Hall', saleType: 'request',
    conditionGrade: 'Експертний стан', dimensions: '38 × 24 × 16 см', weight: '6.5 кг', origin: 'Франція', rarity: 'unique', badge: 'museum', certified: true,
    investmentRating: 5, priceGrowthPct: 35, priceGrowthYears: 5 },
  { id: 11, photo: 'https://picsum.photos/seed/walnut-suite/600/450', icon: 'mirror', category: 'special', seller: 'Vintage Hall', saleType: 'request',
    conditionGrade: 'Реставровано фахово', dimensions: 'Стіл 120×80 см + 4 стільці', weight: '—', origin: 'Україна', rarity: 'unique', badge: 'museum', certified: true,
    investmentRating: 4, priceGrowthPct: 25, priceGrowthYears: 5 },
  { id: 12, photo: '/images/products/little-hostess-pair.jpg', extraPhotos: ['/images/products/little-hostess-mark.jpg'],
    icon: 'figurine', category: 'porcelain', seller: 'Vintage Hall', saleType: 'shop', price: 5000,
    conditionGrade: 'Дуже добрий', dimensions: '16 × 11 см (кожна)', weight: '420 г (пара)', origin: 'СРСР', rarity: 'rare', badge: 'certified', certified: true,
    investmentRating: 4, priceGrowthPct: 31, priceGrowthYears: 5, expertId: 'semenova',
    qa: [
      { author: 'Tetiana_L', question: 'Це точно Дулєво, чи могла бути копія іншого заводу?', answerAuthor: 'Олена Семенова', answerIsExpert: true, answer: 'Клеймо та стиль розпису однозначно вказують на Дулєвський фарфоровий завод, серія «Маленька господиня» 1958 року.' },
    ],
    priceHistory: [{ year: 2022, price: 3400 }, { year: 2024, price: 4300 }, { year: 2026, price: 5000 }],
    provenance: {
      uk: "Придбано у приватної колекції в Харкові 2019 року. Заводське клеймо та маркування «2С-58г» на дні підтверджують оригінальність і рік випуску.",
      en: "Acquired from a private Kharkiv collection in 2019. The factory mark and \"2С-58г\" code on the base confirm authenticity and year of production.",
      pl: "Nabyte z prywatnej kolekcji w Charkowie w 2019 roku. Znak fabryczny i kod „2С-58г” na spodzie potwierdzają autentyczność i rok produkcji.",
      ru: "Приобретено из частной коллекции в Харькове в 2019 году. Заводское клеймо и маркировка «2С-58г» на дне подтверждают подлинность и год выпуска."
    },
    reviews: [
      { author: 'Марина С.', rating: 5, text: 'Неймовірна пара! Стан як новий, навіть клеймо чітке. Дуже задоволена покупкою.', date: '2026-03-18' },
      { author: 'Дмитро В.', rating: 5, text: 'Точно автентика, перевіряв клеймо окремо у фахівця. Все підтвердилось.', date: '2026-02-04' },
      { author: 'Tetiana_L', rating: 4, text: 'Гарні статуетки, упаковка надійна. Один незначний потертий край, про що продавець попередив завчасно.', date: '2025-12-20' },
    ] },
  { id: 13, photo: 'https://picsum.photos/seed/steppe-painting/600/450', icon: 'painting', category: 'painting', seller: 'ArtAntique_Kharkiv', saleType: 'shop', price: 8500,
    conditionGrade: 'Добра, кракелюр лаку', dimensions: '54 × 38 см (у рамі)', weight: '1.8 кг', origin: 'Україна', rarity: 'rare', badge: 'expert', certified: true,
    investmentRating: 4, priceGrowthPct: 38, priceGrowthYears: 5, expertId: 'tkachuk',
    priceHistory: [{ year: 2022, price: 6100 }, { year: 2023, price: 6900 }, { year: 2024, price: 7600 }, { year: 2026, price: 8500 }],
    qa: [
      { author: 'Olha P.', question: 'Чи реставрувалось полотно, чи це оригінальний стан?', answerAuthor: 'Анна Ткачук', answerIsExpert: true, answer: 'Слідів суттєвої реставрації немає, кракелюр природний і рівномірний — типовий для полотна цього віку без втручання.' },
    ],
    reviews: [
      { author: 'Andrii_K', rating: 5, text: 'Картина перевершила очікування — колір живий, кракелюр саме такий, який характерний для віку полотна. Експертний висновок додано.', date: '2026-01-15' },
      { author: 'Olha P.', rating: 4, text: 'Чудова робота, але доставка велогабаритного полотна коштувала дорожче, ніж очікувала. Сама картина — без претензій.', date: '2025-11-30' },
    ] },
  { id: 14, photo: 'https://picsum.photos/seed/militaria-badge/600/450', icon: 'medal', category: 'militaria', seller: 'OldWorld_Kyiv', saleType: 'auction',
    startPrice: 1800, currentBid: 1950, bidStep: 100, bidsCount: 1, endTime: hoursFromNow(130), watchingNow: 9, bidsLastHour: 1, buyNowPrice: 2900,
    conditionGrade: 'Добрий, потертості емалі', dimensions: '4.5 × 3 см', weight: '18 г', origin: 'Австро-Угорщина', rarity: 'rare', certified: false,
    bidHistory: [
      { user: 'Roman_T', bid: 1950, time: '2026-06-27T20:00:00Z' }
    ] },
  { id: 15, photo: 'https://picsum.photos/seed/silver-brooch/600/450', icon: 'ring', category: 'jewelry', seller: 'Vintage Hall', saleType: 'shop', price: 3200,
    conditionGrade: 'Дуже добрий', dimensions: '5 × 3 см', weight: '14 г', origin: 'Україна', rarity: 'unique', badge: 'certified', certified: true,
    investmentRating: 3, priceGrowthPct: 18, priceGrowthYears: 5 }
];

/** First id assigned to a listing created through the cabinet at runtime. */
export const NEXT_LOT_ID = 16;

export const PRODUCT_I18N: Record<number, ProductI18n> = {
  1: { uk: { name: "Самовар тульський", era: "Кін. XIX ст.", desc: "Латунний самовар із гравіюванням, у робочому стані." },
       en: { name: "Tula Samovar", era: "Late 19th c.", desc: "Brass samovar with engraving, in working condition." },
       pl: { name: "Samowar tulski", era: "Kon. XIX w.", desc: "Mosiężny samowar z grawerunkiem, w stanie sprawnym." },
       ru: { name: "Самовар тульский", era: "Кон. XIX в.", desc: "Латунный самовар с гравировкой, в рабочем состоянии." } },
  2: { uk: { name: "Кишеньковий годинник", era: "Поч. XX ст.", desc: "Швейцарський механізм, срібний корпус, на ланцюжку." },
       en: { name: "Pocket Watch", era: "Early 20th c.", desc: "Swiss movement, silver case, with chain." },
       pl: { name: "Zegarek kieszonkowy", era: "Pocz. XX w.", desc: "Szwajcarski mechanizm, srebrna obudowa, na łańcuszku." },
       ru: { name: "Карманные часы", era: "Нач. XX в.", desc: "Швейцарский механизм, серебряный корпус, на цепочке." } },
  3: { uk: { name: "Фарфорова ваза", era: "1900–1910", desc: "Ручний розпис, невеликий скол на основі." },
       en: { name: "Porcelain Vase", era: "1900–1910", desc: "Hand-painted, small chip on the base." },
       pl: { name: "Wazon porcelanowy", era: "1900–1910", desc: "Ręcznie malowany, mały odprysk na podstawie." },
       ru: { name: "Фарфоровая ваза", era: "1900–1910", desc: "Ручная роспись, небольшой скол на основании." } },
  4: { uk: { name: "Бронзовий підсвічник", era: "Сер. XIX ст.", desc: "Парний, лита бронза, природна патина." },
       en: { name: "Bronze Candlestick", era: "Mid-19th c.", desc: "Pair, cast bronze, natural patina." },
       pl: { name: "Świecznik z brązu", era: "Poł. XIX w.", desc: "Para, lity brąz, naturalna patyna." },
       ru: { name: "Подсвечник бронзовый", era: "Сер. XIX в.", desc: "Парный, литая бронза, естественная патина." } },
  5: { uk: { name: "Дзеркало в рамі", era: "Кін. XIX ст.", desc: "Різьблена дерев'яна рама, позолота частково збережена." },
       en: { name: "Framed Mirror", era: "Late 19th c.", desc: "Carved wooden frame, gilding partially preserved." },
       pl: { name: "Zwierciadło w ramie", era: "Kon. XIX w.", desc: "Rzeźbiona drewniana rama, częściowo zachowane złocenie." },
       ru: { name: "Зеркало в раме", era: "Кон. XIX в.", desc: "Резная деревянная рама, позолота частично сохранена." } },
  6: { uk: { name: "Скринька для прикрас", era: "1920-ті", desc: "Дерево та інкрустація перламутром, із замочком." },
       en: { name: "Jewelry Box", era: "1920s", desc: "Wood with mother-of-pearl inlay, with a small lock." },
       pl: { name: "Szkatułka na biżuterię", era: "Lata 20. XX w.", desc: "Drewno z inkrustacją macicą perłową, z zameczkiem." },
       ru: { name: "Шкатулка для украшений", era: "1920-е", desc: "Дерево и инкрустация перламутром, с замочком." } },
  7: { uk: { name: "Рубль Миколи II", era: "1898 р.", desc: "Срібло 900-ї проби, збереженість XF." },
       en: { name: "Nicholas II Ruble", era: "1898", desc: "900 silver, XF condition." },
       pl: { name: "Rubel Mikołaja II", era: "1898", desc: "Srebro próby 900, stan XF." },
       ru: { name: "Рубль Николая II", era: "1898 г.", desc: "Серебро 900-й пробы, сохранность XF." } },
  8: { uk: { name: "Ювілейний рубль СРСР", era: "1965 р.", desc: "«20 років Перемоги», без патини, штемпельний блиск." },
       en: { name: "USSR Commemorative Ruble", era: "1965", desc: "\u201C20 Years of Victory\u201D, no patina, mint luster." },
       pl: { name: "Rubel jubileuszowy ZSRR", era: "1965", desc: "„20 lat Zwycięstwa”, bez patyny, blask stemplowy." },
       ru: { name: "Юбилейный рубль СССР", era: "1965 г.", desc: "«20 лет Победы», без патины, штемпельный блеск." } },
  9: { uk: { name: "Монета-полтина", era: "1924 р.", desc: "Срібло, перші радянські випуски, добрий стан." },
       en: { name: "Poltina Coin", era: "1924", desc: "Silver, early Soviet issue, good condition." },
       pl: { name: "Moneta połtina", era: "1924", desc: "Srebro, pierwsze emisje sowieckie, dobry stan." },
       ru: { name: "Монета-полтина", era: "1924 г.", desc: "Серебро, первые советские выпуски, хорошее состояние." } },
  10: { uk: { name: "Французький камінний годинник", era: "Сер. XIX ст.", desc: "Бронза і мармур, механізм з боєм, єдиний екземпляр в наявності." },
        en: { name: "French Mantel Clock", era: "Mid-19th c.", desc: "Bronze and marble, striking movement, one-of-a-kind piece in stock." },
        pl: { name: "Francuski zegar kominkowy", era: "Poł. XIX w.", desc: "Brąz i marmur, mechanizm z biciem, jedyny egzemplarz w magazynie." },
        ru: { name: "Каминные часы французские", era: "Сер. XIX в.", desc: "Бронза и мрамор, механизм с боем, единственный экземпляр в наличии." } },
  11: { uk: { name: "Гарнітур з горіха", era: "1880-ті", desc: "Стіл і чотири стільці, авторська робота, провенанс підтверджено." },
        en: { name: "Walnut Suite", era: "1880s", desc: "Table and four chairs, signed work, provenance confirmed." },
        pl: { name: "Komplet orzechowy", era: "Lata 80. XIX w.", desc: "Stół i cztery krzesła, praca autorska, potwierdzona proweniencja." },
        ru: { name: "Гарнитур из ореха", era: "1880-е", desc: "Стол и четыре стула, авторская работа, провенанс подтверждён." } },
  12: { uk: { name: "Парні статуетки «Маленька хазяйка»", era: "1958 р.", desc: "Фарфорові статуетки узбечок із чайником, Дулевський завод, скульптор О. М. Богданова. На дні — заводське клеймо та маркування «2С-58г», що підтверджує рік випуску. Яскравий ручний розпис із золоченням, парний комплект у гарному стані." },
        en: { name: 'Pair of "Little Hostess" Figurines', era: "1958", desc: "Porcelain figurines of Uzbek girls with teapots, Dulevo Factory, sculptor O. M. Bogdanova. The base bears the factory mark and \"2С-58г\" code confirming the year of production. Bright hand-painted decoration with gilding, a matched pair in good condition." },
        pl: { name: "Para figurek „Mała Gospodyni”", era: "1958", desc: "Porcelanowe figurki uzbeckich dziewczynek z czajnikami, fabryka Dulewo, autorstwa O. M. Bogdanowej. Na spodzie widoczny znak fabryczny oraz kod „2С-58г” potwierdzający rok produkcji. Jaskrawe, ręcznie malowane zdobienia ze złoceniem, kompletna para w dobrym stanie." },
        ru: { name: "Парные статуэтки «Маленькая хозяйка»", era: "1958 г.", desc: "Фарфоровые статуэтки узбечек с чайником, Дулёвский завод, скульптор О. М. Богданова. На дне — заводское клеймо и маркировка «2С-58г», подтверждающая год выпуска. Яркая ручная роспись с золочением, парный комплект в хорошем состоянии." } },
  13: { uk: { name: "Степовий пейзаж", era: "Кін. XIX ст.", desc: "Олія, полотно, академічна школа. Підпис художника в правому нижньому куті, авторство атрибутовано експертом галереї." },
        en: { name: "Steppe Landscape", era: "Late 19th c.", desc: "Oil on canvas, academic school. Artist's signature in the lower right corner, attribution confirmed by a gallery expert." },
        pl: { name: "Pejzaż stepowy", era: "Kon. XIX w.", desc: "Olej na płótnie, szkoła akademicka. Podpis artysty w prawym dolnym rogu, autorstwo potwierdzone przez eksperta galerii." },
        ru: { name: "Степной пейзаж", era: "Кон. XIX в.", desc: "Масло, холст, академическая школа. Подпись художника в правом нижнем углу, авторство атрибутировано экспертом галереи." } },
  14: { uk: { name: "Нагрудний знак, період ПМВ", era: "1914–1918", desc: "Емалевий нагрудний знак австро-угорської армії. Потертості емалі відповідають віку, без реставрації." },
        en: { name: "WWI-era Breast Badge", era: "1914–1918", desc: "Enamel breast badge of the Austro-Hungarian army. Enamel wear consistent with age, no restoration." },
        pl: { name: "Odznaka z okresu I wojny światowej", era: "1914–1918", desc: "Emaliowana odznaka armii austro-węgierskiej. Przetarcia emalii zgodne z wiekiem, bez renowacji." },
        ru: { name: "Нагрудный знак периода ПМВ", era: "1914–1918", desc: "Эмалевый нагрудный знак австро-венгерской армии. Потёртости эмали соответствуют возрасту, без реставрации." } },
  15: { uk: { name: "Срібна брошка з бірюзою", era: "Поч. XX ст.", desc: "Срібло 875-ї проби, авторська філігрань, природна бірюза без обробки." },
        en: { name: "Silver Brooch with Turquoise", era: "Early 20th c.", desc: "875 silver, signed filigree work, natural untreated turquoise." },
        pl: { name: "Srebrna broszka z turkusem", era: "Pocz. XX w.", desc: "Srebro próby 875, autorska filigran, naturalny, nieobrobiony turkus." },
        ru: { name: "Серебряная брошь с бирюзой", era: "Нач. XX в.", desc: "Серебро 875-й пробы, авторская филигрань, природная бирюза без обработки." } }
};

export const MATERIAL_BY_ICON: MaterialByIcon = {
  samovar: { uk: "Латунь", en: "Brass", pl: "Mosiądz", ru: "Латунь" },
  watch: { uk: "Срібло, механізм", en: "Silver, mechanical movement", pl: "Srebro, mechanizm", ru: "Серебро, механизм" },
  vase: { uk: "Фарфор", en: "Porcelain", pl: "Porcelana", ru: "Фарфор" },
  candle: { uk: "Бронза", en: "Bronze", pl: "Brąz", ru: "Бронза" },
  mirror: { uk: "Дерево, скло", en: "Wood, glass", pl: "Drewno, szkło", ru: "Дерево, стекло" },
  box: { uk: "Дерево, перламутр", en: "Wood, mother-of-pearl", pl: "Drewno, macica perłowa", ru: "Дерево, перламутр" },
  coin: { uk: "Срібло", en: "Silver", pl: "Srebro", ru: "Серебро" },
  figurine: { uk: "Фарфор, ручний розпис, золочення", en: "Porcelain, hand-painted, gilding", pl: "Porcelana, ręcznie malowana, złocenie", ru: "Фарфор, ручная роспись, золочение" },
  painting: { uk: "Олія, полотно", en: "Oil on canvas", pl: "Olej na płótnie", ru: "Масло, холст" },
  medal: { uk: "Метал, емаль", en: "Metal, enamel", pl: "Metal, emalia", ru: "Металл, эмаль" },
  ring: { uk: "Срібло, бірюза", en: "Silver, turquoise", pl: "Srebro, turkus", ru: "Серебро, бирюза" },
  sword: { uk: "Метал, шкіра", en: "Metal, leather", pl: "Metal, skóra", ru: "Металл, кожа" }
};

export const CONDITION_BY_CAT: ConditionByCategory = {
  decor: { uk: "Добрий стан, ознаки часу збережено", en: "Good condition, natural signs of age", pl: "Dobry stan, naturalne ślady czasu", ru: "Хорошее состояние, естественные следы времени" },
  numismatics: { uk: "Стан за фото, без реставрації", en: "Condition as shown in photos, no restoration", pl: "Stan według zdjęć, bez renowacji", ru: "Состояние по фото, без реставрации" },
  special: { uk: "Унікальний екземпляр, провенанс підтверджено", en: "One-of-a-kind piece, provenance confirmed", pl: "Unikatowy egzemplarz, potwierdzona proweniencja", ru: "Единственный экземпляр, провенанс подтверждён" },
  porcelain: { uk: "Авторська робота, оригінальний розпис, клеймо заводу збережено", en: "Studio piece, original painting, factory mark preserved", pl: "Praca autorska, oryginalne malowanie, zachowany znak fabryczny", ru: "Авторская работа, оригинальная роспись, клеймо завода сохранено" },
  silver: { uk: "Проба підтверджена, без деформацій", en: "Hallmark confirmed, no deformation", pl: "Próba potwierdzona, brak deformacji", ru: "Проба подтверждена, без деформаций" },
  painting: { uk: "Стан за експертною оцінкою галереї", en: "Condition per gallery expert assessment", pl: "Stan według oceny eksperta galerii", ru: "Состояние по экспертной оценке галереи" },
  militaria: { uk: "Потертості відповідають віку, без реставрації", en: "Wear consistent with age, no restoration", pl: "Przetarcia zgodne z wiekiem, bez renowacji", ru: "Потёртости соответствуют возрасту, без реставрации" },
  jewelry: { uk: "Камені природні, без обробки", en: "Natural untreated stones", pl: "Naturalne, nieobrobione kamienie", ru: "Камни природные, без обработки" },
  clocks: { uk: "Механізм перевірено, на ходу", en: "Movement checked, running", pl: "Mechanizm sprawdzony, działa", ru: "Механизм проверен, на ходу" },
  glass: { uk: "Без тріщин, природна патина", en: "No cracks, natural patina", pl: "Brak pęknięć, naturalna patyna", ru: "Без трещин, естественная патина" },
  philately: { uk: "Стан за каталогом Міхеля", en: "Condition per Michel catalog", pl: "Stan według katalogu Michel", ru: "Состояние по каталогу Михеля" },
  books: { uk: "Усі сторінки на місці, без плям", en: "All pages present, no stains", pl: "Wszystkie strony obecne, bez plam", ru: "Все страницы на месте, без пятен" }
};

export const ICON_LABELS: IconLabels = {
  samovar: { uk: "Самовар / посуд", en: "Samovar / vessel", pl: "Samowar / naczynie", ru: "Самовар / посуда" },
  watch: { uk: "Годинник", en: "Watch / clock", pl: "Zegar / zegarek", ru: "Часы" },
  vase: { uk: "Ваза / фарфор", en: "Vase / porcelain", pl: "Wazon / porcelana", ru: "Ваза / фарфор" },
  candle: { uk: "Підсвічник", en: "Candlestick", pl: "Świecznik", ru: "Подсвечник" },
  mirror: { uk: "Дзеркало / меблі", en: "Mirror / furniture", pl: "Zwierciadło / meble", ru: "Зеркало / мебель" },
  box: { uk: "Скринька / шкатулка", en: "Box / case", pl: "Szkatułka", ru: "Шкатулка" },
  coin: { uk: "Монета", en: "Coin", pl: "Moneta", ru: "Монета" },
  figurine: { uk: "Статуетка / фарфор", en: "Figurine / porcelain", pl: "Figurka / porcelana", ru: "Статуэтка / фарфор" },
  painting: { uk: "Картина / живопис", en: "Painting", pl: "Obraz", ru: "Картина / живопись" },
  medal: { uk: "Медаль / нагрудний знак", en: "Medal / badge", pl: "Medal / odznaka", ru: "Медаль / нагрудный знак" },
  ring: { uk: "Прикраса / ювелірика", en: "Jewelry piece", pl: "Biżuteria", ru: "Украшение / ювелирика" },
  sword: { uk: "Зброя / військова історія", en: "Weapon / militaria", pl: "Broń / militaria", ru: "Оружие / военная история" }
};

/** Inner SVG path data for each item type, drawn in a 0..100 viewBox. */
export const ICON_PATHS: IconPaths = {
  samovar: '<path d="M35 35 Q35 20 50 20 Q65 20 65 35 L65 70 Q65 80 50 80 Q35 80 35 70 Z"/><path d="M30 35 L70 35"/><path d="M45 80 L45 88 M55 80 L55 88"/><circle cx="50" cy="50" r="3"/>',
  watch: '<circle cx="50" cy="55" r="22"/><path d="M50 55 L50 42 M50 55 L58 60"/><path d="M42 30 L58 30 M50 30 L50 33"/>',
  vase: '<path d="M40 25 Q38 40 30 50 Q26 65 38 75 L62 75 Q74 65 70 50 Q62 40 60 25 Z"/><path d="M40 25 L60 25"/>',
  candle: '<path d="M30 75 L70 75"/><path d="M40 75 L40 60 Q40 50 50 50 Q60 50 60 60 L60 75"/><path d="M50 50 L50 25"/><path d="M50 25 Q46 18 50 12 Q54 18 50 25"/>',
  mirror: '<ellipse cx="50" cy="45" rx="22" ry="28"/><path d="M50 73 L50 85 M40 85 L60 85"/>',
  box: '<rect x="25" y="40" width="50" height="32" rx="2"/><path d="M25 50 L75 50"/><circle cx="50" cy="58" r="3"/>',
  coin: '<circle cx="50" cy="50" r="27"/><circle cx="50" cy="50" r="19" stroke-dasharray="2 3"/><path d="M50 38 L50 62 M41 50 L59 50"/>',
  figurine: '<circle cx="50" cy="30" r="9"/><path d="M34 48 Q34 38 50 38 Q66 38 66 48 L70 78 Q70 86 58 86 L42 86 Q30 86 30 78 Z"/><circle cx="64" cy="58" r="4"/><path d="M40 86 L40 92 M60 86 L60 92"/>',
  painting: '<rect x="20" y="20" width="60" height="50" rx="2"/><path d="M28 60 L45 42 L55 52 L65 38 L72 60Z"/><circle cx="62" cy="32" r="4"/>',
  medal: '<circle cx="50" cy="38" r="16"/><path d="M42 52 L34 82 L50 72 L66 82 L58 52"/>',
  ring: '<circle cx="50" cy="58" r="20"/><circle cx="50" cy="58" r="13"/><path d="M50 38 L44 28 L56 28 Z"/>',
  sword: '<path d="M22 20 L78 76"/><path d="M30 12 L14 28"/><path d="M70 84 L86 68"/><path d="M78 20 L22 76"/><path d="M70 12 L86 28"/><path d="M30 84 L14 68"/>'
};
