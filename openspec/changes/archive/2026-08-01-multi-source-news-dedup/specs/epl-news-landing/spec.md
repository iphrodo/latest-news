## MODIFIED Requirements

### Requirement: Display 10 latest news items
The system SHALL fetch European football news from multiple news sources and merge them into a single list, deduplicated across sources, sorted from newest to oldest by publication date. European football news includes news about the top domestic leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) and major UEFA club competitions (Champions League, Europa League, Conference League). The system SHALL display at least as many items as the previous single-source behavior provided (up to a configured maximum), and never fewer than the number of unique available items.

#### Scenario: Combined sources return enough news items
- **WHEN** a visitor opens the landing page and the merged, deduplicated set of European football news items from all sources contains at least the configured maximum
- **THEN** the system shows exactly the configured maximum number of news items, sorted from newest to oldest

#### Scenario: Combined sources return fewer items than the configured maximum
- **WHEN** the merged, deduplicated set of available news items from all sources is smaller than the configured maximum
- **THEN** the system shows all available unique news items without error, without empty placeholders

#### Scenario: One source is unavailable
- **WHEN** one of the configured European football news sources fails or times out while the others respond successfully
- **THEN** the system shows the merged news items from the remaining available sources instead of failing the whole page

#### Scenario: Two sources report the same event
- **WHEN** two different European football news sources publish articles about the same event with different URLs and near-identical titles
- **THEN** the system shows only one of those articles in the merged list, not both

### Requirement: News card content
Each news item on the page SHALL display a title, a short description (excerpt), the publication date and time, the name of the source it came from, a link to the original source, and a news image. The image SHALL be displayed to the left of the card, with the rest of the content to the right. If the news source does not provide an image URL, the card SHALL show a placeholder in place of the image instead of hiding the image block. The excerpt SHALL be visually truncated to 4 lines of text, regardless of the length of the description provided by the news source.

#### Scenario: News item contains all fields including an image
- **WHEN** a news item has a title, excerpt, publication date, source name, source URL, and image URL
- **THEN** the system displays the image on the left of the card, with the title, excerpt, source name, and publication date/time to its right

#### Scenario: News item without an image
- **WHEN** a news item has no image URL
- **THEN** the system displays the card with a placeholder in place of the image on the left, rather than hiding the image block

#### Scenario: Clicking a news item opens the source
- **WHEN** a visitor clicks the title or card of a news item
- **THEN** the system opens the original news source in a new tab

#### Scenario: Displaying publication time
- **WHEN** a news item has a publication date with a timestamp
- **THEN** the system shows the date along with the publication time (hours and minutes) on the original site

#### Scenario: News description longer than 4 lines
- **WHEN** the news description provided by the source is longer than 4 lines of text in the card
- **THEN** the system visually truncates the excerpt to 4 lines, without stretching the card to fit the entire description text
