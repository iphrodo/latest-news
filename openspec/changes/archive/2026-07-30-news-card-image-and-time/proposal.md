## Why

News cards currently show only text and the publication date without a time, making it hard to tell at a glance how fresh a news item is (today's or yesterday's at the same date). Adding a news image also makes the feed more visually appealing and easier to scan.

## What Changes

- Add the news image on the left of the card (`NewsCard.vue`), with the rest of the content (title, excerpt, date/time) on the right.
- If a news item has no image, the card is displayed without one (no empty placeholder or gap).
- Show not just the date, but also the news item's publication time on the original site (format: dd month yyyy, hh:mm).
- Extend `/api/news` and the RSS parser (`server/utils/rss.ts`) to extract the image URL from the `media:thumbnail` tag of the RSS feed and return it as an `imageUrl` field (`string | null`).
- Responsive layout: on narrow screens, the image moves above the text instead of being a left column.

## Capabilities

### Modified Capabilities
- `epl-news-landing`: the "News card content" requirement is extended — the news card additionally shows an image (when available) and the publication time, not just the date.

## Impact

- `server/utils/rss.ts` — parsing `media:thumbnail`, new `imageUrl` field in `RawNewsItem`.
- `server/api/news.ts` / `server/utils/newsFilter.ts` — the `imageUrl` field passes through without changes to the filtering logic.
- `app/components/NewsCard.vue` — new layout (image on the left, content on the right), date format with time.
- `app/app.vue` — update the `NewsItem` type and pass the `imageUrl` prop to `NewsCard`.
