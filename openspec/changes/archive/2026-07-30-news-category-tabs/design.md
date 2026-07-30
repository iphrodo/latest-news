## Context

Currently `server/api/news.ts` is hard-wired to a single RSS feed (BBC Sport Football) and a single keyword filter (`isEplNews`). `app/app.vue` makes a single `useFetch` on page load. See proposal.md - Why for motivation.

## Goals / Non-Goals

**Goals:**
- Allow adding new news categories declaratively (RSS source + optional keywords) without rewriting the API layer each time.
- Ensure enough relevant news per category (up to 10) by using specialized thematic sources instead of filtering two general feeds.
- Guarantee the initial page load is no heavier than the current one (no additional requests until a tab is opened).
- Isolate the state (data/loading/error) of each category from the others.

**Non-Goals:**
- Server-side/HTTP caching of RSS responses across users or between requests (a separate performance topic, out of scope for this change).
- Persisting the client cache across page reloads (the cache lives only within the current SPA session).
- Arbitrary user-defined categories — the category list is fixed and defined server-side.

## Decisions

- **Categories as configuration, not separate files**: create `server/utils/newsCategories.ts` with a map of `slug -> { label, feedUrl, keywords? }` for the 8 new categories + `epl` (which reuses the existing `EPL_KEYWORDS`/`isEplNews`). A single dynamic endpoint `server/api/news/[category].get.ts` reads the `slug`, finds the configuration, fetches the corresponding RSS, and filters. The alternative (a separate endpoint file per category) was rejected — 9 nearly identical files would just increase duplication.
- **A specialized source per category instead of filtering a shared feed**: the previous approach (2 shared BBC feeds + keyword filtering for 6 categories) yielded too little news for narrow topics. Instead, each category gets its own thematic RSS feed:
  - `technology` → TechCrunch (main feed, no filter — already thematic)
  - `finance` → MarketWatch Top Stories (no filter)
  - `artificial-intelligence` → TechCrunch, AI category (no filter — the source is already narrowly thematic)
  - `gadgets` → Engadget (no filter)
  - `digital-currencies` → CoinDesk (no filter)
  - `playstation` → PlayStation Blog (no filter — official blog, all content is relevant)
  - `apple` → 9to5Mac (no filter)
  - `it-jobs` → TechRepublic "IT Employment" (fallback source — TechCrunch `layoffs` tag, if the primary is unavailable); keywords (`layoffs`, `hiring`, `job cuts`, etc.) remain as an additional filter, since even a thematic feed can contain irrelevant articles.
  - `epl` → unchanged, BBC Football + `EPL_KEYWORDS`.
- **Keywords are the exception, not the rule**: unlike the previous design, `keywords` in a category's configuration are now only needed where the source isn't narrow enough on its own (`it-jobs`, `epl`). For the other categories, `config.keywords` is not set, and `selectLatestNews` returns the feed without filtering.
- **`rss.ts` becomes parameterized by feed URL**: `fetchNewsFeedXml(url: string)` instead of the hardcoded `RSS_FEED_URL`.
- **The parser needs to become tolerant of different RSS structures**: TechCrunch/MarketWatch/Engadget/CoinDesk/PlayStation Blog/9to5Mac/TechRepublic are all valid RSS 2.0, but differ from BBC in their image fields (`media:content`, `enclosure`, an `<image>` inside `<item>`, or no image at all) and sometimes in the description (HTML markup in `description`). `parseNewsFeedXml` needs to be generalized: try known image fields in sequence and return the news item without an image if none is found, instead of failing with an error.
- **Client-side cache — a simple `ref<Record<string, NewsItem[]>>` in `app.vue`** (or a `useNewsCategory` composable), without an external caching library. The key is the category slug. On click: if the cache has an entry — show it instantly without a request; otherwise perform `$fetch('/api/news/' + slug)` and store the result in the cache after success.
- **State per tab, not global**: `pending`/`error` are stored in a `Record<string, 'idle'|'pending'|'error'>` separate from the data cache, so an error in one tab doesn't mark others as "loading".
- **EPL remains the first/default tab**: it uses data already loaded during SSR (`useFetch` as now), the rest are purely client-side lazy fetches. This preserves the current behavior of the EPL feed (SSR, no flicker).
- **Placeholder for a missing image in the card**: `NewsCard.vue` is a shared component for EPL and all categories, so changing behavior for one affects all. Instead of `v-if="imageUrl"` (fully hiding the image block), the component always renders the image block: a real `<img>` when `imageUrl` is set, otherwise a static placeholder (a simple SVG/CSS image with a neutral icon, no external request). This deliberately changes the behavior of `epl-news-landing` (scenario "News item without an image") — so this change introduces a `MODIFIED Requirement` in this change's `specs/epl-news-landing/spec.md`.

## Risks / Trade-offs

- [Each new source (TechCrunch, MarketWatch, Engadget, CoinDesk, PlayStation Blog, 9to5Mac, TechRepublic) is a separate external host with its own availability/response speed] → Source error handling as a 502 already exists at the endpoint level (unchanged); one source failing doesn't affect other categories, since each tab is independent.
- [RSS structure differs between sources (image/description), the parser may fail to extract some fields for new feeds] → The parser is generalized to tolerantly handle missing fields (a news item without an image is not an error); manually verified for each new feed during implementation (see tasks.md).
- [The TechRepublic feed for IT Jobs may be unstable or of low relevance] → Fallback source (TechCrunch `layoffs` tag) + the retained keyword filter as a second layer of protection against irrelevant content.
- [Expanding the set of categories in the future requires editing the server configuration file] → A deliberate trade-off: configuration lives server-side, not as a user-facing setting — out of scope for this change.
- [The client cache is lost on `F5`] → Expected behavior (Non-Goal: persist between reloads), the user just clicks the tab again.
