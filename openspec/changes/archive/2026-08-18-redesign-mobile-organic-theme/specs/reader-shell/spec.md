## Purpose

Defines the phone-first visual structure, layout bounds, warm "Organic" design tokens, and content-formatting rules for the news reader's shell (header, category rail, feed cards, footer) shared by light and dark themes.

## ADDED Requirements

### Requirement: Phone-first bounded layout
The reader SHALL render as a single centered column that never exceeds 440px of content width, remain usable down to a 390px viewport, and scale up gracefully on wider viewports without changing the 440px content cap.

#### Scenario: Narrow viewport
- **WHEN** the viewport is 390px wide
- **THEN** the first feed card is fully visible without scrolling, and no horizontal scrollbar appears on the page body

#### Scenario: Wide viewport
- **WHEN** the viewport is wider than 440px (e.g. desktop)
- **THEN** the reader content column is centered and capped at 440px width, with the surrounding area showing the page ground color

### Requirement: Warm "Organic" design tokens
The reader SHALL define its color, typography, radius, and shadow values as a single set of design tokens (e.g. CSS custom properties) applied consistently across all components, with no color, font, spacing, or radius literal duplicated outside that token set. Tokens SHALL include distinct light and dark value sets: light uses ground `#f5ead8`, surface `#ebddc5`, ink `#201e1d`, accent `#c67139`, deep accent text `#8c491a`, sage second accent `#7a8a5e`, muted text `#645c50`/`#82796a`, and divider `rgba(32,30,29,.16)`; dark swaps to background `#1b1917`, surface `#262320`, text `#f3e9da`, and accent text `#f0a271`. The page title SHALL use the Caprasimo display font; all other text SHALL use Figtree. No gradients or emoji SHALL be used anywhere in the shell.

#### Scenario: Token reuse
- **WHEN** any shell component needs a themed color, font, radius, or shadow value
- **THEN** it references the shared token rather than a hard-coded literal

#### Scenario: Muted text contrast
- **WHEN** muted text (status line, meta row, footer copy) is rendered in either theme
- **THEN** its contrast ratio against the surface/ground it sits on is at least 4.5:1

### Requirement: Sticky header
The reader SHALL render a sticky header pinned to the top of the viewport containing: the page title "Latest News" in the display font at 23px, a muted status line beneath it, a 44×44px circular outline theme-toggle button, and a 44×44px circular outline "mark current category read" button. The header background SHALL match the page ground color. The header SHALL be closed by a 1px divider line.

#### Scenario: Status line with unread items
- **WHEN** the current category has one or more unread items
- **THEN** the status line reads "`<count>` unread · updated `<relative time of newest item>`"

#### Scenario: Status line fully read
- **WHEN** the current category has zero unread items
- **THEN** the status line reads "All caught up"

### Requirement: Category pill rail
The reader SHALL render one horizontally scrolling, non-wrapping row of category pills directly beneath the header title row, with 8px gaps between pills and an 18px inset matching the header padding, and no visible scrollbar. Each pill SHALL be at least 40px tall, use 15px horizontal padding, and show a 14.5px/600-weight label. The first pill SHALL be labeled "All news" and SHALL be selected by default. The active pill SHALL use a solid accent fill with cream text; inactive pills SHALL use a surface fill with a 1.5px divider-colored border. A pill SHALL show an unread-count badge when its category has unread items: accent-tinted on inactive pills, translucent-white on the active pill.

#### Scenario: Selecting a category
- **WHEN** the reader taps a category pill
- **THEN** the feed filters to that category (or all categories, for "All news") and the page scrolls to the top

### Requirement: Feed card visual structure
Each feed item SHALL render as a card with 16px corner radius, 13px internal padding, a flex row layout with a 13px gap between a square thumbnail and a text column, spaced 10px apart from neighboring cards within 14px of page padding. The thumbnail SHALL use a 14px corner radius and a `saturate(.8)` filter; when the item has no image, the thumbnail SHALL instead show a soft tint background with the source's first letter centered in the display font at 40% opacity. Unread cards SHALL show a soft 1px shadow; read cards SHALL show no shadow. The card title SHALL render at 16.5px/1.28 line-height, weight 800 while unread and weight 600 once read, without truncation. The summary SHALL render at 14px/1.45 line-height, clamped per the active density setting. The meta row SHALL show "`<relative time>` · `<source>`", with the time rendered in the deep accent color when the item is under 30 minutes old.

#### Scenario: Unread, recent item
- **WHEN** an item is unread and published less than 30 minutes ago
- **THEN** its card shows an 8px accent dot before the title and its meta-row time is rendered in the deep accent color

#### Scenario: No image available
- **WHEN** an item has no image URL
- **THEN** its thumbnail shows a tinted background with the source's first letter instead of a broken image

### Requirement: Newest-first sort order
The reader SHALL sort feed items by `published_at` descending (newest first) within the active category filter.

#### Scenario: Mixed-age feed
- **WHEN** the active category contains items published at different times
- **THEN** they are rendered with the most recently published item first

### Requirement: Relative time display
The reader SHALL render every timestamp as a relative label and SHALL NOT render absolute dates or times anywhere in the shell: "just now" for 2 minutes old or less, "`<n>` min ago" under 60 minutes, "`<n>` h ago" under 24 hours, and "`<n>` d ago" beyond that.

#### Scenario: Just-published item
- **WHEN** an item was published 90 seconds ago
- **THEN** its displayed time reads "just now"

### Requirement: Footer summary
The reader SHALL render a footer below the feed showing a sage circular check icon, the heading "That's everything", a summary line "`<n>` stories from `<m>` feeds" (or the equivalent count for the active category filter), and a pill-shaped outline button labeled "Check for new".

#### Scenario: Footer story count
- **WHEN** the feed for the active category filter has finished loading
- **THEN** the footer summary line reflects the number of stories currently shown and the number of distinct feeds/categories they were drawn from
