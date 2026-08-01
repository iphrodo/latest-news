import type { RawNewsItem } from './rss'

export const EUROPEAN_FOOTBALL_KEYWORDS = [
  // Premier League
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
  // UEFA club competitions
  'champions league',
  'europa league',
  'conference league',
  'uefa',
  // La Liga
  'la liga',
  'real madrid',
  'barcelona',
  'atletico madrid',
  // Serie A
  'serie a',
  'juventus',
  'ac milan',
  'inter milan',
  'napoli',
  // Bundesliga
  'bundesliga',
  'bayern munich',
  'borussia dortmund',
  // Ligue 1
  'ligue 1',
  'psg',
  'paris saint-germain',
]

export function isEuropeanFootballNews(item: RawNewsItem): boolean {
  return matchesKeywords(item, EUROPEAN_FOOTBALL_KEYWORDS)
}

export const FOOTBALL_TRANSFER_KEYWORDS = [
  'transfer',
  'transfers',
  'signing',
  'sign for',
  'signs for',
  'deal',
  'loan',
  'loan move',
  'rumors',
  'rumours',
  'sources:',
  'linked with',
  'medical',
  'bid for',
  'move to',
  'agree deal',
  'agreed a deal',
]

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

const TITLE_SIMILARITY_THRESHOLD = 0.8

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function titleTokenSet(title: string): Set<string> {
  return new Set(normalizeTitle(title).split(' ').filter(Boolean))
}

function tokenSetSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let intersectionSize = 0
  for (const token of a) {
    if (b.has(token)) intersectionSize++
  }
  const unionSize = a.size + b.size - intersectionSize
  return unionSize === 0 ? 0 : intersectionSize / unionSize
}

function betterOfDuplicatePair(a: RawNewsItem, b: RawNewsItem): RawNewsItem {
  if (a.imageUrl && !b.imageUrl) return a
  if (b.imageUrl && !a.imageUrl) return b
  return new Date(a.publishedAt).getTime() >= new Date(b.publishedAt).getTime() ? a : b
}

export function dedupeBySimilarTitle(items: RawNewsItem[]): RawNewsItem[] {
  const kept: { item: RawNewsItem; tokens: Set<string> }[] = []

  for (const item of items) {
    const tokens = titleTokenSet(item.title)
    const duplicateIndex = kept.findIndex(
      (candidate) => tokenSetSimilarity(candidate.tokens, tokens) >= TITLE_SIMILARITY_THRESHOLD,
    )

    if (duplicateIndex === -1) {
      kept.push({ item, tokens })
      continue
    }

    const existing = kept[duplicateIndex]!
    const winner = betterOfDuplicatePair(existing.item, item)
    kept[duplicateIndex] = { item: winner, tokens: winner === item ? tokens : existing.tokens }
  }

  return kept.map(({ item }) => item)
}

export function selectLatestNews(
  items: RawNewsItem[],
  limit: number,
  keywords?: string[],
): RawNewsItem[] {
  const deduped = dedupeBySimilarTitle(dedupeByLink(items))
  const filtered = keywords ? deduped.filter((item) => matchesKeywords(item, keywords)) : deduped
  return filtered
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}
