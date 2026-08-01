## Why

Each news category currently pulls from a single RSS source (with an optional fallback used only when the primary feed is empty or fails), which caps the number of distinct stories a visitor can see per category at 10 and leaves feeds thin whenever that one source is quiet. Pulling from multiple sources per category increases the volume of available news, but naively merging feeds would surface the same story twice when two outlets cover the same event — so cross-source deduplication must ship alongside the multi-source fetch.

## What Changes

- Each news category fetches from multiple RSS sources in parallel instead of one primary + one fallback.
- Articles from all sources for a category are merged into a single pool before filtering/sorting.
- New deduplication step removes near-duplicate stories (same event, different source, different URL) based on title similarity, in addition to the existing exact-URL dedup.
- The per-category item cap increases from a fixed 10 to a higher limit, since more raw items are now available after merging.
- Each displayed news card shows which source (outlet) it came from.
- If one of a category's sources is unavailable or errors, the category still renders using the remaining sources instead of failing entirely.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `epl-news-landing`: the landing page's European football feed sources from multiple outlets, deduplicates near-identical stories across those outlets, shows more than 10 items, displays each item's source, and tolerates individual source failures.
- `news-category-tabs`: each category tab sources from multiple outlets, deduplicates near-identical stories across those outlets, shows more than 10 items per category, displays each item's source, and tolerates individual source failures without affecting other tabs.

## Impact

- `server/utils/newsCategories.ts`: category config changes from a single `feedUrl`/`fallbackFeedUrl` pair to a list of sources per category.
- `server/utils/newsCategoryLoader.ts`: fetch logic changes from sequential primary/fallback to parallel multi-source fetch + merge.
- `server/utils/newsFilter.ts`: add cross-source near-duplicate detection alongside existing exact-URL dedup.
- `server/utils/rss.ts`: article shape gains a `source` field.
- `app/components/NewsCard.vue`, `app/app.vue`: display the source name on each card.
- No breaking changes to the public `/api/news/[category]` route contract beyond the added `source` field (additive).
