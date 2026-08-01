## 1. Document Investing.com image behavior

- [x] 1.1 Confirm the `investing-com-images` spec delta in this change accurately reflects the already-implemented `isImageEnclosure` behavior in `server/utils/rss.ts` (no code changes needed for this part).

## 2. Build the Push Square image proxy route

- [x] 2.1 Add `server/api/image-proxy.get.ts`: reads a `url` query parameter, rejects any host other than `images.pushsquare.com`, fetches the image server-side with a timeout (reuse the existing `AbortController` timeout pattern), and streams back the response body with the original `Content-Type` and a long-lived `Cache-Control` header.
- [x] 2.2 Return an error status (not a 200 with empty/garbage body) when the URL is rejected, the fetch fails, times out, or the upstream response isn't an image, so the browser's `<img>` `error` event fires correctly.

## 3. Rewrite Push Square image URLs to use the proxy

- [x] 3.1 In `server/utils/newsCategoryLoader.ts` (or a small helper next to it), rewrite `imageUrl` to `/api/image-proxy?url=<encoded original>` for items whose source is Push Square, after parsing and before returning the category's news.
- [x] 3.2 Add a test covering that a Push Square item's `imageUrl` is rewritten to the proxy route, and that other sources' `imageUrl` values are left untouched.

## 4. Verify end-to-end

- [x] 4.1 Add a test for `server/api/image-proxy.get.ts` covering: allowed host succeeds and streams the image, disallowed host is rejected, upstream failure/timeout returns an error status.
- [x] 4.2 Run the full test suite and manually check a Push Square category tab in the browser to confirm real thumbnails now render instead of the placeholder.
