import { NEWS_CATEGORIES } from '../utils/newsCategories'
import { loadCategoryNews } from '../utils/newsCategoryLoader'

export default defineEventHandler(async () => {
  const config = NEWS_CATEGORIES.epl!

  try {
    return await loadCategoryNews(config)
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to load European football news feed',
      cause: error,
    })
  }
})
