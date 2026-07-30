## Context

`server/api/news.ts` and the `epl` entry in `server/utils/newsCategories.ts` both hardcode `https://feeds.bbci.co.uk/sport/football/rss.xml` as the feed URL and pass items through the same `server/utils/rss.ts` parser and `EUROPEAN_FOOTBALL_KEYWORDS` filter. See proposal.md - Why.

Inspected the Sky Sports football feed (`https://www.skysports.com/rss/11095`, `<description>Football News</description>`) directly: it returns 20 items per request, each with `<title>` (CDATA), `<description>` (CDATA, used as excerpt), `<link>`, `<pubDate>` (RFC-822 format, same as BBC), and an `<enclosure type="image/jpg" url="...">` for the image - all fields `rss.ts` already knows how to extract (title/description/link/pubDate parsing, plus `<enclosure>` image extraction used by other categories already, e.g. IT Jobs' fallback feed). No parser changes needed.

Note: `https://www.skysports.com/rss/12040` (initially considered) is Sky Sports' general/all-sports feed and includes non-football content (horse racing, etc.) - `11095` is the correct football-only feed.

## Goals / Non-Goals

**Goals:**
- Point both feed consumers at the Sky Sports football feed instead of the BBC football feed.

**Non-Goals:**
- Any change to keyword filtering, card rendering, caching, or error handling.
- Adding a fallback/secondary feed - out of scope for this swap (can be revisited if Sky Sports also proves insufficient).

## Decisions

- **Use `https://www.skysports.com/rss/11095`** (Sky Sports' dedicated football feed) rather than `12040` (general sports feed) - confirmed via direct fetch that `11095`'s `<description>` is "Football News" and its items are football-only, while `12040` mixes in other sports.
- **Update the feed URL constant in both `server/api/news.ts` and `server/utils/newsCategories.ts` independently** rather than extracting a shared constant - consistent with the existing pattern where `BBC_FOOTBALL_FEED_URL` is already duplicated as a literal in `news.ts` and as a named constant in `newsCategories.ts`; not introducing a new shared-constants module for a single URL change.

## Risks / Trade-offs

- [Sky Sports feed's item volume/content mix may shift over time same as BBC's did] → No mitigation needed beyond what exists today; the keyword filter already handles noise the same way regardless of source.
