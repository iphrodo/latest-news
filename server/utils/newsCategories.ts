import { EPL_KEYWORDS } from './newsFilter'

export interface NewsCategoryConfig {
  label: string
  feedUrl: string
  fallbackFeedUrl?: string
  keywords?: string[]
}

const BBC_FOOTBALL_FEED_URL = 'https://feeds.bbci.co.uk/sport/football/rss.xml'
const COMPUTERWORLD_FEED_URL = 'https://www.computerworld.com/feed/'
const AI_NEWS_FEED_URL = 'https://siliconangle.com/category/ai/feed/'
const TECHCRUNCH_LAYOFFS_FEED_URL = 'https://techcrunch.com/tag/layoffs/feed/'
const MARKETWATCH_TOP_STORIES_FEED_URL = 'https://feeds.content.dowjones.io/public/rss/mw_topstories'
const ENGADGET_FEED_URL = 'https://www.engadget.com/rss.xml'
const COINDESK_FEED_URL = 'https://www.coindesk.com/arc/outboundfeeds/rss/'
const PLAYSTATION_BLOG_FEED_URL = 'https://blog.playstation.com/feed/'
const NINE_TO_FIVE_MAC_FEED_URL = 'https://9to5mac.com/feed/'
const TECHREPUBLIC_IT_EMPLOYMENT_FEED_URL = 'https://www.techrepublic.com/rssfeeds/topic/it-employment/'

export const NEWS_CATEGORIES: Record<string, NewsCategoryConfig> = {
  epl: {
    label: 'EPL',
    feedUrl: BBC_FOOTBALL_FEED_URL,
    keywords: EPL_KEYWORDS,
  },
  technology: {
    label: 'Technology',
    feedUrl: COMPUTERWORLD_FEED_URL,
  },
  finance: {
    label: 'Finance',
    feedUrl: MARKETWATCH_TOP_STORIES_FEED_URL,
  },
  'artificial-intelligence': {
    label: 'Artificial Intelligence',
    feedUrl: AI_NEWS_FEED_URL,
  },
  gadgets: {
    label: 'Gadgets',
    feedUrl: ENGADGET_FEED_URL,
  },
  'digital-currencies': {
    label: 'Digital Currencies',
    feedUrl: COINDESK_FEED_URL,
  },
  playstation: {
    label: 'Playstation',
    feedUrl: PLAYSTATION_BLOG_FEED_URL,
  },
  apple: {
    label: 'Apple',
    feedUrl: NINE_TO_FIVE_MAC_FEED_URL,
  },
  'it-jobs': {
    label: 'IT Jobs',
    feedUrl: TECHREPUBLIC_IT_EMPLOYMENT_FEED_URL,
    fallbackFeedUrl: TECHCRUNCH_LAYOFFS_FEED_URL,
    keywords: ['tech jobs', 'layoffs', 'hiring', 'job cuts', 'redundancies', 'tech workers', 'it employment'],
  },
}
