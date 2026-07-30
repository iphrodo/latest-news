## 1. News data (server)

- [x] 1.1 Add an `imageUrl: string | null` field to `RawNewsItem` in `server/utils/rss.ts`
- [x] 1.2 Enable `ignoreAttributes: false` in `XMLParser` and extract `media:thumbnail/@_url` as `imageUrl`
- [x] 1.3 Ensure `server/utils/newsFilter.ts` and `server/api/news.ts` pass `imageUrl` through without changes to the filtering/sorting logic

## 2. News card component

- [x] 2.1 Add an `imageUrl: string | null` prop to `NewsCard.vue`
- [x] 2.2 Rework the markup: image on the left (`<img>`, `v-if="imageUrl"`), title/excerpt/date on the right, flex container
- [x] 2.3 Update `formatDate` to show the date along with the publication time (`toLocaleString` with `hour`/`minute`)
- [x] 2.4 Responsive style: on mobile (`max-width: 480px`) the image moves above the text, `flex-direction: column`

## 3. Page integration

- [x] 3.1 Add `imageUrl` to the `NewsItem` interface in `app/app.vue`
- [x] 3.2 Pass `:image-url="item.imageUrl"` to `NewsCard`

## 4. Verification

- [x] 4.1 Start the dev server, check the `/api/news` response — the `imageUrl` field is present
- [x] 4.2 Check the page's SSR markup — the `news-card__image`/`news-card__body` classes are present
- [x] 4.3 Visually check the card in the browser (image on the left, date with time) and the mobile view
