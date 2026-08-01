## 1. Data model and source config

- [x] 1.1 Add `source: string` to `RawNewsItem` in `server/utils/rss.ts`; update `parseNewsFeedXml` to accept and stamp a `sourceName` argument on every parsed item
- [x] 1.2 Change `NewsCategoryConfig` in `server/utils/newsCategories.ts` from `feedUrl`/`fallbackFeedUrl` to `feedUrls: { url: string; source: string }[]`
- [x] 1.3 For each of the 10 categories, bring the source count to exactly 5 RSS entries (reusing existing `it-jobs` fallback URL as one of `it-jobs`'s entries); manually verify each new feed URL is reachable and returns a parseable RSS 2.0 `<rss><channel><item>` document (not Atom) before committing it
- [x] 1.4 Update `server/api/news/[category].get.ts` and any other callers to the new config shape

## 2. Multi-source fetch and merge

- [x] 2.1 In `server/utils/newsCategoryLoader.ts`, replace the sequential primary/fallback fetch with a parallel fetch of all `feedUrls` via `Promise.allSettled`
- [x] 2.2 Tag each parsed item with its configured `source` name and merge all settled results into a single array
- [x] 2.3 If every source for a category rejects, throw the existing "Failed to load {label} news feed" error (preserve current error behavior for total failure)
- [x] 2.4 Raise `NEWS_LIMIT` from 10 to the higher cap chosen in design.md

## 3. Cross-source deduplication

- [x] 3.1 In `server/utils/newsFilter.ts`, add `dedupeBySimilarTitle(items)`: normalize titles (lowercase, strip punctuation/extra whitespace), compare via token-set overlap ratio, collapse pairs above the chosen similarity threshold
- [x] 3.2 When collapsing a duplicate pair, keep the item that has an `imageUrl`; if both/neither have one, keep the more recent by `publishedAt`
- [x] 3.3 Wire `dedupeBySimilarTitle` into `selectLatestNews`, running immediately after the existing `dedupeByLink` and before keyword filtering/sorting/limiting
- [x] 3.4 Add unit tests for `dedupeBySimilarTitle`: near-identical titles from different sources collapse to one; distinct stories with overlapping vocabulary remain separate; exact-link dedup still works unchanged

## 4. UI: show source

- [x] 4.1 Add a `source: string` prop to `app/components/NewsCard.vue` and render it near the publication date
- [x] 4.2 Pass `:source="item.source"` from `app/app.vue` bindings (both usages) to `NewsCard`

## 5. Verification

- [x] 5.1 Run the app locally and open several category tabs (e.g. epl, technology, digital-currencies); confirm item counts increased and no visible duplicate stories appear
- [x] 5.2 Temporarily point two of a category's sources at feeds known to cover the same story and confirm `dedupeBySimilarTitle` collapses them to one card
- [x] 5.3 Temporarily break one source's URL for a multi-source category and confirm the tab still renders using the remaining sources, without an error state
- [x] 5.4 Run typecheck/lint if configured in the project
