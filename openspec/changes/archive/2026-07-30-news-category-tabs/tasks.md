## 1. Server: parameterize RSS source

- [x] 1.1 Change `fetchNewsFeedXml` in `server/utils/rss.ts` to accept `feedUrl: string` instead of the hardcoded `RSS_FEED_URL`
- [x] 1.2 Verify that `parseNewsFeedXml` doesn't need changes for the new feeds (BBC News Technology/Business have the same RSS format)

## 2. Server: category configuration

- [x] 2.1 Create `server/utils/newsCategories.ts` with a map of `slug -> { label, feedUrl, keywords?: string[] }` for `technology`, `finance` (no keywords — the whole feed) and `artificial-intelligence`, `gadgets`, `digital-currencies`, `playstation`, `apple`, `it-jobs` (with keywords)
- [x] 2.2 Add an `epl` entry to the same map, reusing the existing `EPL_KEYWORDS`/feed from `server/utils/newsFilter.ts`
- [x] 2.3 Generalize `selectLatestEplNews` in `server/utils/newsFilter.ts` to `selectLatestNews(items, limit, keywords?: string[])`, which filters only when `keywords` is provided, otherwise returns all (with dedup by `link`, as now)

## 3. Server: dynamic category endpoint

- [x] 3.1 Create `server/api/news/[category].get.ts`: read `category` from the route, find the configuration in `newsCategories.ts`, return 404/400 if the category is unknown
- [x] 3.2 In the handler, call `fetchNewsFeedXml(config.feedUrl)`, `parseNewsFeedXml`, `selectLatestNews(items, 10, config.keywords)`, handle source errors as 502 (analogous to `server/api/news.ts`)

## 4. Client: category cache composable

- [x] 4.1 Create `app/composables/useNewsCategories.ts` (or equivalent) with state `Record<string, NewsItem[]>` (data cache) and `Record<string, 'idle' | 'pending' | 'error'>` (per-category state)
- [x] 4.2 Implement a `loadCategory(slug)` function: if the cache already has data for `slug` — do nothing (no request); otherwise set `pending`, call `$fetch('/api/news/' + slug)`, store the result in the cache or set `error`

## 5. Client: tabs UI

- [x] 5.1 Create `app/components/CategoryTabs.vue`: list of tabs (EPL + 8 new categories), highlight the active tab, emit on click
- [x] 5.2 In `app/app.vue` add `CategoryTabs`, an `activeCategory` state (defaulting to EPL), a click handler that calls `loadCategory(slug)` from the composable and switches the active tab
- [x] 5.3 For the active (non-EPL) tab, display: a loading indicator while `pending`, an error message with a "Try again" button while `error`, a list of `NewsCard` when data is present in the cache
- [x] 5.4 Ensure the EPL tab still shows data from the existing SSR `useFetch('/api/news')` without a behavior change

## 6. Verification

- [x] 6.1 Start the dev server, check the response of `/api/news/technology`, `/api/news/apple`, etc. — up to 10 news items, no duplicates
- [x] 6.2 Check an unknown category (`/api/news/unknown`) — expect an error, not a 500
- [x] 6.3 Visually verify in the browser: clicking a tab loads news without reloading the page; clicking an already opened tab again does not make a repeated network request (check the Network tab or a request counter)
- [x] 6.4 Verify state independence: an error in one tab doesn't break the content of another, previously loaded tab

## 7. Specialized news sources per category (instead of filtering shared BBC feeds)

- [x] 7.1 Update `server/utils/newsCategories.ts`: replace `feedUrl` for `technology`, `finance`, `artificial-intelligence`, `gadgets`, `digital-currencies`, `playstation`, `apple` with TechCrunch/MarketWatch/TechCrunch(AI)/Engadget/CoinDesk/PlayStation Blog/9to5Mac respectively; remove `keywords` for these categories (the source is already narrowly thematic)
- [x] 7.2 Update `it-jobs`: `feedUrl` → TechRepublic "IT Employment", keep the existing `keywords` as an additional filter; provide a fallback feed (TechCrunch `layoffs` tag) in case the primary is unavailable
- [x] 7.3 Check the actual RSS structure of each new source (image fields: `media:content`/`enclosure`/absence) and generalize `parseNewsFeedXml` in `server/utils/rss.ts` as needed, so a news item without a recognized image is returned without an error (image: undefined) instead of failing
- [x] 7.4 Restart the dev server and check the response of `/api/news/<category>` for each of the 7 changed categories — number of news items (up to 10), presence/absence of image, no duplicates
- [x] 7.5 Verify the scenario where the fallback/primary source is unavailable for `it-jobs` (e.g. temporarily swap the URL for a broken one) — confirm the endpoint returns 502, not 500, and that the UI shows an error state only for that tab

## 8. Placeholder for a missing image in the card

- [x] 8.1 Add a static image placeholder (SVG or CSS placeholder, no external request) for the news card
- [x] 8.2 Update `app/components/NewsCard.vue`: replace `v-if="imageUrl"` so that the image block always renders — a real image when `imageUrl` is present, otherwise a placeholder
- [x] 8.3 Add a test (unit/component) for `NewsCard.vue`: a card with `imageUrl: null` renders a placeholder; a card with `imageUrl` renders an `<img>` with the given `src`
- [x] 8.4 Visually verify: the EPL tab and categories without images in the source (technology, artificial-intelligence, playstation, apple, it-jobs) show a placeholder; categories with images (finance, gadgets, digital-currencies) still show a real image as before
