import { EUROPEAN_FOOTBALL_KEYWORDS, FOOTBALL_TRANSFER_KEYWORDS } from './newsFilter'

export interface NewsFeedSource {
  url: string
  source: string
}

export interface NewsCategoryConfig {
  label: string
  feedUrls: NewsFeedSource[]
  keywords?: string[]
}

export const NEWS_CATEGORIES: Record<string, NewsCategoryConfig> = {
  epl: {
    label: 'European Football',
    feedUrls: [
      { url: 'https://www.skysports.com/rss/11095', source: 'Sky Sports' },
      { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Sport' },
      { url: 'https://www.theguardian.com/football/rss', source: 'The Guardian' },
      { url: 'https://www.independent.co.uk/sport/football/rss', source: 'The Independent' },
      { url: 'https://metro.co.uk/sport/football/feed/', source: 'Metro' },
    ],
    keywords: EUROPEAN_FOOTBALL_KEYWORDS,
  },
  technology: {
    label: 'Technology',
    feedUrls: [
      { url: 'https://www.computerworld.com/feed/', source: 'Computerworld' },
      { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
      { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica' },
      { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
      { url: 'https://www.zdnet.com/news/rss.xml', source: 'ZDNet' },
    ],
  },
  finance: {
    label: 'Finance',
    feedUrls: [
      { url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories', source: 'MarketWatch' },
      { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC' },
      { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance' },
      { url: 'https://www.investing.com/rss/news.rss', source: 'Investing.com' },
      { url: 'https://markets.businessinsider.com/rss/news', source: 'Business Insider' },
    ],
  },
  'artificial-intelligence': {
    label: 'Artificial Intelligence',
    feedUrls: [
      { url: 'https://siliconangle.com/category/ai/feed/', source: 'SiliconANGLE' },
      { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat' },
      { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
      { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired' },
      { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', source: 'MIT Technology Review' },
    ],
  },
  gadgets: {
    label: 'Gadgets',
    feedUrls: [
      { url: 'https://www.engadget.com/rss.xml', source: 'Engadget' },
      { url: 'https://www.techradar.com/feeds/articletype/news', source: 'TechRadar' },
      { url: 'https://www.digitaltrends.com/feed/', source: 'Digital Trends' },
      { url: 'https://www.slashgear.com/feed/', source: 'SlashGear' },
      { url: 'https://www.tomsguide.com/feeds/all', source: "Tom's Guide" },
    ],
  },
  'digital-currencies': {
    label: 'Digital Currencies',
    feedUrls: [
      { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
      { url: 'https://cointelegraph.com/rss', source: 'Cointelegraph' },
      { url: 'https://decrypt.co/feed', source: 'Decrypt' },
      { url: 'https://www.theblock.co/rss.xml', source: 'The Block' },
      { url: 'https://bitcoinmagazine.com/feed', source: 'Bitcoin Magazine' },
    ],
  },
  playstation: {
    label: 'Playstation',
    feedUrls: [
      { url: 'https://blog.playstation.com/feed/', source: 'PlayStation Blog' },
      { url: 'https://www.pushsquare.com/feeds/latest', source: 'Push Square' },
      { url: 'https://www.psu.com/feed/', source: 'PlayStation Universe' },
      { url: 'https://www.playstationlifestyle.net/feed/', source: 'PlayStation LifeStyle' },
      { url: 'https://gamerant.com/feed/tag/playstation/', source: 'Game Rant' },
    ],
  },
  apple: {
    label: 'Apple',
    feedUrls: [
      { url: 'https://9to5mac.com/feed/', source: '9to5Mac' },
      { url: 'https://feeds.macrumors.com/MacRumors-All', source: 'MacRumors' },
      { url: 'https://appleinsider.com/rss/news/', source: 'AppleInsider' },
      { url: 'https://www.macstories.net/feed/', source: 'MacStories' },
      { url: 'https://www.cultofmac.com/feed/', source: 'Cult of Mac' },
    ],
  },
  'it-jobs': {
    label: 'IT Jobs',
    feedUrls: [
      { url: 'https://www.techrepublic.com/rssfeeds/topic/it-employment/', source: 'TechRepublic' },
      { url: 'https://techcrunch.com/tag/layoffs/feed/', source: 'TechCrunch' },
      { url: 'https://www.hrdive.com/feeds/news/', source: 'HR Dive' },
      { url: 'https://www.fastcompany.com/section/work-life/rss', source: 'Fast Company' },
      { url: 'https://www.inc.com/rss', source: 'Inc.' },
    ],
    keywords: ['tech jobs', 'layoffs', 'hiring', 'job cuts', 'redundancies', 'tech workers', 'it employment'],
  },
  'football-transfers': {
    label: 'Transfers & Rumours',
    feedUrls: [
      { url: 'https://www.espn.com/espn/rss/soccer/news', source: 'ESPN' },
      { url: 'https://www.theguardian.com/football/transfer-window/rss', source: 'The Guardian' },
      { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports' },
      { url: 'https://www.mirror.co.uk/sport/football/?service=rss', source: 'Mirror' },
      { url: 'https://www.90min.com/posts.rss', source: '90min' },
    ],
    keywords: FOOTBALL_TRANSFER_KEYWORDS,
  },
}
