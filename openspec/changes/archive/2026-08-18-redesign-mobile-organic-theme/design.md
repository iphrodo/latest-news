## Context

The app is a Nuxt 4 / Vue 3 SPA. `app/app.vue` composes `CategoryTabs.vue` and `NewsCard.vue`, backed by `useNewsCategories()` (in-memory cache keyed by category slug, `$fetch('/api/news/[category]')`) and a separate always-loaded `/api/news` for the default "epl" category. Server-side, `newsCategoryLoader.ts` merges per-source RSS feeds (`rss.ts`, `newsCategories.ts`) into a flat item list: `{ title, excerpt, publishedAt, link, imageUrl, source }`. `publishedAt` is the raw RFC 2822 string from the feed; there is no `id` or `category` field on the item itself. `NewsCard.vue` formats dates client-side with `toLocaleString`. There is no read-state, theme, or settings persistence anywhere today. See proposal.md - Why / What Changes for motivation.

## Goals / Non-Goals

**Goals:**
- Ship the full reader-shell and reader-interactions specs behind the existing Nuxt/Vue stack, with no new runtime framework dependency.
- Centralize all design tokens in one CSS module consumed by every component, in both themes.
- Keep the data-shape change (`id`, `category`, ISO `published_at`) backward-compatible at the RSS-parsing boundary — only the item shape leaving the server changes.

**Non-Goals:**
- Search, saved-for-later, day grouping, dedupe, swipe gestures, per-source muting (explicitly out of scope per proposal).
- Server-side persistence of read state, theme, or settings — everything stays device-local (`localStorage`).
- Push/websocket live updates — refresh stays pull/tap-triggered only.

## Decisions

- **Stable id**: use the article's feed `link` as the `id`. Links are already used as the Vue `:key` and are unique per source; no new ID scheme or database is introduced. Trade-off: if a source ever changes an article's canonical URL, its read state resets — acceptable for a personal reader.
- **ISO `published_at` computed server-side**: `newsCategoryLoader.ts` (or `rss.ts` parsing step) converts the RSS date to `new Date(...).toISOString()` once, server-side, so the client never parses RFC 2822 and all relative-time/sort logic operates on a single reliable format. Alternative considered: parse client-side per render — rejected, it duplicates parsing logic across every consumer (card render, sort, boundary check) and risks locale/timezone drift.
- **`category` on the item**: attached by `newsCategoryLoader.ts` from the category config key it was loaded under, so `useNewsCategories` no longer needs to infer category from which cache bucket an item lives in — needed once "All news" merges every category into one sorted, one-`id`-space feed.
- **Design tokens as CSS custom properties**: a single `design-tokens.css` (or equivalent `<style>` block in `app.vue`) defines light-theme values on `:root` and dark-theme overrides on `:root[data-theme="dark"]`, mirroring the reference mockup's approach. Components reference `var(--color-*)` etc. exclusively — no new CSS-in-JS or Tailwind dependency, since none exists in this project today.
- **State composables**: new composables under `app/composables/` — `useReadState.ts` (read ids + dimming setting), `useTheme.ts` (theme + toggle), `useLastVisit.ts` (boundary timestamp, `pagehide`/`beforeunload` write), `useDensity.ts` (density enum) — each thin wrappers around `localStorage` with an in-memory `ref`, consistent with the existing `useNewsCategories` composable style (module-level refs, no external state library).
- **Merged "All news" feed**: `useNewsCategories` gains an `allItems` computed that flattens every loaded category's cached items, sorted by `published_at` descending; categories not yet fetched are lazily loaded when "All news" is first selected (or eagerly on mount — implementation detail for tasks.md) so the default view isn't missing sources.
- **Pull-to-refresh via touch handlers**: implemented as plain `touchstart`/`touchmove`/`touchend` listeners on the scroll container (matching the reference mockup's approach) rather than a third-party gesture library, keeping the dependency set unchanged.

## Risks / Trade-offs

- [Using `link` as id] → if a feed's URL structure changes upstream, previously-read articles could reappear as unread. Mitigated by scope: low-stakes personal reader, no migration needed.
- [Client-only persistence] → clearing browser storage or switching devices resets read state, theme, and density. Accepted per proposal (device-scoped by design).
- [Merged "All news" feed requires all categories loaded] → first visit to "All news" may show a partial list while categories are still fetching. Mitigate in tasks.md by fetching all categories in parallel on mount and showing per-category pending state only for badges/counts, not by blocking the whole feed.
- [`pagehide`/`beforeunload` reliability on mobile Safari] → these events can be unreliable when a tab is backgrounded rather than closed. Mitigation: also write the last-visit timestamp on `visibilitychange` → `hidden` as a fallback, without changing the spec's observable boundary behavior (still "not shifted mid-session").
