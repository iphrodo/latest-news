## Why

English Premier League fans want to quickly browse the latest news without searching across multiple sites. A simple single-page landing page with a curated list of the 10 latest news items addresses this need with minimal effort.

## What Changes

- A new landing page displaying a list of the 10 latest EPL news items (title, short description, publication date, link to source).
- Fetching news from an external source (a news API or RSS feed) when the page loads.
- Basic responsive UI: page heading, news list/cards, loading state, and error state (when the source is unavailable).

## Capabilities

### New Capabilities
- `epl-news-landing`: A landing page that fetches and displays the 10 latest English Premier League news items.

### Modified Capabilities
<!-- no existing capabilities to modify -->

## Impact

- New frontend code: landing page/component, news card component, styles.
- Integration with an external news source (API/RSS) — a specific provider needs to be chosen at the design stage.
- No impact on existing systems, since the project starts from scratch.
