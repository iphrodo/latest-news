## Why

The "Transfers & Rumours" tab (added by `add-football-transfers-category`) sources ESPN's soccer feed, which carries no image data in the RSS itself, so every card falls back to the placeholder. That was an accepted trade-off at the time, but ESPN's article pages themselves do carry a usable image (`og:image` meta tag), so the tab can show real images without switching feeds.

## What Changes

- When a news item's RSS entry has no image (`imageUrl: null` after RSS parsing), fetch that item's article page and extract its `og:image` meta tag as a fallback image source.
- This is implemented generically in the shared category-loading pipeline (not football-transfers-specific code), so it benefits any current or future category whose feed lacks image data - but today only `football-transfers` (ESPN) triggers it, since every other category's feed already supplies an image.
- On fetch failure, timeout, or missing `og:image` tag, the item keeps `imageUrl: null` and the existing placeholder rendering applies - no new error states.
- No changes to feed sources, keyword filters, tab position, or any other category's behavior.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none - `news-category-tabs`'s "Category news item without an image in the source" scenario already covers the placeholder path; this change only reduces how often that path is reached by finding an image ESPN's RSS didn't expose, it doesn't change required behavior)

## Impact

- `server/utils/newsCategoryLoader.ts` (or a new small helper it calls): after selecting the final list of items, resolve missing images via a best-effort per-item article-page fetch, in parallel, bounded by a timeout.
- New helper (e.g. `server/utils/articleImage.ts`): fetch a page and extract `og:image` content via a simple meta-tag match.
- No changes to `server/utils/rss.ts`'s feed parsing, `server/utils/newsFilter.ts`, `server/utils/newsCategories.ts`, `NewsCard.vue`, or `app/app.vue`.
