import { fetchNewsFeedXml, parseNewsFeedXml, type RawNewsItem } from './rss'
import { selectLatestNews } from './newsFilter'
import { fetchArticleImageUrl } from './articleImage'
import type { NewsCategoryConfig } from './newsCategories'

const NEWS_LIMIT = 20

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
  const results = await Promise.allSettled(
    config.feedUrls.map(async ({ url, source }) => {
      const xml = await fetchNewsFeedXml(url)
      return parseNewsFeedXml(xml, source)
    }),
  )

  const fulfilled = results.filter(
    (result): result is PromiseFulfilledResult<RawNewsItem[]> => result.status === 'fulfilled',
  )

  if (fulfilled.length === 0) {
    const firstError = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )?.reason
    throw new Error(`Failed to load ${config.label} news feed`, { cause: firstError })
  }

  const items = fulfilled.flatMap((result) => result.value)
  const news = selectLatestNews(items, NEWS_LIMIT, config.keywords)
  return await fillMissingImages(news)
}
