## Context

Category tabs are configured entirely through `NEWS_CATEGORIES` in `server/utils/newsCategories.ts` - each entry is a `feedUrl` plus optional `keywords`, consumed by the generic `loadCategoryNews`/`newsCategoryLoader.ts` pipeline already shared by all 8 existing category tabs (see `it-jobs` for the closest precedent: a general feed narrowed by a keyword list). No per-category spec files exist for those tabs; their behavior is covered by `news-category-tabs`' generic "Category feed content" requirement. See proposal.md - Why.

Inspected ESPN's soccer feed (`https://www.espn.com/espn/rss/soccer/news`) directly: `title`/`description`/`link`/`pubDate` are present and standard; `pubDate` uses `EST`, which - unlike the earlier BBC/Sky Sports `BST` issue - is natively parsed by JS `Date`, so no changes to `server/utils/rss.ts`'s date normalization are needed. The feed has **no** `<enclosure>`, `media:thumbnail`, or `media:content`, and descriptions are plain text (no embedded `<img>`) - every item will have `imageUrl: null`. This is already a supported case (`NewsCard.vue` renders the existing placeholder), so transfer cards will consistently show the placeholder image rather than a photo.

## Goals / Non-Goals

**Goals:**
- Add a "Transfers & Rumours" tab using the existing category-tab config pattern, with no new code paths.

**Non-Goals:**
- Sourcing a feed with images - out of scope; accept the placeholder-only rendering as a known trade-off of this source.
- A fallback feed for when the primary has few matches (like IT Jobs' fallback) - not needed unless testing shows the ESPN feed under-matches, unlike the earlier BBC football issue.

## Decisions

- **Feed:** `https://www.espn.com/espn/rss/soccer/news` (ESPN's general soccer feed - it has no dedicated transfers-only endpoint) filtered by a new `FOOTBALL_TRANSFER_KEYWORDS` list in `server/utils/newsFilter.ts`: `transfer`, `transfers`, `signing`, `sign for`, `signs for`, `deal`, `loan`, `loan move`, `rumors`, `rumours`, `sources:`, `linked with`, `medical`, `bid for`, `move to`, `agree deal`, `agreed a deal`. Verified against a live fetch that this set matches genuine transfer items (e.g. "Sources: Arsenal confident of signing Guimarães", "Transfer rumors, news: Real Madrid confident of Rodri deal") without needing per-club names, since transfer language itself is the distinguishing signal (unlike the European-football filter, which needed club/league names because there was no "is this football" signal otherwise).
- **Category key:** `football-transfers`, label `Transfers & Rumours` - new key (not reusing `epl`), since this is a genuinely separate tab, consistent with how every other category has its own key.
- **No fallback feed:** ESPN's soccer feed publishes frequently and transfer-related keywords matched several of the ~20 most recent items in manual testing, so a single feed should keep the tab populated; can add a fallback later if this proves insufficient (same escape hatch used for IT Jobs).

## Risks / Trade-offs

- [ESPN feed provides no images, so every transfer card shows the placeholder icon] → Accepted; already a supported rendering path, and no other UK/EU sports RSS source checked provides transfer-specific images either.
- [Keyword list may under- or over-match as ESPN's headline phrasing shifts] → Same class of risk as every other keyword-filtered category; mitigate via manual verification during implementation, matching the existing pattern's mitigation.
