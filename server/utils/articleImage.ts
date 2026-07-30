const FETCH_TIMEOUT_MS = 3000

function extractOgImage(html: string): string | null {
  const metaTags = html.match(/<meta[^>]+>/gi) ?? []
  for (const tag of metaTags) {
    if (!/property=["']og:image["']/i.test(tag)) continue
    const contentMatch = tag.match(/content=["']([^"']+)["']/i)
    if (contentMatch?.[1]) return contentMatch[1]
  }
  return null
}

export async function fetchArticleImageUrl(link: string): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(link, { signal: controller.signal })
    if (!response.ok) return null

    const html = await response.text()
    return extractOgImage(html)
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}
