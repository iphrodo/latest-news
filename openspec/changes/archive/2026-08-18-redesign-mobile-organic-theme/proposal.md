## Why

The current reader (`app/app.vue`, `NewsCard.vue`, `CategoryTabs.vue`) is a generic desktop-first list with no persistent read state, no relative time, and no mobile-optimized layout. Most traffic to this reader is a quick phone check-in, so the UI needs to be phone-first, let a reader tell at a glance what's new and what they've already seen, and stay legible while skimming one-handed. A reference mockup (`Latest.dc.html`, warm "Organic" theme) defines the target visual language and interaction model; this change adopts it.

## What Changes

- **BREAKING**: Replace the current news list layout with a phone-first (390–440px, centered, capped at 440px) card feed: sticky header with title + status line + theme/mark-all-read buttons, horizontally scrolling category pill rail with unread badges, stacked feed cards with thumbnail/tint-initial, and a footer summary with a manual refresh action.
- Introduce the warm "Organic" design token set (color, type, radius, shadow) for light and dark themes, applied at the document root before first paint, with no literals scattered through components.
- Add per-device read tracking (localStorage) that dims read cards (togglable), demotes title weight, and shows a check mark.
- Add tap-to-expand-in-place on cards: expanding shows the full (unclamped) summary and an "Open on `<source>`" link that opens in a new tab without collapsing the card; tapping again collapses it.
- Add a "new since last visit" boundary: the previous-visit timestamp is persisted only on `pagehide`/`beforeunload`, floored at 90 minutes on first visit, and rendered as a single "Earlier" divider before the first story past that boundary.
- Add pull-to-refresh (drag past ~45px at scroll top) and wire the footer "Check for new" button to the same refresh action, merging newly fetched items at the top.
- Add a density setting (compact/balanced/large) controlling thumbnail size and summary clamp, keeping all interactive targets ≥44px.
- **BREAKING**: Extend the news item data contract with a stable `id`, ISO 8601 `published_at` (replacing the current RFC 2822 `publishedAt` string), and a `category` field, since the client needs a stable per-article key for read-state persistence and the "new" boundary and no longer formats dates server-side.

## Capabilities

### New Capabilities
- `reader-shell`: Phone-first layout, warm "Organic" design tokens, sticky header, category pill rail, feed card visual structure, footer, light/dark theme application.
- `reader-interactions`: Read-state persistence and dimming, tap-to-expand-in-place, new-since-last-visit boundary and divider, pull-to-refresh, density setting.

### Modified Capabilities
- (none — no existing specs cover the current reader; the pre-redesign behavior was undocumented in `openspec/specs`)

## Impact

- `app/app.vue`, `app/components/NewsCard.vue`, `app/components/CategoryTabs.vue`: rewritten to the new shell/card structure and token-driven styling.
- `app/composables/useNewsCategories.ts`: extend cached item shape (`id`, `category`, ISO `published_at`) and add read-state / last-visit / density / theme composables.
- `server/api/news.ts`, `server/api/news/[category].get.ts`, `server/utils/rss.ts`, `server/utils/newsCategoryLoader.ts`: emit `id`, `category`, and ISO-formatted `published_at` instead of the raw RSS date string.
- New shared constants/tokens module (design tokens) consumed by all components.
- `NewsCard.test.ts` and related server tests: updated for the new data shape and component behavior.
