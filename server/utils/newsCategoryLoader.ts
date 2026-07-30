import { fetchNewsFeedXml, parseNewsFeedXml, type RawNewsItem } from './rss'
import { selectLatestNews } from './newsFilter'
import { fetchArticleImageUrl } from './articleImage'
import type { NewsCategoryConfig } from './newsCategories'

const NEWS_LIMIT = 10

async function fillMissingImages(news: RawNewsItem[]): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(
    news.map((item) => (item.imageUrl === null ? fetchArticleImageUrl(item.link) : Promise.resolve(item.imageUrl))),
  )

  return news.map((item, index) => {
    const result = results[index]
    const imageUrl = result?.status === 'fulfilled' ? result.value : null
    return imageUrl ? { ...item, imageUrl } : item
  })
}

export async function loadCategoryNews(config: NewsCategoryConfig) {
  try {
    const xml = await fetchNewsFeedXml(config.feedUrl)
    const items = parseNewsFeedXml(xml)
    const news = selectLatestNews(items, NEWS_LIMIT, config.keywords)
    if (news.length > 0) return await fillMissingImages(news)
    if (!config.fallbackFeedUrl) return news

    const fallbackXml = await fetchNewsFeedXml(config.fallbackFeedUrl)
    const fallbackItems = parseNewsFeedXml(fallbackXml)
    const fallbackNews = selectLatestNews(fallbackItems, NEWS_LIMIT, config.keywords)
    return await fillMissingImages(fallbackNews)
  } catch (primaryError) {
    if (!config.fallbackFeedUrl) {
      throw new Error(`Failed to load ${config.label} news feed`, { cause: primaryError })
    }

    try {
      const xml = await fetchNewsFeedXml(config.fallbackFeedUrl)
      const items = parseNewsFeedXml(xml)
      const news = selectLatestNews(items, NEWS_LIMIT, config.keywords)
      return await fillMissingImages(news)
    } catch (fallbackError) {
      throw new Error(`Failed to load ${config.label} news feed`, { cause: fallbackError })
    }
  }
}
