## Why

The landing page and the "EPL" tab currently filter the BBC football RSS feed down to English Premier League clubs only, using a fixed `EPL_KEYWORDS` list. Visitors interested in European football broadly (La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, etc.) see none of that coverage. Broadening the filter to all major European football competitions makes the feed useful to a wider football audience without adding a new data source.

## What Changes

- Replace the EPL-only keyword filter with a broader European football filter covering the top domestic leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) and major European club competitions (UEFA Champions League, UEFA Europa League, UEFA Conference League).
- Rename the "EPL" tab/label to "European Football" (or equivalent) and update the landing page copy/title so it no longer reads as English-Premier-League-specific.
- **BREAKING**: The `epl` category key's content set changes — visitors who relied on strictly EPL-only results in that tab will now also see other European leagues' news.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `epl-news-landing`: Landing page requirements change from "10 latest EPL news items" to "10 latest European football news items" (covering top European leagues and competitions, not just the EPL), including the corresponding text/label changes.
- `news-category-tabs`: The football tab's label and filtering scope change from EPL-only to all major European football, and the "Category feed content" requirement is updated to reflect the broadened keyword set for that tab.

## Impact

- `server/utils/newsFilter.ts`: `EPL_KEYWORDS` replaced/extended with a broader `EUROPEAN_FOOTBALL_KEYWORDS` list (or renamed export) covering top-5 European leagues' clubs and major UEFA competitions.
- `server/utils/newsCategories.ts`: `epl` category config's `label` and `keywords` updated accordingly (key may stay `epl` or be renamed; tab label changes).
- `server/api/news.ts`: uses the updated keyword list for the landing page feed.
- `app/components/CategoryTabs.vue` / landing page copy: tab label and any EPL-specific text updated to "European Football".
- Existing tests referencing EPL-specific behavior (`server/utils/newsCategoryLoader.test.ts`, `server/utils/rss.test.ts`, `app/components/NewsCard.test.ts` if applicable) updated to match the new scope.
