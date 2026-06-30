import type { NewsArticle, ForumTopic, QuickMessage } from '../types';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1, category: 'numismatics', date: '2026-06-25', author: 'Олексій Мельник',
    imageUrl: 'https://picsum.photos/seed/chernihiv-coin/600/400',
    title: {
      uk: 'Рідкісну монету Київської Русі знайдено під час розкопок у Чернігові',
      en: 'Rare Kyivan Rus coin discovered during Chernihiv excavations',
      pl: 'Rzadka moneta Rusi Kijowskiej znaleziona podczas wykopalisk w Czernihowie',
      ru: 'Редкую монету Киевской Руси нашли при раскопках в Чернигове'
    },
    excerpt: {
      uk: 'Срібний денарій XI століття у чудовому стані — лише третій відомий екземпляр у світі. Експерти оцінюють знахідку в понад 200 000 ₴.',
      en: 'An 11th-century silver denarius in excellent condition — only the third known specimen in the world. Experts estimate the find at over 200,000 ₴.',
      pl: 'Srebrny denar z XI wieku w doskonałym stanie — zaledwie trzeci znany egzemplarz na świecie.',
      ru: 'Серебряный денарий XI века в отличном состоянии — лишь третий известный экземпляр в мире.'
    },
    body: {
      uk: "Знахідку зробили будівельники під час прокладання комунікацій у центрі Чернігова. На монеті — зображення князівського знаку та напис кириличним письмом. За попередньою оцінкою нумізматів, подібні екземпляри востаннє продавались на міжнародних аукціонах понад 10 років тому. Зараз монета передана на дослідження до Інституту археології, але вже привернула увагу колекціонерів з усього світу.\n\nПро подальшу долю монети поки невідомо — за законодавством, знахідки, кваліфіковані як культурна цінність, мають пройти процедуру держреєстрації, перш ніж власник зможе розпорядитися ними на власний розсуд, включно з можливим продажем через ліцензовані майданчики на кшталт Vintage Hall.\n\nБудівельники, що знайшли монету, отримають винагороду відповідно до закону — у середньому це 25% від оціночної вартості знахідки, якщо вона визнана культурною цінністю та передається державі.",
      en: "The find was made by construction workers laying utilities in central Chernihiv. The coin bears a princely emblem and Cyrillic inscription. According to preliminary numismatic assessment, similar specimens last sold at international auctions over a decade ago. The coin has been handed over to the Institute of Archaeology for study, but has already drawn attention from collectors worldwide.\n\nThe construction crew that found the coin stands to receive a finder\'s reward under Ukrainian law — typically around 25% of the appraised value once the find is officially registered as a cultural asset.",
      pl: "Znalezisko odkryli robotnicy budowlani podczas prac instalacyjnych w centrum Czernihowa. Na monecie widoczny jest znak ksiazecy i cyrylicki napis. Wedlug wstepnej oceny numizmatykow, podobne egzemplarze sprzedawano na aukcjach miedzynarodowych ponad dekade temu.\n\nEkipa budowlana, ktora znalazla monete, moze otrzymac nagrode zgodnie z prawem — zwykle okolo 25% wartosci szacunkowej po oficjalnej rejestracji znaleziska.",
      ru: "Находку сделали строители при прокладке коммуникаций в центре Чернигова. На монете — изображение княжеского знака и надпись кириллическим письмом. По предварительной оценке нумизматов, подобные экземпляры продавались на международных аукционах более 10 лет назад.\n\nСтроители, нашедшие монету, могут получить вознаграждение согласно закону — как правило, около 25% от оценочной стоимости после официальной регистрации находки как культурной ценности."
    }
  },
  {
    id: 2, category: 'archaeology', date: '2026-06-22', author: 'Марія Коваленко',
    imageUrl: 'https://picsum.photos/seed/scythian-mound/600/400',
    title: {
      uk: 'Під Одесою виявили скіфський курган з золотими прикрасами',
      en: 'Scythian burial mound with gold jewelry discovered near Odesa',
      pl: 'Pod Odessą odkryto kurhan scytyjski ze złotą biżuterią',
      ru: 'Под Одессой обнаружили скифский курган с золотыми украшениями'
    },
    excerpt: {
      uk: 'Археологи знайшли 47 золотих предметів, включаючи пекторалі та сережки IV століття до н.е. Розкопки тривають.',
      en: 'Archaeologists found 47 gold items including pectorals and earrings from the 4th century BC. Excavations continue.',
      pl: 'Archeolodzy znaleźli 47 złotych przedmiotów, w tym pektorały i kolczyki z IV wieku p.n.e.',
      ru: 'Археологи нашли 47 золотых предметов, включая пекторали и серьги IV века до н.э.'
    },
    body: {
      uk: "Курган датується IV століттям до нашої ери і належав, ймовірно, скіфському воєначальнику. Окрім золота, археологи виявили залишки кінської упряжі та зброю. Дослідження триватиме ще щонайменше рік — команда сподівається знайти основну поховальну камеру під насипом.\n\nМісцева влада вже звернулася до Міністерства культури з проханням профінансувати створення невеликого музею просто неба на місці розкопок — подібний прецедент є в Херсонській області, де курган перетворили на туристичний об\'єкт за два роки.",
      en: "The mound dates to the 4th century BC and likely belonged to a Scythian military leader. Besides gold, archaeologists found remnants of horse harness and weapons. Research will continue for at least another year — the team hopes to find the main burial chamber beneath the mound.\n\nLocal authorities have already asked the Ministry of Culture to fund a small open-air museum at the site — a similar precedent exists in Kherson region, where a burial mound became a tourist attraction within two years.",
      pl: "Kurhan datowany jest na IV wiek p.n.e. i nalezal najpewniej do scytyjskiego wojskowego. Oprocz zlota archeolodzy znalezli resztki uprzezy konskiej i bron. Badania bedą trwac co najmniej kolejny rok.\n\nLokalne władze zwróciły się już do Ministerstwa Kultury z prośbą o sfinansowanie niewielkiego muzeum pod gołym niebem w miejscu wykopalisk.",
      ru: "Курган датируется IV веком до нашей эры и принадлежал, вероятно, скифскому военачальнику. Помимо золота, археологи обнаружили остатки конской упряжи и оружие. Исследования продлятся ещё минимум год.\n\nМестные власти уже обратились в Министерство культуры с просьбой профинансировать создание небольшого музея под открытым небом на месте раскопок."
    }
  },
  {
    id: 3, category: 'interviews', date: '2026-06-20', author: 'Vintage Hall',
    imageUrl: 'https://picsum.photos/seed/collector-interview/600/400',
    title: {
      uk: 'Інтерв\'ю: Андрій Шевченко — «Моя колекція почалась з однієї монети на блошиному ринку»',
      en: 'Interview: Andriy Shevchenko — "My collection started with one coin at a flea market"',
      pl: 'Wywiad: Andrij Szewczenko — „Moja kolekcja zaczęła się od jednej monety na pchlim targu"',
      ru: 'Интервью: Андрей Шевченко — «Моя коллекция началась с одной монеты на блошином рынке»'
    },
    excerpt: {
      uk: 'Відомий колекціонер з Харкова розповідає, як за 20 років зібрав одну з найбільших приватних колекцій нумізматики в Україні.',
      en: 'A renowned Kharkiv collector tells how he built one of the largest private numismatic collections in Ukraine over 20 years.',
      pl: 'Znany kolekcjoner z Charkowa opowiada, jak przez 20 lat zebrał jedną z największych prywatnych kolekcji numizmatycznych.',
      ru: 'Известный коллекционер из Харькова рассказывает, как за 20 лет собрал одну из крупнейших частных коллекций нумизматики.'
    },
    body: {
      uk: "Андрій почав колекціонувати у 2006 році, придбавши пошкоджену копійку часів Петра I. Сьогодні його колекція включає понад 3000 монет, серед яких — кілька унікальних екземплярів імператорського періоду. Найважче, за його словами, не сама купівля, а вміння вчасно зупинитись.\n\nНайціннішим предметом колекції Андрій вважає не найдорожчу монету, а саму першу — пошкоджену копійку Петра I, яку він досі тримає окремо від решти, у простій коробці з-під сірників. «Решта — інвестиція. Ця — нагадування, з чого все почалось», — каже він.\n\nНа запитання про поради новачкам Андрій відповідає без вагань: спочатку прочитати щонайменше три каталожних довідники, перш ніж купити першу монету дорожче 500 гривень.",
      en: "Andriy started collecting in 2006, buying a damaged kopeck from the era of Peter I. Today his collection includes over 3,000 coins, including several unique imperial-era specimens. The hardest part, he says, isn't buying — it's knowing when to stop.\n\nAndriy says the most precious piece in his collection isn't the most expensive coin, but the very first one — the damaged kopeck — which he still keeps separately in a plain matchbox. \"The rest is an investment. This one is a reminder of where it all started,\" he says.",
      pl: "Andrij zaczal kolekcjonowac w 2006 roku, kupujac uszkodzona kopiejke z czasow Piotra I. Dzis jego kolekcja liczy ponad 3000 monet, w tym kilka unikatowych egzemplarzy z epoki imperialnej.\n\nAndrij mowi, ze najcenniejszym przedmiotem w jego kolekcji nie jest najdrozsza moneta, lecz ta pierwsza — uszkodzona kopiejka, ktora wciaz trzyma osobno, w zwyklym pudelku po zapalkach.",
      ru: "Андрей начал коллекционировать в 2006 году, купив повреждённую копейку времён Петра I. Сегодня его коллекция включает более 3000 монет, среди которых — несколько уникальных экземпляров императорского периода.\n\nАндрей говорит, что самым ценным предметом в его коллекции является не самая дорогая монета, а самая первая — повреждённая копейка, которую он до сих пор хранит отдельно, в обычной спичечной коробке."
    }
  },
  {
    id: 4, category: 'architecture', date: '2026-06-18', author: 'Ірина Бондар',
    imageUrl: 'https://picsum.photos/seed/potocki-palace/600/400',
    title: {
      uk: 'Реставрація палацу Потоцьких у Тульчині: знахідки під штукатуркою XVIII століття',
      en: 'Restoration of Potocki Palace in Tulchyn: discoveries beneath 18th-century plaster',
      pl: 'Restauracja pałacu Potockich w Tulczynie: odkrycia pod XVIII-wiecznym tynkiem',
      ru: 'Реставрация дворца Потоцких в Тульчине: находки под штукатуркой XVIII века'
    },
    excerpt: {
      uk: 'Реставратори виявили оригінальні фрески та ліпнину, приховані під пізнішими шарами. Частину артефактів планують виставити на аукціон.',
      en: 'Restorers discovered original frescoes and stucco hidden beneath later layers. Some artifacts are planned for auction.',
      pl: 'Restauratorzy odkryli oryginalne freski i sztukaterie ukryte pod późniejszymi warstwami.',
      ru: 'Реставраторы обнаружили оригинальные фрески и лепнину, скрытые под поздними слоями.'
    },
    body: {
      uk: "Палац будувався у 1782-1787 роках за проєктом французького архітектора. Реставратори вже передали частину знайдених декоративних елементів на експертизу — деякі з них можуть з'явитися на спеціалізованих аукціонах антикваріату вже наступного року.\n\nСеред знайдених фрагментів — частина ліпного плафону зі сценою з античної міфології та два кахельні панно, що збереглися майже без пошкоджень. Реставратори припускають, що подібні елементи могли прикрашати ще щонайменше три зали палацу, нині повністю втрачені.\n\nРоботи фінансуються спільно обласним бюджетом та приватним фондом збереження культурної спадщини — на завершення повної реставрації потрібно ще орієнтовно три роки.",
      en: "The palace was built between 1782 and 1787, designed by a French architect. Restorers have already submitted some of the discovered decorative elements for expert evaluation — some may appear at specialized antique auctions as early as next year.\n\nAmong the fragments found is part of a stucco ceiling medallion depicting a scene from antique mythology, along with two tile panels preserved almost intact. Restorers believe similar elements may have once decorated at least three other halls of the palace, now completely lost.",
      pl: "Palac zbudowano w latach 1782-1787 wedlug projektu francuskiego architekta. Restauratorzy przekazali juz czesc odnalezionych elementow dekoracyjnych do ekspertyzy.\n\nWsrod odnalezionych fragmentow jest czesc sztukaterii sufitowej ze scena z mitologii antycznej oraz dwa panele kafelkowe zachowane niemal bez uszkodzen.",
      ru: "Дворец строился в 1782-1787 годах по проекту французского архитектора. Реставраторы уже передали часть найденных декоративных элементов на экспертизу — некоторые могут появиться на специализированных аукционах антиквариата уже в следующем году.\n\nСреди найденных фрагментов — часть лепного плафона со сценой из античной мифологии и две кафельные панели, сохранившиеся почти без повреждений."
    }
  },
  {
    id: 5, category: 'numismatics', date: '2026-06-15', author: 'Сергій Петров',
    imageUrl: 'https://picsum.photos/seed/coin-storage/600/400',
    title: {
      uk: 'Як правильно зберігати монети: 7 помилок, які знищують вашу колекцію',
      en: 'How to properly store coins: 7 mistakes that destroy your collection',
      pl: 'Jak prawidłowo przechowywać monety: 7 błędów niszczących kolekcję',
      ru: 'Как правильно хранить монеты: 7 ошибок, которые уничтожают вашу коллекцию'
    },
    excerpt: {
      uk: 'ПВХ-кляссери, вологе приміщення, чистка зубною пастою — розбираємо типові помилки початківців.',
      en: 'PVC holders, humid rooms, toothpaste cleaning — we break down typical beginner mistakes.',
      pl: 'Klasery z PVC, wilgotne pomieszczenia, czyszczenie pastą do zębów — omawiamy typowe błędy.',
      ru: 'ПВХ-кляссеры, влажные помещения, чистка зубной пастой — разбираем типичные ошибки новичков.'
    },
    body: {
      uk: "Серед головних помилок — зберігання у ПВХ-кляссерах (виділяють шкідливі речовини), дотики голими руками (жирові відбитки викликають корозію) та спроби освіжити монету абразивними засобами. Експерти радять використовувати інертні капсули та бавовняні рукавички.\n\nЩе одна поширена помилка — зберігання колекції в банківському сейфі без контролю вологості: металеві сейфи самі по собі не регулюють мікроклімат, і без силікагелю всередині конденсат може утворитися навіть там.\n\nЕксперти Vintage Hall також не рекомендують підписувати конверти чи капсули звичайною кульковою ручкою впритул до монети — хімічний склад чорнила за роки може вступити в реакцію з металом.",
      en: "Among the main mistakes: storing in PVC holders (which release harmful substances), touching with bare hands (skin oils cause corrosion), and trying to refresh a coin with abrasive cleaners. Experts recommend inert capsules and cotton gloves.\n\nAnother common mistake is storing a collection in a bank safe without humidity control: metal safes don't regulate microclimate on their own, and without silica gel inside, condensation can form even there.",
      pl: "Wsrod glownych bledow: przechowywanie w klaserach PVC, dotykanie golymi rekami, proby czyszczenia srodkami sciernymi. Eksperci polecaja obojetne kapsulki i bawelniane rekawiczki.\n\nKolejny czesty blad to przechowywanie kolekcji w sejfie bankowym bez kontroli wilgotnosci — metalowe sejfy same w sobie nie regulują mikroklimatu.",
      ru: "Среди главных ошибок — хранение в ПВХ-кляссерах, прикосновения голыми руками, попытки освежить монету абразивными средствами. Эксперты советуют использовать инертные капсулы и хлопковые перчатки.\n\nЕщё одна распространённая ошибка — хранение коллекции в банковском сейфе без контроля влажности: металлические сейфы сами по себе не регулируют микроклимат."
    }
  },
  {
    id: 6, category: 'interviews', date: '2026-06-12', author: 'Vintage Hall',
    imageUrl: 'https://picsum.photos/seed/artist-interview/600/400',
    title: {
      uk: 'Інтерв\'ю: художниця Олена Кравець — «Антикваріат надихає мій живопис»',
      en: 'Interview: artist Olena Kravets — "Antiques inspire my painting"',
      pl: 'Wywiad: artystka Ołena Krawec — „Antyki inspirują moje malarstwo"',
      ru: 'Интервью: художница Елена Кравец — «Антиквариат вдохновляет мою живопись»'
    },
    excerpt: {
      uk: 'Харківська художниця розповідає, як старовинні речі стають героями її картин та чому вона купує лоти на Vintage Hall.',
      en: 'A Kharkiv artist tells how antique items become the heroes of her paintings and why she buys lots on Vintage Hall.',
      pl: 'Charkowska artystka opowiada, jak antyczne przedmioty stają się bohaterami jej obrazów.',
      ru: 'Харьковская художница рассказывает, как старинные вещи становятся героями её картин.'
    },
    body: {
      uk: "Олена показала нам свою майстерню, заповнену старовинними рамами, посудом та тканинами — все це стає частиною її натюрмортів. Кожна тріщина на старій вазі — це вже сюжет, каже художниця, чиї роботи виставлялись у трьох галереях Харкова.\n\nНа запитання, чи не шкода псувати раритетні речі, перетворюючи їх на натюрморт, Олена відповідає: «Я нічого не псую — навпаки, картина переживе саму річ, якщо та колись розсиплеться від часу. Це теж форма збереження, просто інша».\n\nНайближча виставка Олени запланована на вересень — серед експонатів буде серія робіт, написаних спеціально з лотами, придбаними на Vintage Hall за останній рік.",
      en: "Olena showed us her studio filled with antique frames, vessels, and fabrics — all of which become part of her still lifes. Every crack on an old vase is already a story, says the artist, whose works have been exhibited in three Kharkiv galleries.\n\nAsked whether it feels wasteful to \"use up\" rare items as still-life subjects, Olena replies: \"I'm not wasting anything — if anything, the painting will outlive the object itself if it ever crumbles with age. It's preservation too, just a different kind.\"",
      pl: "Olena pokazala nam swoja pracownie pelna antycznych ram, naczyn i tkanin. Kazda rysa na starym wazonie to juz opowiesc, mowi artystka.\n\nZapytana, czy nie szkoda \"zuzywac\" rzadkich przedmiotow jako tematow martwej natury, Olena odpowiada: „Niczego nie niszczę — wręcz przeciwnie, obraz przetrwa sam przedmiot.\"",
      ru: "Елена показала нам свою мастерскую, заполненную старинными рамами, посудой и тканями — всё это становится частью её натюрмортов. Каждая трещина на старой вазе — это уже сюжет, говорит художница.\n\nНа вопрос, не жаль ли «расходовать» редкие вещи как объекты натюрморта, Елена отвечает: «Я ничего не порчу — наоборот, картина переживёт саму вещь, если та когда-нибудь рассыплется от времени»."
    }
  },
  {
    id: 7, category: 'archaeology', date: '2026-06-10', author: 'Віктор Литвин',
    imageUrl: 'https://picsum.photos/seed/trypillian-pottery/600/400',
    title: {
      uk: 'Трипільський посуд віком 6000 років: як розпізнати справжній від підробки',
      en: 'Trypillian pottery 6,000 years old: how to distinguish genuine from fake',
      pl: 'Ceramika trypolska sprzed 6000 lat: jak odróżnić oryginał od podróbki',
      ru: 'Трипольская посуда возрастом 6000 лет: как отличить подлинник от подделки'
    },
    excerpt: {
      uk: 'Експерт-археолог пояснює ключові ознаки справжньої трипільської кераміки та розповідає про найпоширеніші підробки на ринку.',
      en: 'An expert archaeologist explains the key signs of genuine Trypillian ceramics and discusses the most common fakes on the market.',
      pl: 'Ekspert-archeolog wyjaśnia kluczowe cechy autentycznej ceramiki trypolskiej.',
      ru: 'Эксперт-археолог объясняет ключевые признаки подлинной трипольской керамики.'
    },
    body: {
      uk: "Справжня трипільська керамика має характерну неоднорідність обпалу та слабко виражений спіральний орнамент, нанесений вручну. Підробки часто видає занадто рівномірний колір та симетрія — ознаки промислового виготовлення.\n\nЩе одна ознака — вага: справжня трипільська кераміка через нерівномірний випал має помітні коливання щільності черепка навіть у межах одного виробу, тоді як сучасні підробки мають майже ідеально рівномірну вагу.\n\nЕксперт радить завжди вимагати результати термолюмінесцентного аналізу для предметів вартістю від 50 000 ₴ — це єдиний спосіб об'єктивно підтвердити вік випалу, а не покладатися лише на візуальні ознаки.",
      en: "Genuine Trypillian ceramics show characteristic unevenness in firing and a faintly visible hand-applied spiral pattern. Fakes are often given away by overly uniform color and symmetry — signs of industrial production.\n\nAnother telltale sign is weight: genuine Trypillian ceramics, due to uneven firing, show noticeable density variation within a single piece, while modern forgeries made on a temperature-controlled wheel tend to have nearly uniform weight.",
      pl: "Autentyczna ceramika trypolska charakteryzuje sie niejednorodnym wypalem i slabo widocznym recznie wykonanym ornamentem spiralnym. Podrobki zdradza zbyt rowny kolor i symetria.\n\nKolejna cecha to waga: autentyczna ceramika trypolska, ze wzgledu na nierowny wypal, wykazuje zauwazalne wahania gestosci nawet w obrebie jednego naczynia.",
      ru: "Подлинная трипольская керамика отличается характерной неоднородностью обжига и слабовыраженным спиральным орнаментом, нанесённым вручную. Подделки часто выдают слишком равномерный цвет и симметрия.\n\nЕщё один признак — вес: подлинная трипольская керамика из-за неравномерного обжига имеет заметные колебания плотности черепка даже в пределах одного изделия."
    }
  },
  {
    id: 8, category: 'architecture', date: '2026-06-08', author: 'Наталія Ткаченко',
    imageUrl: 'https://picsum.photos/seed/antique-doors/600/400',
    title: {
      uk: 'Антикварні двері та фурнітура: тренд на оригінальні деталі в сучасних інтер\'єрах',
      en: 'Antique doors and hardware: the trend for original details in modern interiors',
      pl: 'Antyczne drzwi i okucia: trend na oryginalne detale we współczesnych wnętrzach',
      ru: 'Антикварные двери и фурнитура: тренд на оригинальные детали в современных интерьерах'
    },
    excerpt: {
      uk: 'Дизайнери інтер\'єрів все частіше використовують справжні антикварні елементи замість стилізацій. Розповідаємо, де шукати та як підібрати.',
      en: 'Interior designers increasingly use genuine antique elements instead of reproductions. We tell you where to find them and how to choose.',
      pl: 'Projektanci wnętrz coraz częściej używają autentycznych elementów antykwarycznych.',
      ru: 'Дизайнеры интерьеров всё чаще используют настоящие антикварные элементы.'
    },
    body: {
      uk: "Попит на старовинні дверні ручки, петлі та замки зріс за останній рік на 40%, за оцінками реставраційних майстерень. Найбільшою популярністю користуються елементи кінця XIX — початку XX століття у стилі модерн.\n\nНайбільшим попитом, за словами реставраторів, користуються латунні ручки з рослинним орнаментом та кольорові вітражні вставки в дверних панелях.\n\nСередня ціна автентичної дверної ручки кінця XIX століття в хорошому стані становить від 800 до 3500 ₴ залежно від матеріалу та збереженості гравіювання.",
      en: "Demand for antique door handles, hinges, and locks has grown by 40% over the past year, according to restoration workshops. The most popular items are Art Nouveau elements from the late 19th-early 20th century.\n\nAccording to restorers, the most sought-after items are brass handles with floral ornamentation and stained-glass door panel inserts — frequently ordered for restoring both private homes and retro-style cafés.",
      pl: "Popyt na antyczne klamki, zawiasy i zamki wzrosl w ciagu ostatniego roku o 40%, wedlug warsztatow restauracyjnych. Najpopularniejsze sa elementy w stylu secesyjnym.\n\nNajwiekszym powodzeniem, wedlug restauratorow, ciesza sie mosiezne klamki z ornamentem roslinnym oraz kolorowe wstawki witrazowe w panelach drzwiowych.",
      ru: "Спрос на старинные дверные ручки, петли и замки вырос за последний год на 40%, по оценкам реставрационных мастерских. Наибольшей популярностью пользуются элементы конца XIX — начала XX века в стиле модерн.\n\nНаибольшим спросом, по словам реставраторов, пользуются латунные ручки с растительным орнаментом и цветные витражные вставки в дверных панелях."
    }
  },
  {
    id: 9, category: 'auctions', date: '2026-06-29', author: 'Vintage Hall',
    imageUrl: 'https://picsum.photos/seed/auction-record-watch/600/400',
    title: {
      uk: 'Рекорд платформи: кишеньковий годинник пішов на торгах за 212% від стартової ціни',
      en: 'Platform record: pocket watch sells for 212% of its starting price',
      pl: 'Rekord platformy: zegarek kieszonkowy sprzedany za 212% ceny wywoławczej',
      ru: 'Рекорд платформы: карманные часы ушли с торгов за 212% от стартовой цены'
    },
    excerpt: {
      uk: 'Швейцарський кишеньковий годинник початку XX століття зібрав 14 ставок за останню годину торгів — фінальна ціна стала найвищою серед лотів категорії «годинники» за весь час роботи платформи.',
      en: 'An early 20th-century Swiss pocket watch drew 14 bids in the final hour of bidding — the highest final price ever reached in the "clocks" category on the platform.',
      pl: 'Szwajcarski zegarek kieszonkowy z początku XX wieku zebrał 14 ofert w ostatniej godzinie aukcji.',
      ru: 'Швейцарские карманные часы начала XX века собрали 14 ставок за последний час торгов — финальная цена стала самой высокой в категории «часы» за всё время работы платформы.'
    },
    body: {
      uk: "Інтрига тривала до останніх секунд: дві ставки надійшли з різницею у 8 секунд до завершення таймера. За словами організаторів, ажіотаж пояснюється рідкісним станом механізму — годинник пройшов експертизу і отримав підтвердження оригінальності всіх комплектуючих, що для предметів такого віку трапляється нечасто.\n\nЗа регламентом платформи, останні 60 секунд торгів автоматично продовжують аукціон ще на 2 хвилини після кожної нової ставки — саме це правило «без снайперів» і дозволило розгорнутися фінальній боротьбі.\n\nПокупець, що виграв лот, побажав залишитися анонімним, але повідомив платформі, що годинник стане подарунком батькові на 60-річчя — той колекціонує швейцарські механізми понад 30 років.",
      en: "The drama lasted until the final seconds: two bids landed just 8 seconds apart before the timer ran out. Organizers attribute the excitement to the movement's rare condition — the watch passed expert verification confirming all original components, uncommon for an item this old.\n\nUnder platform rules, the final 60 seconds automatically extend the auction by another 2 minutes after every new bid — this \"no last-second sniping\" rule is exactly what allowed the dramatic final exchange instead of an instant win.",
      pl: "Emocje trwały do ostatnich sekund: dwie oferty wpłynęły z różnicą 8 sekund przed końcem licznika. Według organizatorów, ażiotaż wynika z rzadkiego stanu mechanizmu.\n\nZgodnie z regulaminem platformy, ostatnie 60 sekund licytacji automatycznie przedluza aukcje o kolejne 2 minuty po kazdej nowej ofercie.",
      ru: "Интрига продолжалась до последних секунд: две ставки поступили с разницей в 8 секунд до завершения таймера. По словам организаторов, ажиотаж объясняется редким состоянием механизма — часы прошли экспертизу с подтверждением оригинальности всех деталей.\n\nПо регламенту платформы, последние 60 секунд торгов автоматически продлевают аукцион ещё на 2 минуты после каждой новой ставки."
    }
  },
  {
    id: 10, category: 'numismatics', date: '2026-06-30', author: 'Іван Коваленко',
    imageUrl: 'https://picsum.photos/seed/numismatic-export-rules/600/400',
    title: {
      uk: 'Як законно вивезти монету з України: пояснюємо правила культурної цінності',
      en: "How to legally export a coin from Ukraine: cultural-value rules explained",
      pl: "Jak legalnie wywieźć monetę z Ukrainy: zasady wartości kulturowej",
      ru: 'Как законно вывезти монету из Украины: объясняем правила культурной ценности'
    },
    excerpt: {
      uk: 'Не кожна стара монета підпадає під заборону вивезення, але процедура підтвердження статусу культурної цінності лякає навіть досвідчених колекціонерів. Розбираємо по кроках.',
      en: 'Not every old coin falls under export restrictions, but confirming cultural-value status intimidates even experienced collectors. Here is the process, step by step.',
      pl: 'Nie każda stara moneta podlega zakazowi wywozu, ale procedura potwierdzenia statusu wartości kulturowej bywa skomplikowana.',
      ru: 'Не каждая старая монета подпадает под запрет вывоза, но процедура подтверждения статуса культурной ценности пугает даже опытных коллекционеров. Разбираем по шагам.'
    },
    body: {
      uk: "Експертний висновок видає акредитована установа — без нього митниця має право затримати предмет навіть при наявності чеку про покупку. Для масової нумізматики радянського періоду процедура зазвичай швидка, а для імперських монет рідкісного карбування може тривати кілька тижнів. Поради: завжди зберігайте документи про походження лота, навіть якщо це просто історія угоди на платформі.\n\nНа практиці процедура виглядає так: власник подає заявку через сайт відповідного управління культури, додає фотографії предмета з усіх ракурсів і документ про походження, після чого впродовж 10-20 робочих днів комісія виносить рішення.\n\nЯкщо предмет визнають культурною цінністю, вивезення можливе лише тимчасово — наприклад, для участі у виставці за кордоном — з обов'язковим поверненням і фінансовою гарантією.",
      en: "An accredited institution issues the expert opinion — without it, customs can hold an item even with a purchase receipt. For common Soviet-era numismatics, the process is usually quick; for rare imperial-era coinage it can take several weeks. Tip: always keep provenance documents, even if it's just the platform's own transaction history.\n\nIn practice, the procedure works as follows: the owner submits an application through the relevant culture department's website, attaches photos from every angle plus a provenance document, and the committee issues a decision within 10–20 business days.",
      pl: "Opinię ekspercką wydaje akredytowana instytucja — bez niej celnicy mogą zatrzymać przedmiot nawet z dowodem zakupu. Dla powszechnej numizmatyki sowieckiej procedura jest zwykle szybka.\n\nW praktyce procedura wyglada tak: wlasciciel skladá wniosek przez strone odpowiedniego wydzialu kultury, dolacza zdjecia przedmiotu z kazdego kata oraz dokument pochodzenia.",
      ru: "Экспертное заключение выдаёт аккредитованное учреждение — без него таможня вправе задержать предмет даже при наличии чека о покупке. Для массовой нумизматики советского периода процедура обычно быстрая, а для редких имперских монет может занять несколько недель.\n\nНа практике процедура выглядит так: владелец подаёт заявку через сайт соответствующего управления культуры, прикладывает фотографии предмета со всех ракурсов и документ о происхождении."
    }
  },
  {
    id: 11, category: 'interviews', date: '2026-06-27', author: 'Vintage Hall',
    imageUrl: 'https://picsum.photos/seed/restorer-interview/600/400',
    title: {
      uk: "Реставратор годинників: «Більшість механізмів псують саме невдалим чищенням»",
      en: '"Most movements are ruined by bad cleaning," says clock restorer',
      pl: 'Restaurator zegarów: „Większość mechanizmów psuje niewłaściwe czyszczenie”',
      ru: 'Реставратор часов: «Большинство механизмов портят неудачной чисткой»'
    },
    excerpt: {
      uk: 'Михайло Бондар, експерт Vintage Hall з 22-річним стажем, розповідає, чому не варто самостійно розбирати старовинний механізм — навіть якщо здається, що ви знаєте, що робите.',
      en: 'Mykhailo Bondar, a Vintage Hall expert with 22 years of experience, explains why you should never disassemble an antique movement yourself — even if you think you know what you are doing.',
      pl: 'Michajło Bondar, ekspert Vintage Hall z 22-letnim stażem, opowiada, czemu nie warto samodzielnie rozbierać starego mechanizmu.',
      ru: 'Михаил Бондарь, эксперт Vintage Hall с 22-летним стажем, рассказывает, почему не стоит самостоятельно разбирать старинный механизм.'
    },
    body: {
      uk: "«Найчастіша помилка — мастило не для механізмів такого віку. Сучасні масла занадто густі для зношених осей, тому через рік деталь, яку «полагодили», заклинює сильніше, ніж до ремонту», — пояснює Михайло. За його словами, до 60% лотів категорії «годинники», що проходять експертизу на платформі, мають слідову непрофесійну реставрацію в минулому.\n\nМихайло радить простий тест перед покупкою старовинного годинника: послухати хід наживо, а не на відео. «Справжній рівномірний хід має звук метронома — без проковзувань і запинок».\n\nЗа його оцінкою, повна професійна реставрація механізму швейцарського кишенькового годинника коштує від 3000 до 12000 ₴ залежно від складності ускладнень — і цю суму варто закласти одразу в бюджет покупки.",
      en: "\"The most common mistake is using the wrong lubricant for a movement this old. Modern oils are too thick for worn pivots, so a year after the 'fix' the part jams worse than before,\" Mykhailo explains. He estimates up to 60% of clock-category lots verified on the platform show signs of past amateur restoration.\n\nMykhailo recommends a simple test before buying an antique watch: listen to it ticking live, not on video. \"A genuine, even movement sounds like a metronome — no slipping, no hesitation.\"",
      pl: "„Najczęstszy błąd to smar nieodpowiedni do mechanizmu tego wieku. Współczesne oleje są zbyt gęste dla zużytych osi” — wyjaśnia Michajło.\n\nMichajlo radzi prosty test przed zakupem antycznego zegarka: posluchac chodu na zywo, a nie na nagraniu. „Prawdziwy, rowny chod brzmi jak metronom — bez poslizgow i zaciec\".",
      ru: "«Самая частая ошибка — смазка не для механизмов такого возраста. Современные масла слишком густые для изношенных осей, поэтому через год деталь, которую «починили», заклинивает сильнее, чем до ремонта», — объясняет Михаил.\n\nМихаил советует простой тест перед покупкой старинных часов: послушать ход вживую, а не на видео. «Настоящий равномерный ход звучит как метроном — без проскальзываний и запинок»."
    }
  },
  {
    id: 12, category: 'architecture', date: '2026-06-15', author: 'Ірина Бондар',
    imageUrl: 'https://picsum.photos/seed/lviv-exhibition-opening/600/400',
    title: {
      uk: 'У Львові відкрилась виставка меблів епохи модерну — деякі експонати підуть на аукціон',
      en: 'Lviv opens an Art Nouveau furniture exhibition — some pieces head to auction',
      pl: 'We Lwowie otwarto wystawę mebli w stylu secesyjnym — część eksponatów trafi na aukcję',
      ru: 'Во Львове открылась выставка мебели эпохи модерна — некоторые экспонаты пойдут на аукцион'
    },
    excerpt: {
      uk: 'Приватна колекція з 40 предметів меблів кінця XIX — початку XX століття представлена у Львівській галереї мистецтв до кінця серпня. Частина експонатів після виставки буде передана на аукціон.',
      en: 'A private collection of 40 late-19th to early-20th-century furniture pieces is on display at the Lviv Art Gallery through the end of August. Some pieces will go to auction afterward.',
      pl: 'Prywatna kolekcja 40 mebli z końca XIX — początku XX wieku jest prezentowana we Lwowskiej Galerii Sztuki do końca sierpnia.',
      ru: 'Частная коллекция из 40 предметов мебели конца XIX — начала XX века представлена во Львовской галерее искусств до конца августа.'
    },
    body: {
      uk: "Колекціонер, який зібрав експозицію за 25 років, вирішив частину предметів виставити на продаж — за його словами, «меблі повинні стояти в будинках, а не вічно в сховищі». Серед лотів — горіховий гарнітур та різьблені дзеркала, подібні до тих, що вже продавались на Vintage Hall.\n\nНайдорожчим експонатом виставки є горіховий письмовий стіл з інкрустацією перламутром, виготовлений віденською майстернею близько 1905 року — за попередньою оцінкою, його початкова ціна на аукціоні складе не менше 180 000 ₴.\n\nVintage Hall домовився з колекціонером про ексклюзивне право на проведення онлайн-трансляції аукціону наприкінці серпня.",
      en: "The collector, who assembled the exhibit over 25 years, decided to sell part of it — in his words, \"furniture should stand in homes, not sit in storage forever.\" Lots include a walnut suite and carved mirrors similar to those previously sold on Vintage Hall.\n\nThe exhibition's most valuable piece is a walnut writing desk with mother-of-pearl inlay, made by a Viennese workshop around 1905 — experts estimate its opening auction price at no less than 180,000 ₴.",
      pl: "Kolekcjoner, który zbierał ekspozycję 25 lat, zdecydował się sprzedać część przedmiotów — według niego „meble powinny stać w domach, a nie wiecznie w magazynie”.\n\nNajcenniejszym eksponatem wystawy jest orzechowe biurko z inkrustacja macica perlowa, wykonane przez wiedenski warsztat okolo 1905 roku.",
      ru: "Коллекционер, собиравший экспозицию 25 лет, решил часть предметов выставить на продажу — по его словам, «мебель должна стоять в домах, а не вечно в хранилище».\n\nСамым дорогим экспонатом выставки является ореховый письменный стол с инкрустацией перламутром, изготовленный венской мастерской около 1905 года."
    }
  },
  {
    id: 13, category: 'archaeology', date: '2026-06-05', author: 'Віктор Литвин',
    imageUrl: 'https://picsum.photos/seed/cossack-saber-find/600/400',
    title: {
      uk: 'Козацька шабля XVII століття знайдена під час будівельних робіт у Запоріжжі',
      en: '17th-century Cossack saber discovered during construction work in Zaporizhzhia',
      pl: 'Kozacka szabla z XVII wieku odnaleziona podczas prac budowlanych w Zaporożu',
      ru: 'Казацкая сабля XVII века найдена при строительных работах в Запорожье'
    },
    excerpt: {
      uk: 'Знахідку передали до місцевого історичного музею для консервації. Експерти зазначають характерну для запорозьких козаків форму клинка та збережене піхви.',
      en: 'The find was handed over to a local history museum for conservation. Experts note the blade shape typical of Zaporizhzhian Cossacks and a preserved scabbard.',
      pl: 'Znalezisko przekazano do lokalnego muzeum historycznego w celu konserwacji.',
      ru: 'Находку передали в местный исторический музей для консервации. Эксперты отмечают характерную для запорожских казаков форму клинка и сохранившиеся ножны.'
    },
    body: {
      uk: "Шаблю виявили робітники на глибині близько двох метрів під час прокладання інженерних мереж. Клинок частково покритий корозією, проте характерне вигнуте лезо та маркування на гарді дозволяють датувати знахідку приблизно серединою XVII століття. Музей планує провести повну консервацію протягом року.\n\nПодібні знахідки в Запорізькій області трапляються нечасто — востаннє схожий клинок виявили ще у 2019 році під час дослідження старого русла Дніпра.\n\nЗа попередньою оцінкою, після завершення консервації шабля стане центральним експонатом нової постійної виставки, присвяченої запорізькому козацтву, відкриття якої заплановано на 2027 рік.",
      en: "Workers found the saber roughly two meters underground while laying utility lines. The blade is partially corroded, but its distinctive curve and hilt marking allow dating to roughly the mid-17th century. The museum plans full conservation within a year.\n\nSuch finds are rare in Zaporizhzhia region — the last similar blade was discovered back in 2019 during research on the old bed of the Dnipro river.",
      pl: "Robotnicy znaleźli szablę na głębokości około dwóch metrów podczas układania sieci. Klinga jest częściowo skorodowana.\n\nTakie znaleziska w obwodzie zaporoskim sa rzadkie — ostatni podobny klinog odnaleziono w 2019 roku podczas badan starego koryta Dniepru.",
      ru: "Рабочие обнаружили саблю на глубине около двух метров при прокладке инженерных сетей. Клинок частично покрыт коррозией, однако характерный изгиб лезвия и маркировка на гарде позволяют датировать находку примерно серединой XVII века.\n\nПодобные находки в Запорожской области случаются нечасто — в последний раз похожий клинок обнаружили ещё в 2019 году при исследовании старого русла Днепра."
    }
  },
  {
    id: 14, category: 'numismatics', date: '2026-06-12', author: 'Олексій Мельник',
    imageUrl: 'https://picsum.photos/seed/fake-coin-detection/600/400',
    title: {
      uk: '5 ознак підробленої монети, які видно навіть без лупи',
      en: '5 signs of a fake coin you can spot without a magnifier',
      pl: '5 oznak podrobionej monety widocznych nawet bez lupy',
      ru: '5 признаков подделанной монеты, которые видны даже без лупы'
    },
    excerpt: {
      uk: 'Нумізмат Vintage Hall розбирає найпоширеніші помилки фальшивників — від неправильної ваги до «занадто ідеального» карбування.',
      en: 'A Vintage Hall numismatist breaks down the most common mistakes forgers make — from incorrect weight to "too perfect" minting.',
      pl: 'Numizmatyk Vintage Hall analizuje najczęstsze błędy fałszerzy — od niewłaściwej wagi do „zbyt idealnego" wybicia.',
      ru: 'Нумизмат Vintage Hall разбирает самые распространённые ошибки фальшивомонетчиков — от неправильного веса до «слишком идеальной» чеканки.'
    },
    body: {
      uk: "Перше, що варто перевірити — вага монети: відхилення навіть у півграма від каталожного значення вже привід насторожитись. Друге — звук при падінні на тверду поверхню: справжнє срібло чи бронза мають свій характерний тон, який важко відтворити сучасним сплавам. Третій маркер — занадто чітке, «свіже» карбування на монеті, що нібито пролежала в землі сторіччя.\n\nЧетвертий маркер — магнітна перевірка: дорогоцінні метали не магнітяться, тоді як дешеві сплави на основі заліза чи нікелю притягуються навіть слабким магнітом. П'ятий — звірка діаметра й товщини зі штангенциркулем.\n\n«Жоден окремий тест не дає стовідсоткової гарантії, — наголошує експерт. — Але якщо монета не пройшла хоча б два з п'яти тестів, її варто показати професійному нумізмату перед покупкою».",
      en: "First, check the weight: even half a gram off the catalog value is reason for suspicion. Second, the sound when dropped on a hard surface — genuine silver or bronze has a distinct ring modern alloys struggle to replicate. Third: minting that looks too crisp and 'fresh' for a coin supposedly buried for a century.\n\nA fourth marker is the magnet test: precious metals (gold, silver) aren't magnetic, while the cheap iron- or nickel-based alloys used to fake heavy coins are pulled in even by a weak magnet.",
      pl: "Pierwsze, co warto sprawdzić — waga monety: odchylenie nawet o pół grama od wartości katalogowej to już powód do niepokoju.\n\nCzwarty wskaznik to test magnesem: metale szlachetne (zloto, srebro) nie sa magnetyczne, podczas gdy tanie stopy na bazie zelaza czy niklu, ktorymi podrabia sie ciezkie monety, przyciagaja nawet slaby magnes.",
      ru: "Первое, что стоит проверить — вес монеты: отклонение даже на полграмма от каталожного значения уже повод насторожиться. Второе — звук при падении на твёрдую поверхность: настоящее серебро или бронза имеют характерный тон, который сложно воспроизвести современным сплавам.\n\nЧетвёртый маркер — проверка магнитом: драгоценные металлы не магнитятся, тогда как дешёвые сплавы на основе железа или никеля, которыми подделывают тяжёлые монеты, притягиваются даже слабым магнитом."
    }
  }
];

