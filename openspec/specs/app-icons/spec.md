# app-icons Specification

## Purpose

Gives the site a proper browser-tab icon and a correctly branded icon when a user adds the site to a mobile (especially iOS) home screen, instead of a generic icon or a screenshot fallback.

## Requirements

### Requirement: Browser tab favicon
The system SHALL serve a favicon that browsers can use for the tab/bookmark icon, available in multiple resolutions (16x16, 32x32, and a multi-size `.ico`).

#### Scenario: Page loaded in a desktop browser
- **WHEN** a user loads any page of the site in a desktop browser
- **THEN** the browser tab displays the site's lightning-bolt icon instead of a generic/default icon

### Requirement: iOS home screen icon
The system SHALL provide a 180x180 apple-touch-icon and iOS-specific meta tags so that adding the site to an iPhone home screen uses the branded icon with the correct title and status bar style, instead of a screenshot of the page.

#### Scenario: User adds the site to their iPhone home screen
- **WHEN** a user opens the site in iOS Safari and chooses "Add to Home Screen"
- **THEN** the created home screen icon shows the branded lightning-bolt artwork (not a page screenshot) and is labeled "OpenSpec"

#### Scenario: Site launched from the iOS home screen icon
- **WHEN** a user taps the home screen icon to launch the site
- **THEN** the site opens in standalone mode with a status bar style consistent with the site's dark theme

### Requirement: Web app manifest for Android/PWA icons
The system SHALL serve a web app manifest declaring 192x192 and 512x512 icons plus matching theme and background colors, so Android and other manifest-aware browsers can also present a branded home-screen icon.

#### Scenario: Android browser reads the manifest
- **WHEN** a manifest-aware browser requests `/site.webmanifest`
- **THEN** it receives a valid JSON manifest listing the 192x192 and 512x512 icons, a `theme_color`/`background_color` matching the icon's background, and `display: standalone`
