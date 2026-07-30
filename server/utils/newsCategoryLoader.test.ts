import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { RawNewsItem } from './rss'

const { fetchNewsFeedXml, parseNewsFeedXml } = vi.hoisted(() => ({
  fetchNewsFeedXml: vi.fn(),
  parseNewsFeedXml: vi.fn(),
}))

const { fetchArticleImageUrl } = vi.hoisted(() => ({
  fetchArticleImageUrl: vi.fn(),
}))

vi.mock('./rss', () => ({ fetchNewsFeedXml, parseNewsFeedXml }))
vi.mock('./articleImage', () => ({ fetchArticleImageUrl }))

const { loadCategoryNews } = await import('./newsCategoryLoader')

function newsItem(overrides: Partial<RawNewsItem> = {}): RawNewsItem {
  return {
    title: 'Some tech news',
    excerpt: 'Excerpt',
    publishedAt: 'Thu, 30 Jul 2026 12:00:00 +0000',
    link: 'https://example.com/article',
    imageUrl: null,
    ...overrides,
  }
}

describe('loadCategoryNews', () => {
  beforeEach(() => {
    fetchNewsFeedXml.mockReset()
    parseNewsFeedXml.mockReset()
    fetchArticleImageUrl.mockReset()
  })

  it('falls back to the fallback feed when the primary feed has no matching keywords', async () => {
    fetchNewsFeedXml.mockImplementation(async (url: string) => url)
    parseNewsFeedXml.mockImplementation((xml: string) => {
      if (xml === 'https://primary.example/feed') {
        return [newsItem({ title: 'Unrelated general tech article' })]
      }
      return [newsItem({ title: 'Company announces layoffs', link: 'https://example.com/layoffs' })]
    })

    const news = await loadCategoryNews({
      label: 'IT Jobs',
      feedUrl: 'https://primary.example/feed',
      fallbackFeedUrl: 'https://fallback.example/feed',
      keywords: ['layoffs'],
    })

    expect(fetchNewsFeedXml).toHaveBeenCalledWith('https://primary.example/feed')
    expect(fetchNewsFeedXml).toHaveBeenCalledWith('https://fallback.example/feed')
    expect(news).toHaveLength(1)
    expect(news[0]?.title).toBe('Company announces layoffs')
  })

  it('returns the primary feed results when they already match', async () => {
    fetchNewsFeedXml.mockResolvedValue('<rss></rss>')
    parseNewsFeedXml.mockReturnValue([newsItem()])

    const news = await loadCategoryNews({
      label: 'Technology',
      feedUrl: 'https://primary.example/feed',
    })

    expect(fetchNewsFeedXml).toHaveBeenCalledTimes(1)
    expect(news).toHaveLength(1)
  })

  it('does not fall back when the primary feed has no matches but no fallback is configured', async () => {
    fetchNewsFeedXml.mockResolvedValue('<rss></rss>')
    parseNewsFeedXml.mockReturnValue([])

    const news = await loadCategoryNews({
      label: 'Technology',
      feedUrl: 'https://primary.example/feed',
    })

    expect(fetchNewsFeedXml).toHaveBeenCalledTimes(1)
    expect(news).toHaveLength(0)
  })

  it('falls back when the primary feed request throws', async () => {
    fetchNewsFeedXml
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce('<rss></rss>')
    parseNewsFeedXml.mockReturnValue([newsItem()])

    const news = await loadCategoryNews({
      label: 'IT Jobs',
      feedUrl: 'https://primary.example/feed',
      fallbackFeedUrl: 'https://fallback.example/feed',
    })

    expect(news).toHaveLength(1)
  })

  it('throws when both the primary and fallback feeds fail', async () => {
    fetchNewsFeedXml.mockRejectedValue(new Error('network error'))

    await expect(
      loadCategoryNews({
        label: 'IT Jobs',
        feedUrl: 'https://primary.example/feed',
        fallbackFeedUrl: 'https://fallback.example/feed',
      }),
    ).rejects.toThrow('Failed to load IT Jobs news feed')
  })

  it('fills in imageUrl for items missing an image from the feed, leaving feed-provided images untouched', async () => {
    fetchNewsFeedXml.mockResolvedValue('<rss></rss>')
    parseNewsFeedXml.mockReturnValue([
      newsItem({ title: 'No image', link: 'https://example.com/no-image', imageUrl: null }),
      newsItem({
        title: 'Has image',
        link: 'https://example.com/has-image',
        imageUrl: 'https://example.com/feed-image.jpg',
      }),
    ])
    fetchArticleImageUrl.mockResolvedValue('https://example.com/article-image.jpg')

    const news = await loadCategoryNews({
      label: 'Technology',
      feedUrl: 'https://primary.example/feed',
    })

    expect(fetchArticleImageUrl).toHaveBeenCalledTimes(1)
    expect(fetchArticleImageUrl).toHaveBeenCalledWith('https://example.com/no-image')
    expect(news.find((item) => item.link === 'https://example.com/no-image')?.imageUrl).toBe(
      'https://example.com/article-image.jpg',
    )
    expect(news.find((item) => item.link === 'https://example.com/has-image')?.imageUrl).toBe(
      'https://example.com/feed-image.jpg',
    )
  })
})
