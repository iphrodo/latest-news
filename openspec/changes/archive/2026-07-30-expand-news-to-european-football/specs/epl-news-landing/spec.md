## MODIFIED Requirements

### Requirement: Display 10 latest news items
The system SHALL display exactly 10 of the newest European football news items on the landing page, sorted from newest to oldest by publication date. European football news includes news about the top domestic leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) and major UEFA club competitions (Champions League, Europa League, Conference League).

#### Scenario: News source returns enough news items
- **WHEN** a visitor opens the landing page and the news source returns 10 or more European football news items
- **THEN** the system shows exactly 10 news items, sorted from newest to oldest

#### Scenario: News source returns fewer than 10 news items
- **WHEN** the news source returns fewer than 10 available news items
- **THEN** the system shows all available news items without error, without empty placeholders
