## MODIFIED Requirements

### Requirement: Category feed content
Each category SHALL fetch news from multiple sources configured for that category, merge them into a single list, and deduplicate near-identical stories across those sources in addition to exact duplicate links. Each category SHALL show up to a configured maximum number of the newest deduplicated news items, sorted from newest to oldest, in the same card format as the European football feed (title, excerpt, source name, image on the left, publication date and time, link to source). The excerpt SHALL be visually truncated to 4 lines of text, regardless of the length of the description provided by that category's news source.

#### Scenario: Merged sources return the configured maximum or more news items
- **WHEN** the merged, deduplicated set of news items across all of a category's sources matches the category's topic and contains at least the configured maximum
- **THEN** the system shows exactly the configured maximum number of the newest news items for that category

#### Scenario: Merged sources return fewer than the configured maximum
- **WHEN** the merged, deduplicated set of news items across all of a category's sources matching the category's topic is smaller than the configured maximum
- **THEN** the system shows all available unique news items for that category without error and without empty placeholders (card placeholders, not image placeholders)

#### Scenario: One of a category's sources is unavailable
- **WHEN** one of a category's configured news sources fails or times out while at least one other source for that category responds successfully
- **THEN** the system shows the merged news items from the remaining available sources for that tab, without treating the tab as errored

#### Scenario: Two sources for the same category report the same story
- **WHEN** two of a category's configured news sources publish articles about the same story with different URLs and near-identical titles
- **THEN** the system shows only one of those articles in that category's merged list, not both

#### Scenario: Category news item without an image in the source
- **WHEN** a category news item has no image URL provided by the source
- **THEN** the system shows a placeholder in place of the image on the left of the card, rather than hiding the image block

#### Scenario: Category news description longer than 4 lines
- **WHEN** the description of a category news item provided by the source is longer than 4 lines of text in the card
- **THEN** the system visually truncates the excerpt to 4 lines, without stretching the card to fit the entire description text
