import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { createApp, toWebHandler } from 'h3'
import handler from './image-proxy.get'

function createFetcher() {
  const app = createApp()
  app.use(handler)
  return toWebHandler(app)
}

describe('GET /api/image-proxy', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('streams the image and sets caching headers for an allowed host', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('image-bytes', { status: 200, headers: { 'content-type': 'image/jpeg' } }),
    )

    const fetcher = createFetcher()
    const response = await fetcher(
      new Request('http://localhost/?url=' + encodeURIComponent('https://images.pushsquare.com/thumb.jpg')),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/jpeg')
    expect(response.headers.get('cache-control')).toContain('immutable')
    expect(await response.text()).toBe('image-bytes')
  })

  it('rejects a host other than images.pushsquare.com', async () => {
    const fetcher = createFetcher()
    const response = await fetcher(
      new Request('http://localhost/?url=' + encodeURIComponent('https://evil.example.com/thumb.jpg')),
    )

    expect(response.status).toBe(403)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns an error status when the upstream fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network error'))

    const fetcher = createFetcher()
    const response = await fetcher(
      new Request('http://localhost/?url=' + encodeURIComponent('https://images.pushsquare.com/thumb.jpg')),
    )

    expect(response.status).toBe(502)
  })

  it('returns an error status when the upstream response is not an image', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('<html></html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    )

    const fetcher = createFetcher()
    const response = await fetcher(
      new Request('http://localhost/?url=' + encodeURIComponent('https://images.pushsquare.com/thumb.jpg')),
    )

    expect(response.status).toBe(502)
  })

  it('returns an error status when the url query parameter is missing', async () => {
    const fetcher = createFetcher()
    const response = await fetcher(new Request('http://localhost/'))

    expect(response.status).toBe(400)
    expect(fetch).not.toHaveBeenCalled()
  })
})
