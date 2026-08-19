import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NewsCard from './NewsCard.vue'

const baseProps = {
  id: 'https://example.com/article',
  title: 'Example headline',
  excerpt: 'Example excerpt',
  publishedAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  link: 'https://example.com/article',
  source: 'Example Source',
  read: false,
  dimRead: true,
  expanded: false,
  thumbSize: 76,
  clampLines: 3,
}

describe('NewsCard', () => {
  it('renders the real image when imageUrl is provided', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: 'https://example.com/image.jpg' },
    })

    const img = wrapper.find('img.news-card__thumb-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(wrapper.find('.news-card__thumb-initial').exists()).toBe(false)
  })

  it('renders the source initial instead of a broken image when imageUrl is null', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: null },
    })

    expect(wrapper.find('img.news-card__thumb-image').exists()).toBe(false)
    expect(wrapper.find('.news-card__thumb-initial').text()).toBe('E')
  })

  it('falls back to the initial when the image fails to load', async () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: 'https://example.com/broken.jpg' },
    })

    expect(wrapper.find('img.news-card__thumb-image').exists()).toBe(true)
    await wrapper.find('img.news-card__thumb-image').trigger('error')

    expect(wrapper.find('img.news-card__thumb-image').exists()).toBe(false)
    expect(wrapper.find('.news-card__thumb-initial').exists()).toBe(true)
  })

  it('renders a relative time label rather than an absolute date', () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null } })
    expect(wrapper.find('.news-card__time').text()).toBe('5 min ago')
  })

  it('renders the source name near the timestamp', () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null } })
    expect(wrapper.find('.news-card__meta').text()).toContain('Example Source')
  })

  it('emits tap when the card is clicked', async () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null } })
    await wrapper.find('.news-card').trigger('click')
    expect(wrapper.emitted('tap')).toHaveLength(1)
  })

  it('shows an accent dot for unread items published under 30 minutes ago', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: null, read: false, publishedAt: new Date(Date.now() - 10 * 60_000).toISOString() },
    })
    expect(wrapper.find('.news-card__dot').exists()).toBe(true)
  })

  it('does not show the accent dot once the item is read', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: null, read: true, publishedAt: new Date(Date.now() - 10 * 60_000).toISOString() },
    })
    expect(wrapper.find('.news-card__dot').exists()).toBe(false)
  })

  it('shows a read check mark once the item is read', () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null, read: true } })
    expect(wrapper.find('.news-card__read-check').exists()).toBe(true)
  })

  it('dims a read card to ~62% opacity when dimming is enabled', () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null, read: true, dimRead: true } })
    expect((wrapper.find('.news-card').element as HTMLElement).style.opacity).toBe('0.62')
  })

  it('keeps a read card at full opacity when dimming is disabled', () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null, read: true, dimRead: false } })
    expect((wrapper.find('.news-card').element as HTMLElement).style.opacity).toBe('1')
  })

  it('shows the full summary and an open link when expanded', () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null, expanded: true } })
    const link = wrapper.find('.news-card__open-link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(baseProps.link)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener')
  })

  it('does not emit tap when the open link is clicked', async () => {
    const wrapper = mount(NewsCard, { props: { ...baseProps, imageUrl: null, expanded: true } })
    await wrapper.find('.news-card__open-link').trigger('click')
    expect(wrapper.emitted('tap')).toBeUndefined()
  })
})
