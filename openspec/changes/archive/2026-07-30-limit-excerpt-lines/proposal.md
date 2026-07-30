## Why

The `epl-news-landing` and `news-category-tabs` specs require the news card to show a "short description (excerpt)", but do not define any limit on length or number of lines. Some RSS sources (e.g. Computerworld for Technology, SiliconANGLE for Artificial Intelligence) return nearly the full article text in the `description` field. Because there is no limit, the card stretches to fit the entire article text instead of a short excerpt, breaking the news feed layout for all categories.

## What Changes

- Clarify the "News card content" (`epl-news-landing`) and "Category feed content" (`news-category-tabs`) requirements: the news excerpt SHALL be visually truncated to 4 lines of text, regardless of the length of the original description from the source.
- Implement excerpt truncation to 4 lines in the news card (`app/components/NewsCard.vue`) via CSS line-clamp, applicable to all categories (EPL and all tabs).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `epl-news-landing`: the "News card content" requirement is extended with a limit on excerpt display to 4 lines of text.
- `news-category-tabs`: the "Category feed content" requirement is extended with the same limit for cards in all categories.

## Impact

- `app/components/NewsCard.vue` — `.news-card__excerpt` styles (CSS line-clamp to 4 lines), shared across EPL and all categories since they use a single card component.
