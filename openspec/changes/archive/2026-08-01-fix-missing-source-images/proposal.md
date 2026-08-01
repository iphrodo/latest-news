## Why

News cards for the Investing.com and Push Square sources render without an image in the category tabs and the European football landing feed, even though the corresponding articles do have images. Investigation found two separate root causes: Investing.com's RSS feed mislabels its `<enclosure>` MIME type, which the feed parser then rejects as non-image; Push Square's `<media:thumbnail>` URL is parsed correctly, but the CDN (`images.pushsquare.com`) blocks hotlinked image requests, so the browser fails to load the image and shows a broken image icon instead of the existing placeholder. Both are user-visible defects that degrade the news feed's visual quality.

## What Changes

- Relax RSS enclosure image detection (`server/utils/rss.ts`) to also accept enclosures whose URL has a recognized image file extension, even when the declared MIME type is missing or wrong, fixing Investing.com's mislabeled enclosures.
- Add a client-side image load error handler to the news card image (`app/components/NewsCard.vue`) that falls back to the existing placeholder UI when the browser fails to load the `imageUrl` (covers Push Square's hotlink-blocked CDN images and any other broken/blocked image URL from any source).
- Clarify the existing "no image" placeholder requirement in the `news-category-tabs` and `epl-news-landing` specs to explicitly cover the case where an image URL is provided but fails to load in the browser, not only the case where no URL is provided at all.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `news-category-tabs`: the image placeholder requirement is clarified to also cover image URLs that fail to load client-side, not only items with no image URL.
- `epl-news-landing`: same clarification applied to the equivalent placeholder requirement in the European football feed.

## Impact

- `server/utils/rss.ts` (`isImageEnclosure`, feed parsing used by all sources, including Investing.com)
- `app/components/NewsCard.vue` (shared card component used by every category and the European football feed)
- `openspec/specs/news-category-tabs/spec.md`, `openspec/specs/epl-news-landing/spec.md` (spec clarification only, no new requirement)
- No API or data-shape changes; no other source's behavior changes.
