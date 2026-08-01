import { describe, expect, it } from 'vitest'
import { parseNewsFeedXml } from './rss'

function wrapItem(itemXml: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Test feed</title>
    <item>${itemXml}</item>
  </channel>
</rss>`
}

describe('parseNewsFeedXml image extraction', () => {
  it('extracts the image from media:thumbnail', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description>Excerpt</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
      <media:thumbnail url="https://example.com/thumb.jpg" />
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.imageUrl).toBe('https://example.com/thumb.jpg')
  })

  it('extracts the image from an <img> tag embedded in the description (e.g. 9to5mac)', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description><![CDATA[<div class="feat-image"><img src="https://example.com/feat.webp" /></div><p>Body</p>]]></description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.imageUrl).toBe('https://example.com/feat.webp')
  })

  it('extracts the image from an <img> tag embedded in content:encoded (e.g. PlayStation Blog)', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description>Excerpt without image</description>
      <content:encoded><![CDATA[<p>Intro</p><img decoding="async" src="https://example.com/content.jpg" alt="" /><p>More</p>]]></content:encoded>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.imageUrl).toBe('https://example.com/content.jpg')
  })

  it('ignores non-image enclosures (e.g. video/mp4) and returns null when no image is available', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description>Excerpt without image</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
      <enclosure url="https://example.com/video.mp4" type="video/mp4" />
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.imageUrl).toBeNull()
  })

  it('picks an image enclosure over a non-image enclosure when multiple are present', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description>Excerpt</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
      <enclosure url="https://example.com/video.mp4" type="video/mp4" />
      <enclosure url="https://example.com/photo.jpg" type="image/jpeg" />
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.imageUrl).toBe('https://example.com/photo.jpg')
  })

  it('extracts an image enclosure even when its type is mislabeled (e.g. Investing.com uses text/html)', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description>Excerpt</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
      <enclosure url="https://i-invdn-com.investing.com/news/photo.jpg" type="text/html; charset=UTF-8" />
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.imageUrl).toBe('https://i-invdn-com.investing.com/news/photo.jpg')
  })
})

describe('parseNewsFeedXml entity decoding', () => {
  it('decodes numeric and named HTML entities in the title and excerpt', () => {
    const xml = wrapItem(`
      <title>Apple&#8217;s modem transition &amp; Qualcomm&#8221;s response</title>
      <description>Reports &mdash; some are &ldquo;overstated&rdquo; say analysts</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.title).toBe('Apple’s modem transition & Qualcomm”s response')
    expect(item?.excerpt).toBe('Reports — some are “overstated” say analysts')
  })

  it('decodes double-encoded entities from aggregator feeds (e.g. "I&#8217;m back" instead of "I\'m back")', () => {
    const xml = wrapItem(`
      <title>Ball x Pit final update</title>
      <description>Hello! I&amp;#8217;m back for the last time (&amp;#8230;maybe) to share what&amp;#8217;s next.</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 12:00:00 +0000</pubDate>
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    expect(item?.excerpt).toBe("Hello! I’m back for the last time (…maybe) to share what’s next.")
  })
})

describe('parseNewsFeedXml publication date normalization', () => {
  it('normalizes a BST pubDate into a timestamp the Date constructor can parse', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description>Excerpt</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 16:15:00 BST</pubDate>
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    const parsed = new Date(item?.publishedAt ?? '')
    expect(Number.isNaN(parsed.getTime())).toBe(false)
    expect(parsed.toISOString()).toBe('2026-07-30T15:15:00.000Z')
  })

  it('leaves an already-standard GMT pubDate parseable and unchanged in meaning', () => {
    const xml = wrapItem(`
      <title>Title</title>
      <description>Excerpt</description>
      <link>https://example.com/a</link>
      <pubDate>Thu, 30 Jul 2026 16:15:00 GMT</pubDate>
    `)

    const [item] = parseNewsFeedXml(xml, 'Test Source')
    const parsed = new Date(item?.publishedAt ?? '')
    expect(Number.isNaN(parsed.getTime())).toBe(false)
    expect(parsed.toISOString()).toBe('2026-07-30T16:15:00.000Z')
  })
})
