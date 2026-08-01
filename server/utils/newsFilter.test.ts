import { describe, expect, it } from 'vitest'
import { dedupeBySimilarTitle, selectLatestNews } from './newsFilter'
import type { RawNewsItem } from './rss'

function newsItem(overrides: Partial<RawNewsItem> = {}): RawNewsItem {
  return {
    title: 'Some news',
    excerpt: 'Excerpt',
    publishedAt: 'Thu, 30 Jul 2026 12:00:00 +0000',
    link: 'https://example.com/article',
    imageUrl: null,
    source: 'Source A',
    ...overrides,
  }
}

describe('dedupeBySimilarTitle', () => {
  it('collapses near-identical titles from different sources into one item', () => {
    const items = [
      newsItem({
        title: 'Manchester United sign new striker in club-record deal',
        link: 'https://a.example/story',
        source: 'Source A',
      }),
      newsItem({
        title: 'Manchester United sign new striker in a club record deal',
        link: 'https://b.example/story',
        source: 'Source B',
      }),
    ]

    const result = dedupeBySimilarTitle(items)
    expect(result).toHaveLength(1)
  })

  it('keeps distinct stories that share overlapping vocabulary separate', () => {
    const items = [
      newsItem({
        title: 'Arsenal beat Chelsea in dramatic derby',
        link: 'https://a.example/story-1',
      }),
      newsItem({
        title: 'Liverpool beat Everton in dramatic derby',
        link: 'https://b.example/story-2',
      }),
    ]

    const result = dedupeBySimilarTitle(items)
    expect(result).toHaveLength(2)
  })

  it('keeps the item that has an imageUrl when collapsing a duplicate pair', () => {
    const items = [
      newsItem({
        title: 'Manchester United sign new striker in club-record deal',
        link: 'https://a.example/story',
        imageUrl: null,
      }),
      newsItem({
        title: 'Manchester United sign new striker in a club record deal',
        link: 'https://b.example/story',
        imageUrl: 'https://b.example/image.jpg',
      }),
    ]

    const result = dedupeBySimilarTitle(items)
    expect(result).toHaveLength(1)
    expect(result[0]?.imageUrl).toBe('https://b.example/image.jpg')
  })

  it('keeps the more recent item when both or neither have an imageUrl', () => {
    const items = [
      newsItem({
        title: 'Manchester United sign new striker in club-record deal',
        link: 'https://a.example/story',
        publishedAt: 'Thu, 30 Jul 2026 09:00:00 +0000',
      }),
      newsItem({
        title: 'Manchester United sign new striker in a club record deal',
        link: 'https://b.example/story',
        publishedAt: 'Thu, 30 Jul 2026 12:00:00 +0000',
      }),
    ]

    const result = dedupeBySimilarTitle(items)
    expect(result).toHaveLength(1)
    expect(result[0]?.link).toBe('https://b.example/story')
  })
})

describe('selectLatestNews exact-link dedup', () => {
  it('still removes exact-link duplicates unchanged', () => {
    const items = [
      newsItem({ title: 'Story one', link: 'https://example.com/story' }),
      newsItem({ title: 'Story one', link: 'https://example.com/story' }),
    ]

    const result = selectLatestNews(items, 10)
    expect(result).toHaveLength(1)
  })
})
