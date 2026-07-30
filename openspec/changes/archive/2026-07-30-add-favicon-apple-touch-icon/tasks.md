## 1. Generate icon assets

- [x] 1.1 Copy the supplied 16x16, 32x32, and 180x180 lightning-bolt PNGs into `public/` as `favicon-16x16.png`, `favicon-32x32.png`, and `apple-touch-icon.png`.
- [x] 1.2 Generate a multi-size `public/favicon.ico` (16/32/48px) from the source artwork.
- [x] 1.3 Generate `public/icon-192.png` and `public/icon-512.png` from the 180x180 source for manifest use.

## 2. Web app manifest

- [x] 2.1 Create `public/site.webmanifest` with `name`/`short_name`, the 16/32/192/512 icon entries, `theme_color`/`background_color` set to `#101c28`, `display: standalone`, and `start_url: /`.

## 3. Wire up head tags

- [x] 3.1 In `nuxt.config.ts`, add `app.head.link` entries for `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`, and `site.webmanifest`.
- [x] 3.2 Add `app.head.meta` entries for `theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, and `apple-mobile-web-app-title`.

## 4. Verify

- [x] 4.1 Run the dev server and confirm the rendered `<head>` includes all icon links and meta tags.
- [x] 4.2 Confirm `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, and `site.webmanifest` are served with HTTP 200 from `public/`.
