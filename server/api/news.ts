import { fetchNewsFeedXml, parseNewsFeedXml } from '../utils/rss'
import { EUROPEAN_FOOTBALL_KEYWORDS, selectLatestNews } from '../utils/newsFilter'

const RSS_FEED_URL = 'https://www.skysports.com/rss/11095'
const NEWS_LIMIT = 10

export default defineEventHandler(async () => {
  try {
    const xml = await fetchNewsFeedXml(RSS_FEED_URL)
    const items = parseNewsFeedXml(xml)
    return selectLatestNews(items, NEWS_LIMIT, EUROPEAN_FOOTBALL_KEYWORDS)
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to load European football news feed',
      cause: error,
    })
  }
})
