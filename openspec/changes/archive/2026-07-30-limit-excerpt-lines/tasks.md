## 1. Limit excerpt to 4 lines

- [x] 1.1 Add CSS line-clamp (limit to 4 lines, truncate with `...`) to `.news-card__excerpt` in `app/components/NewsCard.vue`, including cross-browser properties (`display: -webkit-box`, `-webkit-line-clamp`, `-webkit-box-orient`, `overflow: hidden`).
- [x] 1.2 Verify that the limit applies equally to the EPL feed and all category tabs, since they all use the shared `NewsCard.vue` component.

## 2. Verification

- [x] 2.1 Run the full test suite (`npx vitest run`) and confirm existing tests still pass.
- [x] 2.2 Manually check in the browser a category with a long description (e.g. Technology or Artificial Intelligence) that the card no longer stretches to fit the entire article text.
