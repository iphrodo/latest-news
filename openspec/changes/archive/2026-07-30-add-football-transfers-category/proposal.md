## Why

Visitors interested in transfer news and rumours currently have to sift through the general "European Football" feed, where transfer content is mixed with match reports, opinion pieces, and other coverage. A dedicated tab filtered specifically for transfer/rumour content, sourced from ESPN's soccer feed, gives that audience a focused view without a new architectural pattern.

## What Changes

- Add a new "Transfers & Rumours" category tab, following the existing category-tab pattern (like the "IT Jobs" tab): a single feed URL plus a keyword filter that narrows a general feed down to on-topic items.
- Source: ESPN's soccer feed (`https://www.espn.com/espn/rss/soccer/news`) - ESPN does not publish a transfers-only RSS endpoint, so this general soccer feed is filtered by transfer/rumour keywords (e.g. "transfer", "signing", "deal", "loan", "rumors", "sources:", "medical", "bid").
- No changes to existing tabs, feeds, or filtering logic for other categories.

## Capabilities

### New Capabilities

(none - this follows the same pattern as the other 8 category tabs, e.g. IT Jobs, none of which have their own capability spec; behavior is covered by `news-category-tabs`)

### Modified Capabilities

- `news-category-tabs`: The "Category tabs panel" requirement's list of tabs gains "Transfers & Rumours" alongside the existing categories. The existing "Category feed content" requirement already covers this tab generically (10 latest items, card format), so no change needed there.

## Impact

- `server/utils/newsCategories.ts`: new `football-transfers` entry in `NEWS_CATEGORIES` (ESPN feed URL + transfer keyword list).
- `server/utils/newsFilter.ts` or a new keyword constant: transfer/rumour keyword list.
- No changes expected to `server/utils/rss.ts` parsing, `NewsCard.vue`, or `CategoryTabs.vue` - the existing category-tab machinery (`useNewsCategories.ts`, `newsCategoryLoader.ts`, `/api/news/[category].get.ts`) already supports adding a config entry.
- `app/app.vue`: add the new tab to `CATEGORY_TABS`.
