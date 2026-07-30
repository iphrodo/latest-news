import { NEWS_CATEGORIES } from '../../utils/newsCategories'
import { loadCategoryNews } from '../../utils/newsCategoryLoader'

export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, 'category')
  const config = category ? NEWS_CATEGORIES[category] : undefined

  if (!config) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown news category: ${category}`,
    })
  }

  try {
    return await loadCategoryNews(config)
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: `Failed to load ${config.label} news feed`,
      cause: error,
    })
  }
})
