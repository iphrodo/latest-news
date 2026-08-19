## 1. Data model: id, category, ISO date

- [x] 1.1 Add ISO 8601 date conversion in `server/utils/rss.ts` (or `newsCategoryLoader.ts`) so parsed items carry `published_at` as `new Date(...).toISOString()` instead of the raw RSS date string
- [x] 1.2 Attach `category` (the config key, e.g. `"epl"`) to each item in `newsCategoryLoader.ts` from the category config it was loaded under
- [x] 1.3 Add `id` to each item using the article's `link` as the stable id
- [x] 1.4 Update `server/api/news.ts` and `server/api/news/[category].get.ts` response shape and any related tests (`newsCategoryLoader.test.ts`, `rss.test.ts`) for the new fields
- [x] 1.5 Update `useNewsCategories.ts`'s `NewsItem` interface to match the new server shape (`id`, `category`, `published_at`)

## 2. Design tokens

- [x] 2.1 Create a shared tokens stylesheet (e.g. `app/assets/design-tokens.css`) defining light-theme custom properties on `:root` (ground, surface, ink, accent, deep accent, sage, muted text, divider) and typography/radius/shadow tokens
- [x] 2.2 Add dark-theme overrides on `:root[data-theme="dark"]`
- [x] 2.3 Load Caprasimo (page title) and Figtree (body) fonts and wire them to token variables
- [x] 2.4 Import the tokens stylesheet globally (e.g. via `nuxt.config.ts` css array) so every component can reference `var(--color-*)` etc.

## 3. Reader shell layout

- [x] 3.1 Rebuild `app/app.vue` root layout: centered column, 440px max content width, 390px minimum usability, page padding per spec
- [x] 3.2 Build sticky header: title, status line, 44×44 theme-toggle button, 44×44 mark-all-read button, closing 1px divider
- [x] 3.3 Rewrite `CategoryTabs.vue` as the horizontally scrolling pill rail: no-wrap, no visible scrollbar, 8px gaps, active/inactive styling, unread-count badges, "All news" first and default
- [x] 3.4 Rewrite `NewsCard.vue` visual structure: thumbnail (image or tinted initial fallback), title/summary/meta layout, unread shadow vs. read no-shadow, unread accent dot for items <30min old
- [x] 3.5 Build the footer summary block (sage check icon, heading, story/feed count line, "Check for new" pill button)
- [x] 3.6 Remove now-unused legacy styles from `app.vue`, `NewsCard.vue`, `CategoryTabs.vue`

## 4. Relative time & sorting

- [x] 4.1 Add a relative-time formatting utility ("just now" / "`n` min ago" / "`n` h ago" / "`n` d ago") replacing `NewsCard.vue`'s `toLocaleString` formatting
- [x] 4.2 Sort the active feed by `published_at` descending across the merged "All news" view and per-category views

## 5. Read-state persistence

- [x] 5.1 Add `useReadState.ts` composable: `localStorage`-backed read-id set, `markRead(id)`, `markAllRead(ids)`, `isRead(id)`
- [x] 5.2 Wire card tap to `markRead`; wire header "mark all read" button to `markAllRead` scoped to the active category filter
- [x] 5.3 Add a "dim read items" boolean setting (persisted) that gates the ~62% opacity effect while shadow removal / title weight / check mark always apply once read

## 6. Expand-in-place

- [x] 6.1 Add per-card expanded-id state in `app.vue` (or a small composable) toggled on card tap
- [x] 6.2 Render full (unclamped) summary and "Open on `<source>`" pill when a card is expanded; ensure tapping the open link stops propagation so it doesn't collapse the card
- [x] 6.3 Ensure the open link uses `target="_blank" rel="noopener"`

## 7. New-since-last-visit boundary

- [x] 7.1 Add `useLastVisit.ts` composable: reads stored `news.lastVisit` timestamp on mount (floored at 90 minutes for first visit), computes a session-fixed boundary, and writes the new timestamp only on `pagehide`/`beforeunload` (plus `visibilitychange` → `hidden` fallback per design.md)
- [x] 7.2 Render the single centered "Earlier" divider immediately before the first item older than the boundary in sorted order

## 8. Pull-to-refresh & manual refresh

- [x] 8.1 Add touch handlers (`touchstart`/`touchmove`/`touchend`) on the feed scroll container to track pull distance when scrolled to top
- [x] 8.2 Add the spinner strip UI cycling "Pull to refresh" → "Release to refresh" → "Fetching new stories…"
- [x] 8.3 Implement the shared `refresh()` action (re-fetch active category/all categories, merge new items at top marked fresh) and wire both the pull gesture release and the footer "Check for new" button to it

## 9. Density setting

- [x] 9.1 Add `useDensity.ts` composable: persisted `compact | balanced | large` value (default `balanced`)
- [x] 9.2 Apply density to thumbnail size (58/76/96px) and summary line-clamp (2/3/3) in `NewsCard.vue`
- [x] 9.3 Verify all interactive targets remain ≥44×44px at every density level

## 10. Theme

- [x] 10.1 Add `useTheme.ts` composable: resolves `prefers-color-scheme` default, reads/writes persisted override, exposes `toggleTheme`
- [x] 10.2 Apply `data-theme` on the document root before first paint (e.g. inline script in `app.vue`'s `<head>` or a Nuxt plugin) to avoid a theme flash
- [x] 10.3 Wire the header theme-toggle button to `toggleTheme`

## 11. Verification

- [x] 11.1 Update/replace `NewsCard.test.ts` for the new props (`id`, `category`, ISO `published_at`) and new rendering behavior (relative time, read state, expand-in-place)
- [x] 11.2 Add tests for `useReadState`, `useLastVisit`, `useTheme`, `useDensity` persistence and boundary logic
- [x] 11.3 Manually verify at a 390px viewport: first card visible without scrolling, no horizontal overflow
- [x] 11.4 Manually verify muted text contrast ≥4.5:1 in both light and dark themes
- [x] 11.5 Manually verify read state, theme choice, and the last-visit boundary all survive a full page reload
- [x] 11.6 Run `npm test` and fix any failures introduced by the data-shape and component changes
