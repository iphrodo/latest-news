import { fetchNewsFeedXml, parseNewsFeedXml } from './rss'
import { selectLatestNews } from './newsFilter'
import type { NewsCategoryConfig } from './newsCategories'

const NEWS_LIMIT = 10

export async function loadCategoryNews(config: NewsCategoryConfig) {
  try {
    const xml = await fetchNewsFeedXml(config.feedUrl)
    const items = parseNewsFeedXml(xml)
    const news = selectLatestNews(items, NEWS_LIMIT, config.keywords)
    if (news.length > 0 || !config.fallbackFeedUrl) return news

    const fallbackXml = await fetchNewsFeedXml(config.fallbackFeedUrl)
    const fallbackItems = parseNewsFeedXml(fallbackXml)
    return selectLatestNews(fallbackItems, NEWS_LIMIT, config.keywords)
  } catch (primaryError) {
    if (!config.fallbackFeedUrl) {
      throw new Error(`Failed to load ${config.label} news feed`, { cause: primaryError })
    }

    try {
      const xml = await fetchNewsFeedXml(config.fallbackFeedUrl)
      const items = parseNewsFeedXml(xml)
      return selectLatestNews(items, NEWS_LIMIT, config.keywords)
    } catch (fallbackError) {
      throw new Error(`Failed to load ${config.label} news feed`, { cause: fallbackError })
    }
  }
}
