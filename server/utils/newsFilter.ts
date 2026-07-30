import type { RawNewsItem } from './rss'

export const EPL_KEYWORDS = [
  'premier league',
  'arsenal',
  'aston villa',
  'bournemouth',
  'brentford',
  'brighton',
  'burnley',
  'chelsea',
  'crystal palace',
  'everton',
  'fulham',
  'leeds',
  'liverpool',
  'manchester city',
  'manchester united',
  'newcastle',
  'nottingham forest',
  "nott'm forest",
  'sunderland',
  'tottenham',
  'west ham',
  'wolves',
  'wolverhampton',
]

export function isEplNews(item: RawNewsItem): boolean {
  return matchesKeywords(item, EPL_KEYWORDS)
}

function matchesKeywords(item: RawNewsItem, keywords: string[]): boolean {
  const haystack = `${item.title} ${item.excerpt}`.toLowerCase()
  return keywords.some((keyword) => haystack.includes(keyword))
}

function dedupeByLink(items: RawNewsItem[]): RawNewsItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.link)) return false
    seen.add(item.link)
    return true
  })
}

export function selectLatestNews(
  items: RawNewsItem[],
  limit: number,
  keywords?: string[],
): RawNewsItem[] {
  const deduped = dedupeByLink(items)
  const filtered = keywords ? deduped.filter((item) => matchesKeywords(item, keywords)) : deduped
  return filtered
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}
