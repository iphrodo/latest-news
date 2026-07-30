# news-category-tabs Specification

## Purpose

Allows a visitor to switch between thematic news categories via tabs and browse up to 10 latest news items of the selected category without reloading the page.

## Requirements

### Requirement: Category tabs panel
The system SHALL show a tab panel with the following news categories: Artificial Intelligence, Technology, Finance, Gadgets, Digital Currencies, Playstation, Apple, IT Jobs, as well as a tab with the European football news feed (covering the top domestic leagues and major UEFA club competitions).

#### Scenario: Displaying tabs
- **WHEN** a visitor opens the page
- **THEN** the system shows a panel with all category tabs, and one of them is marked as active

### Requirement: Lazy loading of category news
News for a category SHALL be loaded only after the visitor's first click on the corresponding tab, without reloading the page.

#### Scenario: First click on a category tab
- **WHEN** a visitor clicks a category tab for the first time, and that category's news has not yet been loaded
- **THEN** the system performs a client-side request for that category's news, without reloading the page

#### Scenario: Category news is not preloaded
- **WHEN** a visitor opens the page and has not yet clicked a category tab
- **THEN** the system does not request that category's news until the tab is opened

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

### Requirement: Client-side caching of loaded categories
The system SHALL cache on the client the news of an already opened category for the duration of the current page load, and reuse it when switching back to that tab without a new request to the server.

#### Scenario: Repeated click on an already opened tab
- **WHEN** a visitor clicks a category tab whose news has already been loaded earlier in this page viewing session
- **THEN** the system shows the previously loaded news without a new request to the server

### Requirement: Independent loading and error states per tab
Each category tab SHALL have its own loading state and error state, which do not affect the content or state of other tabs.

#### Scenario: Category data is still loading
- **WHEN** a visitor has opened a category tab and the news request for it is still in progress
- **THEN** the system shows a loading indicator within that tab, while previously loaded tabs remain unchanged

#### Scenario: News source for the category is unavailable
- **WHEN** the news request for the opened category fails or times out
- **THEN** the system shows an error message with the option to retry within that tab, without affecting other tabs
