## Purpose

This capability describes a landing page that fetches and displays the 10 latest English Premier League news items for site visitors.

## ADDED Requirements

### Requirement: Display 10 latest news items
The system SHALL display exactly 10 of the newest English Premier League news items on the landing page, sorted from newest to oldest by publication date.

#### Scenario: News source returns enough news items
- **WHEN** a visitor opens the landing page and the news source returns 10 or more EPL news items
- **THEN** the system shows exactly 10 news items, sorted from newest to oldest

#### Scenario: News source returns fewer than 10 news items
- **WHEN** the news source returns fewer than 10 available news items
- **THEN** the system shows all available news items without error, without empty placeholders

### Requirement: News card content
Each news item on the page SHALL display a title, a short description (excerpt), the publication date, and a link to the original source.

#### Scenario: News item contains all fields
- **WHEN** a news item has a title, excerpt, publication date, and source URL
- **THEN** the system displays all four fields in the news card

#### Scenario: Clicking a news item opens the source
- **WHEN** a visitor clicks the title or card of a news item
- **THEN** the system opens the original news source in a new tab

### Requirement: Loading state
While fetching news from the external source, the system SHALL show a loading indicator instead of an empty or stale page.

#### Scenario: Data is still loading
- **WHEN** a visitor opens the page and the news request is still in progress
- **THEN** the system shows a loading indicator until the response is received

### Requirement: News source error handling
If the news source is unavailable or returns an error, the system SHALL show a clear error message to the user, without crashing the page.

#### Scenario: News source is unavailable
- **WHEN** the request to the news source fails or times out
- **THEN** the system shows an error message with the option to retry, while the page remains functional

### Requirement: Responsive layout
The landing page SHALL display correctly on both mobile and desktop screen sizes.

#### Scenario: Viewing on a mobile device
- **WHEN** a visitor opens the page on a screen narrower than 480px
- **THEN** the news list displays in a single column without horizontal scrolling
