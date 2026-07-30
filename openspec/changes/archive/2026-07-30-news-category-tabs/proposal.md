## Why

The page currently shows only EPL news. Users want to browse news in other topics too (AI, technology, finance, etc.), but loading all categories at once when the page opens is a waste of bandwidth and time when a visitor only cares about one or two topics.

## What Changes

- Add a tab panel above the news feed with categories: Artificial Intelligence, Technology, Finance, Gadgets, Digital Currencies, Playstation, Apple, IT Jobs (plus the existing EPL feed as the default/first tab).
- News for a category is loaded only on the first click on the corresponding tab — without reloading the page (a client-side request to a new `/api/news/[category]` endpoint).
- Each category shows up to 10 latest news items, sorted from newest to oldest, with the same card appearance (image on the left, publication date/time) as the current EPL feed.
- Results for each already-opened category are cached on the client for the duration of the current page load — clicking the same tab again does not make another request to the server.
- Each tab has its own loading state and error state (with the option to retry), without affecting other tabs.
- If a news source does not provide an image URL, the card shows a simple placeholder instead of hiding the image block. This applies to all tabs, including EPL, since the news card is a shared component.
- News sources for the new categories are a separate specialized free RSS feed per category (instead of keyword-filtering two shared BBC feeds), because the general BBC Technology/Business feeds yield too little relevant news for narrow topics:
  - Artificial Intelligence — TechCrunch (`artificial-intelligence` category)
  - Technology — TechCrunch (main feed)
  - Finance — MarketWatch Top Stories
  - Gadgets — Engadget
  - Digital Currencies — CoinDesk
  - Playstation — PlayStation Blog
  - Apple — 9to5Mac
  - IT Jobs — TechRepublic ("IT Employment" topic), with a fallback source TechCrunch (`layoffs` tag) if the primary feed is unavailable; keywords remain as an additional relevance filter
  - EPL — unchanged (BBC Football, as now)

## Capabilities

### New Capabilities
- `news-category-tabs`: A panel of news category tabs, lazy client-side loading of news per category with client-side caching and independent loading/error states for each tab.

### Modified Capabilities
- `epl-news-landing`: the "News item without an image" scenario changes — the card now shows a placeholder in place of the image instead of hiding the image block. The rest of the EPL feed's behavior (SSR, card composition, error handling) is unchanged.

## Impact

- `server/utils/newsCategories.ts` — each new category gets its own `feedUrl` (TechCrunch/MarketWatch/Engadget/CoinDesk/PlayStation Blog/9to5Mac/TechRepublic) instead of the shared BBC Technology/Business; keywords remain only for IT Jobs (additional relevance filter) and EPL.
- `server/utils/rss.ts` / `parseNewsFeedXml` — check and, if needed, generalize parsing for each new source's RSS structure (image/description fields differ from BBC).
- `server/api/news/[category].ts` (new) — a dynamic endpoint returning up to 10 news items for the given category.
- `app/app.vue` — add the tabs panel component, active category state.
- `app/components/CategoryTabs.vue` (new) — tabs UI.
- Client-side cache of loaded categories (within `app.vue` or a composable), independent `pending`/`error` states per category.
- `app/components/NewsCard.vue` — add a placeholder for the case where `imageUrl` is missing, instead of fully hiding the image block (applies to EPL and all categories).
