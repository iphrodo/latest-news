## MODIFIED Requirements

### Requirement: Category tabs panel
The system SHALL show a tab panel with the following news categories: Artificial Intelligence, Technology, Finance, Gadgets, Digital Currencies, Playstation, Apple, IT Jobs, as well as a tab with the European football news feed (covering the top domestic leagues and major UEFA club competitions).

#### Scenario: Displaying tabs
- **WHEN** a visitor opens the page
- **THEN** the system shows a panel with all category tabs, and one of them is marked as active

### Requirement: Category feed content
Each category SHALL show up to 10 of the newest news items, sorted from newest to oldest, in the same card format as the European football feed (title, excerpt, image on the left, publication date and time, link to source). The excerpt SHALL be visually truncated to 4 lines of text, regardless of the length of the description provided by that category's news source.

#### Scenario: Category returns 10 or more news items
- **WHEN** the news source returns 10 or more news items matching the category's topic
- **THEN** the system shows exactly 10 of the newest news items for that category

#### Scenario: Category returns fewer than 10 news items
- **WHEN** the news source returns fewer than 10 news items matching the category's topic
- **THEN** the system shows all available news items for that category without error and without empty placeholders (card placeholders, not image placeholders)

#### Scenario: Category news item without an image in the source
- **WHEN** a category news item has no image URL provided by the source
- **THEN** the system shows a placeholder in place of the image on the left of the card, rather than hiding the image block

#### Scenario: Category news description longer than 4 lines
- **WHEN** the description of a category news item provided by the source is longer than 4 lines of text in the card
- **THEN** the system visually truncates the excerpt to 4 lines, without stretching the card to fit the entire description text
