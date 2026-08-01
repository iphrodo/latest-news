## Context

Today each category in `server/utils/newsCategories.ts` has one `feedUrl` and an optional `fallbackFeedUrl` used only when the primary feed errors or returns zero keyword-matched items (`server/utils/newsCategoryLoader.ts`). Dedup (`server/utils/newsFilter.ts:dedupeByLink`) only removes exact-URL duplicates within a single feed's items. The per-category cap is a hardcoded `NEWS_LIMIT = 10`. Articles (`RawNewsItem` in `server/utils/rss.ts`) carry no source attribution. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Fetch several RSS sources per category concurrently and merge their items.
- Remove near-duplicate stories across sources (not just exact URL matches).
- Raise the per-category display cap now that more raw items are available.
- Attribute each displayed item to its source outlet.
- Degrade gracefully when one of several sources for a category fails.

**Non-Goals:**
- No server-side caching or scheduled/cron refresh of feeds (out of scope; feeds remain fetched live per request, as today).
- No per-source configurability of the item cap or per-source weighting/ranking beyond publish-date sort.
- No fuzzy dedup across categories (only within a single category's merged pool).
- No change to the client-side in-memory per-tab caching behavior (`useNewsCategories.ts`).

## Decisions

**Exactly 5 sources per category.**
Two sources per category (the original rollout) still left several tabs feeling thin. Fixed at 5 rather than "several"/unbounded so every category gets the same volume guarantee and the config stays easy to audit; each added source is a config-only entry (`{ url, source }`) and must pass the same reachability/parseability check as the original set (see task 1.3).

**Category config: array of `{ url, source }` instead of `feedUrl` + `fallbackFeedUrl`.**
Replaces the primary/fallback distinction with a flat list, since with multiple real sources per category the "fallback only on empty" pattern is redundant — every configured source is fetched every time. `it-jobs`'s existing fallback feed (TechCrunch layoffs) becomes just another entry in its list. The `source` label is supplied by config rather than parsed from feed XML (e.g. channel `<title>`), because config-supplied names are reliable and human-curated, while parsing risks inconsistent or missing labels across feeds.

**Parallel fetch via `Promise.allSettled`, not `Promise.all`.**
A single unreachable source must not fail the whole category (see proposal - "tolerates individual source failures"). Rejected fetches are dropped silently from the merge; if all sources for a category reject, the category surfaces the existing error path (as today when the single source fails).

**Cross-source dedup: normalized title similarity, applied after exact-link dedup.**
Exact-link dedup (`dedupeByLink`) stays first since it's cheap and precise. A new `dedupeBySimilarTitle` step normalizes titles (lowercase, strip punctuation/extra whitespace) and compares merged items pairwise using token-set overlap (Jaccard-style ratio on word sets), collapsing pairs above a similarity threshold (~0.8, tunable during implementation against real feed samples) into one item. When two items are judged duplicates, the one that already has an `imageUrl` is kept (falling back to the more recent `publishedAt` if both or neither have an image) — this avoids losing a good image just because a title-similar duplicate arrived from another source first. Chosen over exact/normalized-string equality alone because outlets often vary titles slightly ("X signs Y" vs "Y completes move to X"); chosen over a full text-similarity/embedding approach as unnecessary complexity for a same-day RSS window.

**Item cap: raise `NEWS_LIMIT` to a fixed higher constant (e.g. 20), not made per-category configurable.**
Simplest change consistent with the goal ("show more news"); per-category tuning isn't requested and adds config surface without a clear need.

**Sequencing within `loadCategoryNews`:** fetch all sources in parallel → tag items with `source` → merge into one array → `dedupeByLink` → `dedupeBySimilarTitle` → keyword filter (unchanged) → sort by `publishedAt` desc → slice to `NEWS_LIMIT` → `fillMissingImages` (unchanged, applied last as today so it only runs image lookups for the final trimmed set).

## Risks / Trade-offs

- [Fuzzy title matching produces a false positive, hiding two genuinely different stories that happen to share vocabulary] → Keep the similarity threshold conservative (~0.8) and validate against real feed output for categories with topically narrow keyword sets (e.g. `football-transfers`) during implementation before tuning further.
- [Fuzzy title matching misses a true duplicate because outlets phrase headlines very differently] → Acceptable false negative; exact-link dedup and the cap increase still net more unique stories than today, and duplicates that slip through are a UX nit, not a correctness bug.
- [More sources fetched per category increases total request time and outbound calls per page load] → Sources are fetched in parallel with the existing 5s per-request timeout (`rss.ts:FETCH_TIMEOUT_MS`) unchanged, so worst-case latency per category stays bounded by the slowest single source, not the sum.
- [Newly added candidate RSS feed URLs may be stale, rate-limited, or restructured] → Verify each new feed URL resolves and parses before wiring it into `newsCategories.ts` (manual check during implementation), and rely on the `Promise.allSettled` graceful-degradation behavior as a safety net if one goes bad later.

## Open Questions

- Exact similarity threshold and final `NEWS_LIMIT` value should be tuned against real feed samples during implementation rather than fixed in advance; this doesn't change the spec-level behavior (still "configured maximum," still "near-identical titles"), only the constant.
