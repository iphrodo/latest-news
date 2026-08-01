## Why

Image handling for news sources currently lives only as an implicit side effect of generic RSS parsing and a generic card fallback. Two sources need behavior specific enough to their own quirks (a mislabeled RSS enclosure type for Investing.com, a hotlink-blocking CDN for Push Square) that it deserves its own capability spec per source, rather than being buried inside the general-purpose parsing code with no explicit contract. Push Square in particular still shows a placeholder instead of its real thumbnail today; making its image visible requires a new, real capability (server-side image proxy), not just a spec write-up of existing behavior.

## What Changes

- Document, as its own capability spec, the already-implemented requirement that Investing.com's RSS enclosures are recognized as images by file extension even when the feed mislabels the declared MIME type.
- Introduce a new capability: a server-side image proxy for Push Square, so the browser fetches thumbnails through the app's own server instead of hotlinking `images.pushsquare.com` directly (which blocks hotlinked requests with a Cloudflare bot challenge). News cards for Push Square will show their real thumbnail instead of the generic placeholder once this is implemented.
- No changes to the generic `news-category-tabs` or `epl-news-landing` specs - their existing "image fails to load → placeholder" scenario continues to apply as the fallback when either source-specific mechanism fails.

## Capabilities

### New Capabilities
- `investing-com-images`: documents Investing.com's RSS enclosure image-extraction behavior (extension-based recognition, tolerant of a mislabeled MIME type).
- `push-square-images`: a server-side proxy that fetches Push Square thumbnail images and serves them from the app's own domain, avoiding the source CDN's hotlink block.

### Modified Capabilities
(none)

## Impact

- `server/utils/rss.ts` — no behavior change; `investing-com-images` documents existing `isImageEnclosure` behavior.
- New server route (e.g. an image-proxy endpoint) and a change to how Push Square's `imageUrl` is produced/rewritten so news cards request it through that route.
- `app/components/NewsCard.vue` — no change; it already renders whatever `imageUrl` it's given and falls back to the placeholder on load failure.
