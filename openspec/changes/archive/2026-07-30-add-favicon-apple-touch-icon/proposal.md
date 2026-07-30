## Why

The site currently ships only a generic `favicon.ico` with no high-resolution icons and no iOS home-screen metadata. When a user adds the site to their iPhone home screen, Safari falls back to a screenshot of the page instead of a proper app icon, which looks unpolished and is hard to recognize among other home-screen icons.

## What Changes

- Add a multi-size `favicon.ico` (16/32/48px) plus standalone `favicon-16x16.png` and `favicon-32x32.png`, generated from the supplied lightning-bolt artwork.
- Add a 180x180 `apple-touch-icon.png` for iOS home-screen/bookmark icons.
- Add `icon-192.png` and `icon-512.png` plus a `site.webmanifest` (theme_color/background_color `#101c28`, `display: standalone`) for Android/PWA-style home-screen support.
- Register all icons and the manifest via `app.head.link` in `nuxt.config.ts`, and add `theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, and `apple-mobile-web-app-title` meta tags.

## Capabilities

### New Capabilities
- `app-icons`: Favicon, apple-touch-icon, and web manifest so the site has a proper browser-tab icon and a correctly branded icon when added to a mobile home screen.

### Modified Capabilities
(none — no existing capability's requirements change)

## Impact

- Affected files: `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest`, `nuxt.config.ts`.
- No API, dependency, or data-model changes.
