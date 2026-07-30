import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fetchArticleImageUrl } from './articleImage'

describe('fetchArticleImageUrl', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('extracts the og:image content from the article HTML', async () => {
    const html = `<html><head><meta property="og:image" content="https://example.com/photo.jpg" /></head></html>`
    vi.mocked(fetch).mockResolvedValue(new Response(html, { status: 200 }))

    const url = await fetchArticleImageUrl('https://example.com/article')
    expect(url).toBe('https://example.com/photo.jpg')
  })

  it('returns null on a non-200 response', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 404 }))

    const url = await fetchArticleImageUrl('https://example.com/article')
    expect(url).toBeNull()
  })

  it('returns null when the og:image tag is missing', async () => {
    const html = `<html><head><title>No image here</title></head></html>`
    vi.mocked(fetch).mockResolvedValue(new Response(html, { status: 200 }))

    const url = await fetchArticleImageUrl('https://example.com/article')
    expect(url).toBeNull()
  })

  it('returns null on a network error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network error'))

    const url = await fetchArticleImageUrl('https://example.com/article')
    expect(url).toBeNull()
  })

  it('returns null on timeout', async () => {
    vi.useFakeTimers()
    vi.mocked(fetch).mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
    )

    const promise = fetchArticleImageUrl('https://example.com/article')
    await vi.advanceTimersByTimeAsync(3000)
    const url = await promise

    expect(url).toBeNull()
    vi.useRealTimers()
  })
})
