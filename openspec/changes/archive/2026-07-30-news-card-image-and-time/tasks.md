## 1. Дані новин (сервер)

- [x] 1.1 Додати поле `imageUrl: string | null` до `RawNewsItem` у `server/utils/rss.ts`
- [x] 1.2 Увімкнути `ignoreAttributes: false` у `XMLParser` та витягувати `media:thumbnail/@_url` як `imageUrl`
- [x] 1.3 Переконатись, що `server/utils/newsFilter.ts` та `server/api/news.ts` пропускають `imageUrl` без змін логіки фільтрації/сортування

## 2. Компонент картки новини

- [x] 2.1 Додати проп `imageUrl: string | null` до `NewsCard.vue`
- [x] 2.2 Перебудувати розмітку: зображення зліва (`<img>`, `v-if="imageUrl"`), заголовок/уривок/дата справа, flex-контейнер
- [x] 2.3 Оновити `formatDate`, щоб показувати дату разом із часом публікації (`toLocaleString` з `hour`/`minute`)
- [x] 2.4 Адаптивний стиль: на мобільних (`max-width: 480px`) зображення переходить над текстом, `flex-direction: column`

## 3. Інтеграція сторінки

- [x] 3.1 Додати `imageUrl` до інтерфейсу `NewsItem` у `app/app.vue`
- [x] 3.2 Прокинути `:image-url="item.imageUrl"` у `NewsCard`

## 4. Перевірка

- [x] 4.1 Запустити dev-сервер, перевірити відповідь `/api/news` — поле `imageUrl` присутнє
- [x] 4.2 Перевірити SSR-розмітку сторінки — класи `news-card__image`/`news-card__body` присутні
- [x] 4.3 Візуально перевірити картку в браузері (зображення зліва, дата з часом) та мобільний вигляд
