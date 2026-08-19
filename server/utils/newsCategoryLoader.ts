import { fetchNewsFeedXml, parseNewsFeedXml, type RawNewsItem } from './rss'
import { selectLatestNews } from './newsFilter'
import { fetchArticleImageUrl } from './articleImage'
import type { NewsCategoryConfig } from './newsCategories'

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  published_at: string
  link: string
  imageUrl: string | null
  source: string
  category: string
}

const NEWS_LIMIT = 20

const PUSH_SQUARE_SOURCE = 'Push Square'

function proxyPushSquareImages(news: RawNewsItem[]): RawNewsItem[] {
  return news.map((item) => {
    if (item.source !== PUSH_SQUARE_SOURCE || !item.imageUrl) return item
    return { ...item, imageUrl: `/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}` }
  })
}

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

function toNewsItem(item: RawNewsItem, category: string): NewsItem {
  return {
    id: item.link,
    title: item.title,
    excerpt: item.excerpt,
    published_at: item.publishedAt,
    link: item.link,
    imageUrl: item.imageUrl,
    source: item.source,
    category,
  }
}

export async function loadCategoryNews(config: NewsCategoryConfig, category: string): Promise<NewsItem[]> {
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
  const withImages = await fillMissingImages(news)
  const proxied = proxyPushSquareImages(withImages)
  return proxied.map((item) => toNewsItem(item, category))
}
