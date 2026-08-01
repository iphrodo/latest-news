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
    source: 'Example Source',
    ...overrides,
  }
}

describe('loadCategoryNews', () => {
  beforeEach(() => {
    fetchNewsFeedXml.mockReset()
    parseNewsFeedXml.mockReset()
    fetchArticleImageUrl.mockReset()
  })

  it('merges items from all configured sources', async () => {
    fetchNewsFeedXml.mockImplementation(async (url: string) => url)
    parseNewsFeedXml.mockImplementation((xml: string, source: string) => {
      if (xml === 'https://one.example/feed') {
        return [newsItem({ title: 'Article one', link: 'https://example.com/one', source })]
      }
      return [newsItem({ title: 'Article two', link: 'https://example.com/two', source })]
    })

    const news = await loadCategoryNews({
      label: 'Technology',
      feedUrls: [
        { url: 'https://one.example/feed', source: 'Source One' },
        { url: 'https://two.example/feed', source: 'Source Two' },
      ],
    })

    expect(fetchNewsFeedXml).toHaveBeenCalledWith('https://one.example/feed')
    expect(fetchNewsFeedXml).toHaveBeenCalledWith('https://two.example/feed')
    expect(news).toHaveLength(2)
    expect(news.find((item) => item.link === 'https://example.com/one')?.source).toBe('Source One')
    expect(news.find((item) => item.link === 'https://example.com/two')?.source).toBe('Source Two')
  })

  it('filters merged items by keywords', async () => {
    fetchNewsFeedXml.mockImplementation(async (url: string) => url)
    parseNewsFeedXml.mockImplementation((xml: string, source: string) => {
      if (xml === 'https://one.example/feed') {
        return [newsItem({ title: 'Unrelated general tech article', source })]
      }
      return [newsItem({ title: 'Company announces layoffs', link: 'https://example.com/layoffs', source })]
    })

    const news = await loadCategoryNews({
      label: 'IT Jobs',
      feedUrls: [
        { url: 'https://one.example/feed', source: 'Source One' },
        { url: 'https://two.example/feed', source: 'Source Two' },
      ],
      keywords: ['layoffs'],
    })

    expect(news).toHaveLength(1)
    expect(news[0]?.title).toBe('Company announces layoffs')
  })

  it('returns items from the remaining sources when one source rejects', async () => {
    fetchNewsFeedXml
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce('<rss></rss>')
    parseNewsFeedXml.mockReturnValue([newsItem()])

    const news = await loadCategoryNews({
      label: 'IT Jobs',
      feedUrls: [
        { url: 'https://one.example/feed', source: 'Source One' },
        { url: 'https://two.example/feed', source: 'Source Two' },
      ],
    })

    expect(news).toHaveLength(1)
  })

  it('throws when every source fails', async () => {
    fetchNewsFeedXml.mockRejectedValue(new Error('network error'))

    await expect(
      loadCategoryNews({
        label: 'IT Jobs',
        feedUrls: [
          { url: 'https://one.example/feed', source: 'Source One' },
          { url: 'https://two.example/feed', source: 'Source Two' },
        ],
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
      feedUrls: [{ url: 'https://primary.example/feed', source: 'Source' }],
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

  it('rewrites Push Square imageUrl to the image proxy route, leaving other sources untouched', async () => {
    fetchNewsFeedXml.mockResolvedValue('<rss></rss>')
    parseNewsFeedXml.mockReturnValue([
      newsItem({
        title: 'PS5 news',
        link: 'https://example.com/ps5-news',
        source: 'Push Square',
        imageUrl: 'https://images.pushsquare.com/thumb.jpg',
      }),
      newsItem({
        title: 'Other source news',
        link: 'https://example.com/other-news',
        source: 'Other Source',
        imageUrl: 'https://example.com/other-image.jpg',
      }),
    ])

    const news = await loadCategoryNews({
      label: 'Playstation',
      feedUrls: [{ url: 'https://primary.example/feed', source: 'Push Square' }],
    })

    expect(news.find((item) => item.link === 'https://example.com/ps5-news')?.imageUrl).toBe(
      '/api/image-proxy?url=https%3A%2F%2Fimages.pushsquare.com%2Fthumb.jpg',
    )
    expect(news.find((item) => item.link === 'https://example.com/other-news')?.imageUrl).toBe(
      'https://example.com/other-image.jpg',
    )
  })
})
