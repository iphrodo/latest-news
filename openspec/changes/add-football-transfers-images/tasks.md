## 1. Article-image helper

- [x] 1.1 Add `fetchArticleImageUrl(link: string): Promise<string | null>` (e.g. in a new `server/utils/articleImage.ts`) - fetches the article page with a 3s timeout, extracts `content` from `<meta property="og:image" content="...">` via regex, and resolves `null` (never throws) on any HTTP error, timeout, or missing tag

## 2. Wire into the category loader

- [x] 2.1 In `server/utils/newsCategoryLoader.ts`'s `loadCategoryNews`, after `selectLatestNews` picks the final items, resolve `fetchArticleImageUrl` in parallel (`Promise.allSettled`) for every item with `imageUrl === null`, and fill in the resolved image where one was found

## 3. Test coverage

- [x] 3.1 Add unit tests for `fetchArticleImageUrl`: extracts `og:image` from a sample HTML fixture, returns `null` on non-200 response, returns `null` on missing tag, returns `null` on timeout/network error
- [x] 3.2 Add a test on `loadCategoryNews` confirming it fills in `imageUrl` for items that had `null` from the feed, and leaves items with a feed-provided image untouched (no extra fetch triggered for those)

## 4. Verification

- [x] 4.1 Run `npm run test` and fix any failures
- [x] 4.2 Manually load the "Transfers & Rumours" tab; confirm items are transfer/rumour-related, sorted newest to oldest, and cards now show real article images pulled from ESPN's article pages (not the placeholder) where available
- [x] 4.3 Run `openspec validate add-football-transfers-images --strict` and fix any issues
