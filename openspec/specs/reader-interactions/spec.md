# reader-interactions Specification

## Purpose

Defines the stateful, per-device reader behaviors — read tracking, expand-in-place, the new-since-last-visit boundary, pull-to-refresh, density, and theme persistence — that sit on top of the reader-shell's visual structure.

## Requirements

### Requirement: Per-device read tracking
The reader SHALL persist a read/unread flag per article id in `localStorage`, keyed by the article's stable id, so read state survives a page reload and is scoped to the device. Tapping an unread card SHALL mark it read. The header's "mark current category read" button SHALL mark every currently-filtered item read.

#### Scenario: Read state survives reload
- **WHEN** an article is marked read and the page is reloaded
- **THEN** the article still renders as read

#### Scenario: Mark all read for active category
- **WHEN** the reader taps the "mark current category read" button while a category is selected
- **THEN** every item in that category (or all items, if "All news" is active) becomes read and the category's unread badge clears

### Requirement: Read-state dimming is a togglable setting
When a card is marked read, the reader SHALL reduce its opacity to approximately 62%, remove its shadow, drop its title weight to 600, and show a sage check mark in its meta row — unless the reader-level "dim read items" setting has been turned off, in which case read cards keep full opacity but still lose their shadow, drop title weight, and show the check mark.

#### Scenario: Dimming enabled (default)
- **WHEN** an article is read and the dimming setting is on
- **THEN** its card renders at ~62% opacity

#### Scenario: Dimming disabled
- **WHEN** the reader has turned the dimming setting off
- **THEN** read cards render at full opacity while still showing the read title weight and check mark

### Requirement: Tap-to-expand-in-place
Tapping a card SHALL mark it read (per the read-tracking requirement) and toggle an expanded state for that card: expanded, the card shows its full summary with no line clamp and a solid-accent "Open on `<source>`" pill button that opens the article's URL in a new tab without collapsing or navigating the card. Tapping an expanded card again SHALL collapse it back to the clamped summary view. Tapping the "Open on `<source>`" button itself SHALL NOT toggle the card's expanded state.

#### Scenario: Expand a card
- **WHEN** the reader taps a collapsed card
- **THEN** the card shows its uncapped summary and an "Open on `<source>`" button, and is marked read

#### Scenario: Collapse an expanded card
- **WHEN** the reader taps an already-expanded card (not the open button)
- **THEN** the card returns to its clamped summary view

#### Scenario: Opening the source does not collapse
- **WHEN** the reader taps "Open on `<source>`" on an expanded card
- **THEN** the article opens in a new tab and the card remains expanded

### Requirement: New-since-last-visit boundary
The reader SHALL record the current visit's start time and SHALL persist it as the "last visit" timestamp only on `pagehide` or `beforeunload`, so the previous-visit boundary used during the current session does not shift while reading. On a device's first visit (no stored timestamp), the boundary SHALL be floored at 90 minutes before now. The reader SHALL render a single centered "Earlier" divider, with a thin rule on either side, immediately before the first item in sort order whose `published_at` falls before the last-visit boundary — and SHALL render it at most once.

#### Scenario: First-ever visit
- **WHEN** no last-visit timestamp is stored for the device
- **THEN** the boundary used for this session is 90 minutes before the current time

#### Scenario: Boundary stable during a session
- **WHEN** the reader is actively reading and the session's last-visit boundary was computed at page load
- **THEN** the boundary does not change until the page is unloaded, even as time passes during the session

#### Scenario: Single divider placement
- **WHEN** the feed contains both items published before and after the boundary
- **THEN** exactly one "Earlier" divider renders, positioned immediately before the first (in sort order) item older than the boundary

### Requirement: Pull-to-refresh and manual refresh
When the reader is scrolled to the top, dragging down past approximately 45px SHALL reveal a spinner strip that progresses through "Pull to refresh" → "Release to refresh" → "Fetching new stories…", and releasing past the threshold SHALL trigger a refresh that fetches new items and merges any new ones at the top of the feed, marked as fresh. The footer's "Check for new" button SHALL trigger the identical refresh action.

#### Scenario: Pull past threshold
- **WHEN** the reader drags down more than 45px from the top of the feed and releases
- **THEN** the reader fetches new items, shows "Fetching new stories…" while in flight, and merges any new items at the top of the list

#### Scenario: Pull below threshold
- **WHEN** the reader drags down less than 45px and releases
- **THEN** no refresh is triggered and the pull indicator resets

#### Scenario: Footer refresh button
- **WHEN** the reader taps "Check for new" in the footer
- **THEN** the same refresh action runs as pull-to-refresh

### Requirement: Density setting
The reader SHALL offer a density setting with three values — compact, balanced (default), large — controlling thumbnail size (58px / 76px / 96px) and summary clamp (2 / 3 / 3 lines) respectively. Regardless of density, every interactive element (buttons, pills, cards as tap targets) SHALL maintain a minimum 44×44px hit target.

#### Scenario: Switching density
- **WHEN** the reader changes the density setting
- **THEN** thumbnail size and summary line-clamp update across the feed to match the new density's values

#### Scenario: Minimum tap targets preserved
- **WHEN** density is set to compact
- **THEN** all buttons, pills, and card tap targets still measure at least 44×44px

### Requirement: Theme selection and persistence
The reader SHALL support light and dark themes, defaulting to the device's `prefers-color-scheme` when no theme has been chosen, and SHALL apply the resolved theme at the document root before the reader's content paints (no flash of the wrong theme). Tapping the header's theme-toggle button SHALL switch themes and persist the choice in `localStorage` so it survives a reload.

#### Scenario: First visit follows system theme
- **WHEN** the reader is opened for the first time and the device prefers dark mode
- **THEN** the reader renders in dark theme without a light-theme flash

#### Scenario: Manual theme choice persists
- **WHEN** the reader taps the theme toggle and reloads the page
- **THEN** the reader opens in the manually chosen theme rather than the system default
