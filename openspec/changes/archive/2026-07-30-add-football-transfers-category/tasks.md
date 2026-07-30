## 1. Keyword filter

- [x] 1.1 In `server/utils/newsFilter.ts`, add `FOOTBALL_TRANSFER_KEYWORDS` covering transfer/rumour terms: `transfer`, `transfers`, `signing`, `sign for`, `signs for`, `deal`, `loan`, `loan move`, `rumors`, `rumours`, `sources:`, `linked with`, `medical`, `bid for`, `move to`, `agree deal`, `agreed a deal`

## 2. Category config

- [x] 2.1 In `server/utils/newsCategories.ts`, add a `football-transfers` entry to `NEWS_CATEGORIES` with `label: 'Transfers & Rumours'`, `feedUrl: 'https://www.espn.com/espn/rss/soccer/news'`, and `keywords: FOOTBALL_TRANSFER_KEYWORDS`

## 3. Client-facing tab

- [x] 3.1 In `app/app.vue`, add `{ slug: 'football-transfers', label: 'Transfers & Rumours' }` to `CATEGORY_TABS`

## 4. Verification

- [x] 4.1 Run `npm run test` and fix any failures
- [x] 4.2 Manually load the "Transfers & Rumours" tab; confirm items are transfer/rumour-related, sorted newest to oldest, dates render correctly, and placeholder images show (ESPN's feed provides no image data)
- [x] 4.3 Run `openspec validate add-football-transfers-category --strict` and fix any issues
