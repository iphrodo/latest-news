## 1. Feed URL swap

- [x] 1.1 In `server/api/news.ts`, replace the `RSS_FEED_URL` constant value with `https://www.skysports.com/rss/11095`
- [x] 1.2 In `server/utils/newsCategories.ts`, replace `BBC_FOOTBALL_FEED_URL`'s value (or the constant itself) with `https://www.skysports.com/rss/11095`, updating its name if it's kept BBC-specific

## 2. Verification

- [x] 2.1 Run `npm run test` and fix any failures
- [x] 2.2 Manually load the landing page and the "European Football" tab; confirm items now come from Sky Sports (check `link` URLs) and the item count/image rendering look correct
- [x] 2.3 Run `openspec validate switch-football-news-source-to-sky-sports --strict` and fix any issues