export const SEEDED_FORUM_TOPICS: ForumTopic[] = [
  {
    id: 5, title: '🔥 Знижка 50% на комісію платформи для активних продавців — до 31 липня',
    body: 'Якщо за останні 30 днів ви опублікували 3+ лоти і хоча б один з них продався — вам автоматично діє знижена комісія 4% замість 8% на всі нові лоти до кінця місяця. Знижка застосовується без промокодів, прямо в кабінеті продавця.',
    author: 'Vintage Hall', date: '2026-06-28', category: 'general', views: 412, pinned: true, topicType: 'promo',
    replies: [
      { author: 'Numizmat_99', text: 'Дуже до речі, саме думав виставляти ще монети з нової партії!', date: '2026-06-28' },
      { author: 'ArtAntique_Kharkiv', text: 'А знижка діє і на VIP-відділ, чи тільки на звичайні лоти?', date: '2026-06-28' },
      { author: 'Vintage Hall', text: 'Поки тільки на лоти в категоріях «Магазин» та «Аукціон» — VIP-заявки розглядаються індивідуально.', date: '2026-06-28' }
    ]
  },
  {
    id: 6, title: '📅 Великий літній аукціон 5 липня — попередній перегляд лотів з 1 липня',
    body: 'Збираємо найкращі лоти місяця в один вечір прямого ефіру торгів: кишеньковий годинник зі швейцарським механізмом, рідкісний рубль Миколи II та парний фарфоровий набір з музейним грейдом. З 1 по 4 липня всі лоти доступні для попереднього перегляду в шоурумі на Андріївському узвозі — за записом.',
    author: 'Vintage Hall', date: '2026-06-27', category: 'general', views: 587, pinned: true, topicType: 'announcement',
    replies: [
      { author: 'Marta', text: 'А буде онлайн-трансляція для тих, хто не у Києві?', date: '2026-06-27' },
      { author: 'Vintage Hall', text: 'Так, пряма трансляція торгів буде доступна в кабінеті — ставки можна робити і дистанційно.', date: '2026-06-27' },
      { author: 'Sergiy', text: 'Записався на перегляд годинника на 3 липня, дуже чекаю!', date: '2026-06-28' }
    ]
  },
  {
    id: 7, title: '🏆 Конкурс «Угадай епоху предмета» — приз: безкоштовна експертна оцінка лота',
    body: 'Щотижня публікуємо фото фрагмента лота без підказок (тільки матеріал і деталь обробки). Хто першим вгадає десятиліття виготовлення в комплекті з аргументацією у відповіді — отримує безкоштовну експертну оцінку одного власного лота. Цього тижня: фрагмент гравіювання на бронзовому виробі.',
    author: 'Vintage Hall', date: '2026-06-26', category: 'general', views: 298, pinned: true, topicType: 'contest',
    replies: [
      { author: 'Ivan_K', text: 'За стилем гравіювання схоже на кінець XIX століття, орнамент «вологодского» типу.', date: '2026-06-26' },
      { author: 'Олена_К', text: 'Я б сказала 1880-ті — лінія дуже тонка, типова для ручної роботи того періоду.', date: '2026-06-27' },
      { author: 'Vintage Hall', text: 'Близько! Правильна відповідь — 1890-ті. Олена_К, найближче — оцінку вже додали у ваш кабінет 🎉', date: '2026-06-27' }
    ]
  },
  {
    id: 8, title: '☕ Зустріч колекціонерів у Львові — 20 липня, кафе «Атлас»',
    body: 'Організовуємо невелику офлайн-зустріч для колекціонерів Західної України: можна принести 1-2 лоти показати спільноті, обмінятись контактами та просто поговорити без екрана. Орієнтовно 15-20 учасників, вхід вільний, кава за власний кошт.',
    author: 'Sergiy', date: '2026-06-25', category: 'general', views: 176, topicType: 'event',
    replies: [
      { author: 'Marta', text: 'Чудова ідея! Приїду з Тернополя, привезу пару монет на показ.', date: '2026-06-25' },
      { author: 'Alex_V', text: 'Хто ще їде? Можемо скооперуватись на спільну поїздку.', date: '2026-06-26' },
      { author: 'Vintage Hall', text: 'Закріплюємо тему — якщо буде запит, організуємо подібні зустрічі і в інших містах.', date: '2026-06-26' }
    ]
  },
  {
    id: 1, title: 'Як оцінити стан монети без досвіду?', body: 'Привіт! Я новачок, тільки почав збирати монети. Підкажіть, як правильно визначати стан (VF, XF, UNC)? Може є якісь візуальні гайди?',
    author: 'Петро_М', date: '2026-06-26', category: 'numismatics', views: 142,
    replies: [
      { author: 'Numizmat_99', text: 'Є чудовий гайд на sheldon scale — погугліть, там з фото кожного стану. Головне — не чистіть монети, це знижує вартість!', date: '2026-06-26' },
      { author: 'Олена_К', text: 'Я починала з книги Краузе — там кожен грейд з прикладами. І головне — порівнюйте з каталожними фото, а не з продавцями.', date: '2026-06-27' }
    ]
  },
  {
    id: 2, title: 'Самовар тульський — як відрізнити оригінал від реставрації?', body: 'Дивлюсь на самовар на аукціоні, але не впевнений у оригінальності. Які ознаки кустарної реставрації? На що звернути увагу?',
    author: 'Ivan_K', date: '2026-06-24', category: 'decor', views: 89,
    replies: [
      { author: 'Vintage Hall', text: 'Зверніть увагу на: клейма виробника (має бути чітке), паяні шви (оригінал — рівні), колір металу (реставрований може блищати неприродно).', date: '2026-06-24' }
    ]
  },
  {
    id: 3, title: 'Хто їде на виставку антикваріату в Києві 12 липня?', body: 'Планую відвідати щорічну виставку в Мистецькому Арсеналі. Хтось буде? Можемо зустрітись і обговорити колекції.',
    author: 'Marta', date: '2026-06-23', category: 'general', views: 67,
    replies: [
      { author: 'Alex_V', text: 'Буду! Давайте обмінятись контактами через чат на сайті.', date: '2026-06-23' },
      { author: 'Sergiy', text: 'Теж планую. Минулого року було багато цікавого фарфору.', date: '2026-06-24' },
      { author: 'Marta', text: 'Супер! Створю групу в Телеграмі ближче до дати. Скину посилання сюди.', date: '2026-06-25' }
    ]
  },
  {
    id: 4, title: 'Порада: як безпечно пакувати монети для відправки Новою поштою', body: 'Ділюсь досвідом: використовую холдери + бульбашкову плівку + жорстку коробку. За 200+ відправок жодної пошкодженої монети.',
    author: 'Numizmat_99', date: '2026-06-20', category: 'numismatics', views: 213,
    replies: [
      { author: 'Олена_К', text: 'Дякую за пораду! А яку вагу зазвичай вказуєте в декларації?', date: '2026-06-21' },
      { author: 'Numizmat_99', text: 'Завжди з оголошеною вартістю! Це коштує трохи більше, але якщо щось станеться — отримаєте компенсацію.', date: '2026-06-21' }
    ]
  }
];

export const SEEDED_QUICK_MESSAGES: QuickMessage[] = [
  { author: 'Marta', text: 'Хто бачив новий лот з полтиною 1924 року? Цікавий стан!', date: '2026-06-27 19:45' },
  { author: 'Alex_V', text: 'Так, я поставив ставку. Конкуренція поки невелика 😊', date: '2026-06-27 19:50' },
  { author: 'Numizmat_99', text: 'Виставив нові монети Російської Імперії — рублі Миколи II. Заходьте в каталог!', date: '2026-06-27 20:10' },
  { author: 'Ivan_K', text: 'Підкажіть, хто знає хорошого реставратора бронзових підсвічників у Харкові?', date: '2026-06-27 20:25' },
  { author: 'Sergiy', text: 'Рекомендую майстерню на Сумській — вони працюють з антикваріатом.', date: '2026-06-27 20:32' },
  { author: 'Vintage Hall', text: 'Нагадуємо: аукціон на кишеньковий годинник завершується сьогодні о 21:00!', date: '2026-06-27 20:45' },
];
