## Context

`football-transfers`'s ESPN feed has no `media:thumbnail`/`media:content`/`<enclosure>`/embedded `<img>`, so `extractImageUrl` in `server/utils/rss.ts` always returns `null` for it (verified against a live fetch of the raw feed XML: plain-text `<description>`, no image elements anywhere). This was a deliberate, documented trade-off in `add-football-transfers-category`'s design.md, not a bug - the placeholder path is exactly what the base `news-category-tabs` spec's "Category news item without an image in the source" scenario requires. See proposal.md - Why.

Checked ESPN's article pages directly (both with a browser UA and with curl's default UA - no bot-blocking observed): each has a standard `<meta property="og:image" content="...">` tag, e.g. fetching `https://www.espn.com/soccer/story/_/id/49489371/...` returns it in ~0.4s. So the image exists, just not in the RSS feed - it needs a second fetch per article.

`loadCategoryNews` (`server/utils/newsCategoryLoader.ts`) currently does one feed fetch, filters/sorts/limits to 10 items, and returns. There is no caching layer - every `/api/news/[category]` request re-fetches and re-parses from scratch.

## Goals / Non-Goals

**Goals:**
- Show a real image on `football-transfers` cards when ESPN's article page has one, without changing the feed source or keyword filter.
- Keep the fallback graceful: any failure to fetch or parse an article page must silently result in the existing placeholder, never an error or slower failure mode than today.
- Keep the mechanism generic (works for any category with `imageUrl: null` items) rather than football-transfers-specific, matching the existing config-driven category pattern.

**Non-Goals:**
- Caching article-page fetches across requests - out of scope; the existing pipeline has no caching layer at all, and adding one is a separate concern.
- Full HTML parsing/DOM - a targeted meta-tag regex match is sufficient and consistent with how `extractImageUrl` already extracts `<img src>` from embedded HTML via regex.
- Switching feed source (the alternative considered and rejected below).

## Decisions

- **Where:** Resolve missing images in `loadCategoryNews`, after `selectLatestNews` has picked the final ≤10 items - only fetch article pages for the (small, bounded) final list, not for every raw feed item.
- **How:** New `fetchArticleImageUrl(link: string): Promise<string | null>` helper - fetches the article HTML with a short timeout (3s, tighter than the 5s feed-fetch timeout since this is a best-effort enhancement, not a required load), extracts `content` from `<meta property="og:image" content="...">` via regex, and returns `null` on any error (bad status, timeout, no tag found). Never throws.
- **Concurrency:** Run all per-item lookups with `Promise.allSettled` in parallel (bounded by the list already being ≤10 items), so total added latency is roughly one article-fetch round-trip (~0.5-1s observed), not N sequential fetches.
- **Scope of application:** Only call the helper for items where `imageUrl === null` after RSS parsing - categories whose feeds already provide images (all except `football-transfers` today) incur zero extra fetches.
- **Alternative considered - switch `football-transfers` to Sky Sports' feed** (which already has `<enclosure>` images, like `epl`): rejected in favor of this approach per explicit user preference to keep sourcing from ESPN and use its article images instead of introducing a second football feed.

## Risks / Trade-offs

- [Added latency: every `football-transfers` request now does up to 10 extra HTTP fetches before responding] → Bounded by parallel execution and a tight 3s per-item timeout; worst case adds ~3s if ESPN is slow/unresponsive, no worse than today's placeholder path in outcome (image simply stays null).
- [ESPN could rate-limit or block scraping traffic from the server's IP/user-agent over time] → No bot-blocking observed in manual testing (both browser and default UAs returned 200); if ESPN starts blocking, the helper's error handling means it silently degrades to placeholders rather than failing the whole category load - same class of risk as any keyword-filtered category's feed becoming unavailable.
- [og:image markup could change or be article-type-dependent] → Same class of risk as the existing embedded-`<img>`-in-description extraction in `rss.ts`; mitigate via the test added in this change and manual verification, matching the existing pattern's mitigation.
