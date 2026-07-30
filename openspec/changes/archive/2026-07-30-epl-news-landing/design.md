## Context

The project starts from scratch (empty repository). A minimal stack without unnecessary complexity is needed: a single page that shows 10 news items. See proposal.md - Why for motivation.

Key technical constraint: the browser cannot directly parse RSS/XML from CORS-restricted sports news domains, so a small server layer is needed between the frontend and the news source.

## Goals / Non-Goals

**Goals:**
- A minimal, easy-to-maintain stack for a single page.
- A news source that doesn't require a paid API key, so the landing page can be launched right away.
- Clear separation: the server side fetches/parses news, the client side only displays it.

**Non-Goals:**
- A multi-page site, search, filters, or news personalization.
- Caching news in a database or a full-fledged CMS.
- Support for multiple leagues or languages (EPL only, UI localization).

## Decisions

### News source: BBC Sport Football RSS feed
We use the public BBC Sport (Football) RSS feed as the source of EPL news, filtering/using the first 10 entries.
- **Why**: requires no API key, registration, or payment; RSS is stable and designed for exactly this use case.
- **Alternatives**:
  - NewsAPI.org / GNews — require an API key and have free-tier limits; unnecessary complexity for a simple landing page.
  - The official Premier League API — there is no public free API for news.

### Architecture: Nuxt (latest stable, Nuxt 4) with a built-in Nitro server
A single Nuxt project instead of separate frontend and backend:
1. The Nitro server route `server/api/news.ts` fetches the BBC Sport Football RSS feed, parses the XML into JSON (title, excerpt, date, link), and returns the first 10 entries sorted by date (newest first).
2. A Vue page (`app.vue`/landing page) fetches `/api/news` (via `useFetch`/`$fetch`) and renders the news cards.

- **Why**: the Nitro server built into Nuxt removes the need for a separate Express server — RSS parsing and the UI live in a single project and deploy together in one build. This is faster to develop (ready-made tooling, HMR, auto-imports, Vue's component model instead of manual DOM rendering) and cheaper to host (a single deploy on a free Vercel/Netlify/Cloudflare Pages tier instead of separate hosting for a Node/Express backend). The CORS problem is solved the same way as before: the browser only talks to `/api/news` on its own domain, and the RSS feed is fetched server-side.
- **Alternatives**:
  - Vanilla HTML/JS + a separate Express server (initial option) — two separate processes/deploys, more manual code for rendering and loading/error states; rejected as slower to develop and more expensive to host (requires separate always-on Node hosting for Express, not just static+edge functions).
  - Fetching RSS directly from the browser through a public CORS proxy — less reliable, dependent on a third-party proxy service.
  - Next.js — the same approach (SSR framework with a backend layer), but a React ecosystem; Nuxt was chosen per a direct requirement.

### Error and loading handling
The frontend shows a loading state right after mount and an explicit error state with a "Try again" button if `/api/news` returns an error or times out (>5s).
- **Why**: matches the requirements in spec.md (loading state, news source error handling).

## Risks / Trade-offs

- [Risk] The BBC RSS feed may change structure or become unavailable → Mitigation: the server-side parser is isolated in a single module, easy to swap the source without changing the frontend or specs.
- [Risk] The BBC Football RSS feed contains news not only about the EPL (other leagues/national teams) → Mitigation: basic keyword filtering (e.g. "Premier League", EPL club names) before selecting the first 10 entries; if fewer than 10 remain after filtering, show however many are available (see spec.md, scenario "News source returns fewer than 10 news items").
- [Trade-off] The lack of caching means a new RSS request on every page load → acceptable for a simple low-traffic landing page; caching (e.g. 5 min) can be added later without changing the specs.

## Open Questions

- Whether separate hosting is needed for the server endpoint (e.g. a serverless function) or a local Node server is enough for a demo — can be decided at deploy time, does not affect specs or tasks.
