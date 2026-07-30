## Why

The BBC football RSS feed (`https://feeds.bbci.co.uk/sport/football/rss.xml`) is currently returning very few items that match the European football keyword filter, leaving the landing page and "European Football" tab under-populated. Switching to the Sky Sports football RSS feed (`https://www.skysports.com/rss/11095`) gives a higher-volume, football-dedicated source to filter against.

## What Changes

- Replace the BBC football feed URL with the Sky Sports football feed URL as the source for both the landing page feed (`server/api/news.ts`) and the `epl` category tab config (`server/utils/newsCategories.ts`).
- No change to the keyword filtering logic, requirements, or card rendering - this is a data-source swap only. The existing `EUROPEAN_FOOTBALL_KEYWORDS` filter and `selectLatestNews` behavior continue to apply unchanged.
- The Sky Sports feed's item structure (`title`, `description` excerpt, `link`, `pubDate`, image via `<enclosure>`) is compatible with the existing `server/utils/rss.ts` parser - confirmed by fetching and inspecting the live feed, no parser changes are required.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none - the "10 latest European football news items" requirement and card format are unchanged; only the underlying data source URL changes, which is an implementation detail, not a spec-level behavior change)

## Impact

- `server/api/news.ts`: RSS feed URL constant updated from the BBC football feed to the Sky Sports football feed.
- `server/utils/newsCategories.ts`: `epl` entry's `feedUrl` updated to the Sky Sports football feed.
- No changes expected to `server/utils/rss.ts`, `server/utils/newsFilter.ts`, or any client-side components.
