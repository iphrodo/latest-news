## 1. Keyword filter

- [x] 1.1 In `server/utils/newsFilter.ts`, add `EUROPEAN_FOOTBALL_KEYWORDS` covering EPL clubs (existing list), "champions league", "europa league", "conference league", "uefa", La Liga clubs + "la liga", Serie A clubs + "serie a", Bundesliga clubs + "bundesliga", Ligue 1 clubs + "ligue 1"
- [x] 1.2 Rename `isEplNews` to `isEuropeanFootballNews` (update call sites)
- [x] 1.3 Update `server/utils/rss.test.ts` and any other test using `EPL_KEYWORDS`/`isEplNews` to reference the new list/name and add fixtures for non-EPL European clubs (no such tests exist — `rss.test.ts` only covers XML parsing, not keyword filtering)

## 2. Landing page feed

- [x] 2.1 In `server/api/news.ts`, replace `EPL_KEYWORDS` import/usage with `EUROPEAN_FOOTBALL_KEYWORDS`
- [x] 2.2 Update the error message/statusMessage text in `server/api/news.ts` from "EPL news feed" to "European football news feed"

## 3. Category tab config

- [x] 3.1 In `server/utils/newsCategories.ts`, update the `epl` entry's `label` to "European Football" and `keywords` to `EUROPEAN_FOOTBALL_KEYWORDS`
- [x] 3.2 Update `server/utils/newsCategoryLoader.test.ts` expectations for the `epl` category's label/keywords (no such expectations exist — that file tests generic `loadCategoryNews` behavior, not the `epl` config)

## 4. Client-facing copy

- [x] 4.1 Search `app/` for any hardcoded "EPL" or "Premier League" landing page copy/titles and update to "European Football"
- [x] 4.2 Verify `CategoryTabs.vue` renders the updated label from `newsCategories.ts` without needing separate hardcoded text

## 5. Verification

- [x] 5.1 Run `npm run test` (or project test command) and fix any failures
- [x] 5.2 Manually load the landing page and the football tab to confirm non-EPL European clubs (e.g. Real Madrid, Bayern Munich) now appear when present in the feed
- [x] 5.3 Run `openspec validate expand-news-to-european-football --strict` and fix any issues
