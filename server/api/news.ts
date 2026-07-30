import { fetchNewsFeedXml, parseNewsFeedXml } from '../utils/rss'
import { EPL_KEYWORDS, selectLatestNews } from '../utils/newsFilter'

const RSS_FEED_URL = 'https://feeds.bbci.co.uk/sport/football/rss.xml'
const NEWS_LIMIT = 10

export default defineEventHandler(async () => {
  try {
    const xml = await fetchNewsFeedXml(RSS_FEED_URL)
    const items = parseNewsFeedXml(xml)
    return selectLatestNews(items, NEWS_LIMIT, EPL_KEYWORDS)
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to load EPL news feed',
      cause: error,
    })
  }
})
