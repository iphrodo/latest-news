## 1. Fix RSS enclosure image detection (Investing.com)

- [x] 1.1 Update `isImageEnclosure` in `server/utils/rss.ts` to also accept an enclosure whose `@_url` ends in a recognized image extension (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, case-insensitive, ignoring query strings), even when `@_type` is present but does not start with `image/`.
- [x] 1.2 Verify against the live Investing.com feed (or a saved fixture of it) that `parseNewsFeedXml` now returns a non-null `imageUrl` for its items.

## 2. Fall back to placeholder on broken image load (Push Square and any source)

- [x] 2.1 In `app/components/NewsCard.vue`, add local state tracking whether the image failed to load, and an `@error` handler on the `<img>` that sets it.
- [x] 2.2 Update the template so the placeholder block renders when `imageUrl` is falsy OR the image failed to load, instead of only when `imageUrl` is falsy.

## 3. Spec sync

- [x] 3.1 Confirm the `news-category-tabs` and `epl-news-landing` spec deltas in this change accurately describe the new "image fails to load" scenario before archiving.
