## 1. Project setup

- [x] 1.1 Initialize the project with the latest stable Nuxt (`npx nuxi@latest init`), basic structure (`pages/` or `app.vue`, `server/api/`)
- [x] 1.2 Install a dependency for RSS/XML parsing (e.g. `fast-xml-parser` or similar)
- [x] 1.3 Set up `git init` and a basic `.gitignore` (node_modules, .nuxt, .output, etc.)

## 2. Nitro news endpoint (`server/api/news.ts`)

- [x] 2.1 Implement a module for fetching the BBC Sport Football RSS feed
- [x] 2.2 Implement XML parsing into structured news objects (title, excerpt, date, link)
- [x] 2.3 Add filtering of news by EPL keywords (league name, clubs)
- [x] 2.4 Implement `server/api/news.ts`, which returns up to 10 of the newest filtered news items as JSON
- [x] 2.5 Add endpoint error handling (source unavailable, timeout) with the correct HTTP status (`createError`)

## 3. Client-side landing page (Vue)

- [x] 3.1 Create the landing page (heading, container for the news list)
- [x] 3.2 Implement a request to `/api/news` via `useFetch`/`$fetch` on page load
- [x] 3.3 Implement the news card component (title, excerpt, date, link that opens in a new tab)
- [x] 3.4 Implement the loading state (indicator until the response is received)
- [x] 3.5 Implement the error state with a "Try again" button
- [x] 3.6 Add responsive styles (correct single-column display on screens <480px)

## 4. Verification

- [x] 4.1 Manually verify the scenario with 10+ news items from the source
- [x] 4.2 Manually verify the scenario with an unavailable news source (simulated error)
- [x] 4.3 Manually verify responsiveness at mobile screen size
- [x] 4.4 Check the implementation against the scenarios in `specs/epl-news-landing/spec.md`
