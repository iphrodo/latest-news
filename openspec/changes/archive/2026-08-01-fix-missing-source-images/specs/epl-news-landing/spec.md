## MODIFIED Requirements

### Requirement: News card content
Each news item on the page SHALL display a title, a short description (excerpt), the publication date and time, the name of the source it came from, a link to the original source, and a news image. The image SHALL be displayed to the left of the card, with the rest of the content to the right. If the news source does not provide an image URL, or the browser fails to load the provided image URL, the card SHALL show a placeholder in place of the image instead of hiding the image block. The excerpt SHALL be visually truncated to 4 lines of text, regardless of the length of the description provided by the news source.

#### Scenario: News item contains all fields including an image
- **WHEN** a news item has a title, excerpt, publication date, source name, source URL, and image URL
- **THEN** the system displays the image on the left of the card, with the title, excerpt, source name, and publication date/time to its right

#### Scenario: News item without an image
- **WHEN** a news item has no image URL
- **THEN** the system displays the card with a placeholder in place of the image on the left, rather than hiding the image block

#### Scenario: News item image fails to load in the browser
- **WHEN** a news item has an image URL, but the browser fails to load that image (e.g. the URL returns an error or is blocked by the image host)
- **THEN** the system displays the card with the same placeholder used for items with no image URL, rather than showing a broken image

#### Scenario: Clicking a news item opens the source
- **WHEN** a visitor clicks the title or card of a news item
- **THEN** the system opens the original news source in a new tab

#### Scenario: Displaying publication time
- **WHEN** a news item has a publication date with a timestamp
- **THEN** the system shows the date along with the publication time (hours and minutes) on the original site

#### Scenario: News description longer than 4 lines
- **WHEN** the news description provided by the source is longer than 4 lines of text in the card
- **THEN** the system visually truncates the excerpt to 4 lines, without stretching the card to fit the entire description text
