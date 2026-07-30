import { XMLParser } from 'fast-xml-parser'

export interface RawNewsItem {
  title: string
  excerpt: string
  publishedAt: string
  link: string
  imageUrl: string | null
}

const FETCH_TIMEOUT_MS = 5000

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim()
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
}

// Some feeds (e.g. aggregators re-publishing other sources) double-encode entities,
// so "&#8217;" arrives in the XML as the literal text "&amp;#8217;". fast-xml-parser
// only unwraps one level, leaving a literal "&#8217;" in the parsed value that still
// needs decoding here.
function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const isHex = entity[1] === 'x' || entity[1] === 'X'
      const code = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10)
      return Number.isNaN(code) ? match : String.fromCodePoint(code)
    }
    return NAMED_ENTITIES[entity] ?? match
  })
}

// JS's Date parser only recognizes a handful of timezone abbreviations (GMT, UTC,
// and US zones like EST); UK feeds emitting "BST" (British Summer Time) produce an
// Invalid Date, which breaks both sorting and date display downstream.
const TIMEZONE_OFFSETS: Record<string, string> = {
  GMT: '+0000',
  UTC: '+0000',
  BST: '+0100',
}

function normalizePubDate(value: string): string {
  const match = value.match(/ ([A-Z]{2,5})$/)
  const offset = match ? TIMEZONE_OFFSETS[match[1]] : undefined
  if (!match || !offset) return value
  return `${value.slice(0, match.index)} ${offset}`
}

export async function fetchNewsFeedXml(feedUrl: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(feedUrl, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`RSS feed responded with status ${response.status}`)
    }
    return await response.text()
  } finally {
    clearTimeout(timeout)
  }
}

function extractImageUrlFromHtml(html: string | undefined): string | null {
  if (!html) return null
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

function isImageEnclosure(enclosure: { '@_url'?: string; '@_type'?: string }): boolean {
  if (!enclosure['@_url']) return false
  if (!enclosure['@_type']) return true
  return enclosure['@_type'].startsWith('image/')
}

function extractImageUrl(item: Record<string, unknown>): string | null {
  const thumbnail = item['media:thumbnail'] as { '@_url'?: string } | undefined
  if (thumbnail?.['@_url']) return thumbnail['@_url']

  const mediaContentRaw = item['media:content']
  const mediaContentList = Array.isArray(mediaContentRaw) ? mediaContentRaw : [mediaContentRaw]
  for (const mediaContent of mediaContentList) {
    const mediaContentUrl = (mediaContent as { '@_url'?: string } | undefined)?.['@_url']
    if (mediaContentUrl) return mediaContentUrl
  }

  const enclosureRaw = item.enclosure as
    | { '@_url'?: string; '@_type'?: string }
    | { '@_url'?: string; '@_type'?: string }[]
    | undefined
  const enclosureList = Array.isArray(enclosureRaw) ? enclosureRaw : enclosureRaw ? [enclosureRaw] : []
  const imageEnclosure = enclosureList.find(isImageEnclosure)
  if (imageEnclosure?.['@_url']) return imageEnclosure['@_url']

  const contentEncoded = item['content:encoded']
  const imageFromContentEncoded = extractImageUrlFromHtml(
    typeof contentEncoded === 'string' ? contentEncoded : undefined,
  )
  if (imageFromContentEncoded) return imageFromContentEncoded

  const description = item.description
  const imageFromDescription = extractImageUrlFromHtml(typeof description === 'string' ? description : undefined)
  if (imageFromDescription) return imageFromDescription

  return null
}

export function parseNewsFeedXml(xml: string): RawNewsItem[] {
  const parser = new XMLParser({ ignoreAttributes: false, processEntities: true, htmlEntities: true })
  const parsed = parser.parse(xml)
  const items = parsed?.rss?.channel?.item

  if (!items) return []

  const list = Array.isArray(items) ? items : [items]

  return list.map((item) => ({
    title: decodeEntities(stripHtml(String(item.title ?? ''))),
    excerpt: decodeEntities(stripHtml(String(item.description ?? ''))),
    publishedAt: normalizePubDate(String(item.pubDate ?? '')),
    link: String(item.link ?? ''),
    imageUrl: extractImageUrl(item),
  }))
}
