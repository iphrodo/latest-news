## Context

Push Square's feed items already carry a correct `imageUrl` (`server/utils/rss.ts` extracts it from `media:thumbnail`). The problem is purely at browser-fetch time: `images.pushsquare.com` returns an HTTP 403 Cloudflare bot challenge for direct hotlinked `<img>` requests, verified via curl even with a browser user agent and referer set. `server/utils/newsCategoryLoader.ts` already fetches per-item network resources server-side (`fillMissingImages` → `fetchArticleImageUrl`, 3s timeout via `AbortController`), so there's a precedent for adding one more server-side network step for a specific source.

## Goals / Non-Goals

**Goals:**
- Push Square news cards show the real thumbnail instead of the placeholder.
- Keep the proxy narrowly scoped so it can't be used to fetch arbitrary URLs (avoid an open proxy / SSRF surface).
- Fail gracefully to the existing placeholder behavior if the proxy fetch fails.

**Non-Goals:**
- Building a general-purpose image proxy for all sources - this only covers Push Square's known CDN host.
- Persistent/disk image caching - relying on HTTP cache headers is sufficient for now.
- Changing how any other source's images are resolved.

## Decisions

- **New Nuxt server route**: add `server/api/image-proxy.get.ts` accepting a `url` query parameter. On request, it fetches `url` server-side and streams the response back with the original `Content-Type` and a long `Cache-Control` (images are immutable once published).
  - *Alternative considered*: proxy at request time inside `[category].get.ts` and inline the image bytes as a data URI in the JSON payload. Rejected - bloats the API response and defeats browser image caching.
- **Host allow-list, not arbitrary URLs**: the route SHALL reject any `url` whose host is not `images.pushsquare.com` (checked before fetching), returning an error status instead of proxying. This prevents the endpoint from becoming a generic SSRF-capable proxy.
  - *Alternative considered*: accept any URL and rely on the caller (our own frontend) to only ever pass Push Square URLs. Rejected - the route is public, so it must enforce the restriction itself regardless of what the frontend sends.
- **Where the rewrite happens**: `newsCategoryLoader.ts` rewrites a Push Square item's `imageUrl` from the raw CDN URL to `/api/image-proxy?url=<encoded original>` right after parsing, source-name-gated (same place `fillMissingImages` already runs), so `NewsCard.vue` and the rest of the pipeline stay unaware that Push Square is special-cased.
- **Timeout and failure handling**: reuse the existing 3s `AbortController` pattern from `fetchArticleImageUrl`/`fetchNewsFeedXml` for consistency. On fetch failure or non-2xx/non-image response, the route returns a 502-style error; the browser's `<img>` then fires its existing `error` handler and `NewsCard.vue` falls back to the placeholder - no new client-side logic needed.

## Risks / Trade-offs

- [Server becomes a bottleneck/bandwidth pass-through for every Push Square image view] → Mitigated by a long `Cache-Control` header so browsers and any intermediate CDN cache the response after the first fetch; volume is bounded by Push Square's own feed size (a handful of items per category).
- [Cloudflare could also challenge server-side requests, not just browser ones] → If this happens, the proxy fetch fails and the existing placeholder fallback kicks in - no regression versus today, and it can be revisited if it occurs in practice.
- [Allow-list needs to be kept in sync if Push Square changes CDN hosts] → Scoped narrowly on purpose; a host change would surface as images silently falling back to the placeholder again, same as the original bug, making it easy to notice and fix.
