## 1. Сервер: параметризація RSS-джерела

- [x] 1.1 Змінити `fetchNewsFeedXml` у `server/utils/rss.ts`, щоб приймати `feedUrl: string` замість жорстко зашитого `RSS_FEED_URL`
- [x] 1.2 Перевірити, що `parseNewsFeedXml` не потребує змін для нових фідів (BBC News Technology/Business мають однаковий RSS-формат)

## 2. Сервер: конфігурація категорій

- [x] 2.1 Створити `server/utils/newsCategories.ts` з мапою `slug -> { label, feedUrl, keywords?: string[] }` для `technology`, `finance` (без keywords — фід цілком) та `artificial-intelligence`, `gadgets`, `digital-currencies`, `playstation`, `apple`, `it-jobs` (з keywords)
- [x] 2.2 Додати запис `epl` у ту саму мапу, що перевикористовує наявний `EPL_KEYWORDS`/фід зі `server/utils/newsFilter.ts`
- [x] 2.3 Узагальнити `selectLatestEplNews` у `server/utils/newsFilter.ts` до `selectLatestNews(items, limit, keywords?: string[])`, що фільтрує лише коли `keywords` задано, інакше повертає всі (з дедуплікацією за `link`, як зараз)

## 3. Сервер: динамічний ендпоінт категорії

- [x] 3.1 Створити `server/api/news/[category].get.ts`: прочитати `category` з маршруту, знайти конфігурацію в `newsCategories.ts`, повернути 404/400 якщо категорія невідома
- [x] 3.2 У хендлері викликати `fetchNewsFeedXml(config.feedUrl)`, `parseNewsFeedXml`, `selectLatestNews(items, 10, config.keywords)`, обробити помилку джерела як 502 (за аналогією з `server/api/news.ts`)

## 4. Клієнт: композабл кешу категорій

- [x] 4.1 Створити `app/composables/useNewsCategories.ts` (або еквівалент) зі станом `Record<string, NewsItem[]>` (кеш даних) та `Record<string, 'idle' | 'pending' | 'error'>` (стан на категорію)
- [x] 4.2 Реалізувати функцію `loadCategory(slug)`: якщо кеш вже містить дані для `slug` — нічого не робити (без запиту); інакше виставити `pending`, викликати `$fetch('/api/news/' + slug)`, зберегти результат у кеш або виставити `error`

## 5. Клієнт: UI табів

- [x] 5.1 Створити `app/components/CategoryTabs.vue`: список табів (EPL + 8 нових категорій), підсвітка активного таба, emit при кліку
- [x] 5.2 У `app/app.vue` додати `CategoryTabs`, стан `activeCategory` (за замовчуванням EPL), обробник кліку викликає `loadCategory(slug)` з композабла та переключає активний таб
- [x] 5.3 Відобразити для активного (не-EPL) таба: індикатор завантаження під час `pending`, повідомлення про помилку з кнопкою "Спробувати ще раз" під час `error`, список `NewsCard` при наявності даних у кеші
- [x] 5.4 Переконатись, що EPL-таб і далі показує дані з наявного SSR `useFetch('/api/news')` без змін поведінки

## 6. Перевірка

- [x] 6.1 Запустити dev-сервер, перевірити відповідь `/api/news/technology`, `/api/news/apple` тощо — до 10 новин, без дублікатів
- [x] 6.2 Перевірити невідому категорію (`/api/news/unknown`) — очікувана помилка, а не 500
- [x] 6.3 Візуально перевірити в браузері: клік на таб підвантажує новини без перезавантаження сторінки; повторний клік на вже відкритий таб не робить повторний мережевий запит (перевірити у Network tab або лічильником запитів)
- [x] 6.4 Перевірити незалежність станів: помилка в одному табі не ламає вміст іншого раніше завантаженого таба

## 7. Спеціалізовані джерела новин на категорію (замість фільтрації спільних BBC-фідів)

- [x] 7.1 Оновити `server/utils/newsCategories.ts`: замінити `feedUrl` для `technology`, `finance`, `artificial-intelligence`, `gadgets`, `digital-currencies`, `playstation`, `apple` на TechCrunch/MarketWatch/TechCrunch(AI)/Engadget/CoinDesk/PlayStation Blog/9to5Mac відповідно; прибрати `keywords` для цих категорій (джерело вже вузькотематичне)
- [x] 7.2 Оновити `it-jobs`: `feedUrl` → TechRepublic "IT Employment", зберегти наявні `keywords` як додатковий фільтр; передбачити запасний фід (TechCrunch тег `layoffs`) на випадок недоступності основного
- [x] 7.3 Перевірити фактичну структуру RSS кожного нового джерела (поля зображення: `media:content`/`enclosure`/відсутність) і за потреби узагальнити `parseNewsFeedXml` у `server/utils/rss.ts`, щоб новина без розпізнаного зображення поверталась без помилки (image: undefined), а не падала
- [x] 7.4 Перезапустити dev-сервер і перевірити відповідь `/api/news/<category>` для кожної з 7 змінених категорій — кількість новин (до 10), наявність/відсутність зображення, відсутність дублікатів
- [x] 7.5 Перевірити сценарій недоступності запасного/основного джерела для `it-jobs` (наприклад, тимчасово підмінити URL на неробочий) — переконатись, що ендпоінт повертає 502, а не 500, і що UI показує стан помилки лише для цього таба

## 8. Заглушка для відсутнього зображення в картці

- [x] 8.1 Додати статичну заглушку зображення (SVG або CSS-плейсхолдер, без зовнішнього запиту) для картки новини
- [x] 8.2 Оновити `app/components/NewsCard.vue`: замінити `v-if="imageUrl"` так, щоб блок зображення рендерився завжди — реальне зображення при наявності `imageUrl`, інакше заглушка
- [x] 8.3 Додати тест (unit/component) для `NewsCard.vue`: картка з `imageUrl: null` рендерить заглушку; картка з `imageUrl` рендерить `<img>` із заданим `src`
- [x] 8.4 Перевірити візуально: EPL-таб і категорії без зображень у джерелі (technology, artificial-intelligence, playstation, apple, it-jobs) показують заглушку; категорії із зображеннями (finance, gadgets, digital-currencies) як і раніше показують реальне зображення
