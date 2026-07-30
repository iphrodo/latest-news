## MODIFIED Requirements

### Requirement: News card content
Each news item on the page SHALL display a title, a short description (excerpt), the publication date and time, a link to the original source, and a news image (if the source provides one). The image SHALL be displayed to the left of the card, with the rest of the content to the right.

#### Scenario: News item contains all fields including an image
- **WHEN** a news item has a title, excerpt, publication date, source URL, and image URL
- **THEN** the system displays the image on the left of the card, with the title, excerpt, and publication date/time to its right

#### Scenario: News item without an image
- **WHEN** a news item has no image URL
- **THEN** the system displays the card without an image and without an empty placeholder in its place

#### Scenario: Clicking a news item opens the source
- **WHEN** a visitor clicks the title or card of a news item
- **THEN** the system opens the original news source in a new tab

#### Scenario: Displaying publication time
- **WHEN** a news item has a publication date with a timestamp
- **THEN** the system shows the date along with the publication time (hours and minutes) on the original site
