## Purpose

Makes Push Square's real thumbnail images visible on its news cards by routing image requests through the app's own server, since the source CDN blocks direct hotlinked image requests from browsers.

## ADDED Requirements

### Requirement: Push Square image proxying
The system SHALL serve Push Square news item images through a route on the app's own server rather than having the browser request them directly from the source's image host, because that host rejects direct hotlinked image requests from browsers.

#### Scenario: Push Square image is available
- **WHEN** a Push Square news item has an image URL from the source's image host, and a visitor's browser requests it through the app's image route
- **THEN** the system fetches the image from the source's image host on the server side and returns it to the browser with the correct image content type, so the news card shows the real thumbnail

#### Scenario: Push Square image proxy fetch fails
- **WHEN** the server-side fetch of a Push Square news item's image fails or times out
- **THEN** the browser is unable to load the image, and the news card falls back to the same placeholder used for any other news item whose image fails to load
