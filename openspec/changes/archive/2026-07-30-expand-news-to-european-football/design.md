## Context

The landing page and the "EPL" category tab both source news from the same BBC football RSS feed (`https://feeds.bbci.co.uk/sport/football/rss.xml`) via `server/api/news.ts` and `server/api/news/[category].get.ts`. Both filter items through `selectLatestNews(items, limit, keywords)` in `server/utils/newsFilter.ts`, using the `EPL_KEYWORDS` list exported from that file and referenced in `server/utils/newsCategories.ts`. Broadening scope from EPL-only to all European football is purely a filtering/labeling change - no new feed source is needed, since the BBC football feed already covers European football broadly. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Broaden the keyword filter so the landing page and its tab show news from the top 5 European domestic leagues and major UEFA club competitions, not just the EPL.
- Keep a single shared keyword list used by both the landing page (`server/api/news.ts`) and the category feed (`newsCategories.ts`'s `epl` entry), so both stay in sync.
- Update user-facing labels ("EPL" tab, any page copy) to reflect the broader scope.

**Non-Goals:**
- Adding new RSS feed sources per league (BBC's football feed already aggregates across leagues/competitions).
- Per-league sub-filtering or per-league tabs - this change keeps a single combined "European Football" feed, matching the existing single-tab structure.
- Changing card layout, pagination, caching, or error-handling behavior - only the content scope and labels change.

## Decisions

- **Extend `EPL_KEYWORDS` into a new `EUROPEAN_FOOTBALL_KEYWORDS` list** in `server/utils/newsFilter.ts`, covering: existing EPL club names, plus competition terms (`champions league`, `europa league`, `conference league`, `uefa`), plus a representative set of top clubs from La Liga, Serie A, Bundesliga, and Ligue 1 (e.g. Real Madrid, Barcelona, Atletico Madrid, Juventus, AC Milan, Inter Milan, Napoli, Bayern Munich, Borussia Dortmund, PSG, plus league names "la liga", "serie a", "bundesliga", "ligue 1"). Alternative considered: drop keyword filtering entirely and show the raw football feed unfiltered - rejected because the BBC football feed also includes non-European football (e.g. World Cup qualifiers, non-European club news) that would dilute the "European football" framing the tabs/landing page promise.
- **Keep the existing `isEplNews` export for backward compatibility within this module but repoint the landing page and category config to the new list**; rename is contained to `newsFilter.ts` and `newsCategories.ts` call sites. Alternative considered: rename the exported symbol everywhere (`isEplNews` → `isEuropeanFootballNews`) - preferred for clarity, so this rename is included since it's a small, contained change with test coverage.
- **Keep the `epl` category key in `NEWS_CATEGORIES`** to avoid touching client-side category-id wiring (`useNewsCategories.ts`, tab click handlers), only changing its `label` (e.g. to "European Football") and `keywords`. Alternative considered: rename the key to `european-football` - rejected for this change to minimize blast radius on the tab-switching/caching logic keyed by category id; can be revisited separately if desired.

## Risks / Trade-offs

- [Broader keyword list may over-match unrelated news mentioning a European club name in passing] → Mitigate by matching against title + excerpt only (existing behavior) and reviewing initial output during manual testing; acceptable given the existing EPL filter has the same class of false-positive risk today.
- [Larger keyword list is harder to maintain than a single-league list] → Keep list grouped by league/competition with inline comments in the source file for readability.
- [Existing tests assert EPL-only keyword behavior] → Update `server/utils/rss.test.ts`, `server/utils/newsCategoryLoader.test.ts`, and any other test referencing `EPL_KEYWORDS`/`isEplNews` to use the new list/name and European-football fixtures.
