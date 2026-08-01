import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NewsCard from './NewsCard.vue'

const baseProps = {
  title: 'Example headline',
  excerpt: 'Example excerpt',
  publishedAt: '2026-07-30T12:00:00Z',
  link: 'https://example.com/article',
  source: 'Example Source',
}

describe('NewsCard', () => {
  it('renders the real image when imageUrl is provided', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: 'https://example.com/image.jpg' },
    })

    const img = wrapper.find('img.news-card__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(wrapper.find('[data-testid="news-card-image-placeholder"]').exists()).toBe(false)
  })

  it('renders a placeholder instead of an empty block when imageUrl is null', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: null },
    })

    expect(wrapper.find('img.news-card__image').exists()).toBe(false)
    const placeholder = wrapper.find('[data-testid="news-card-image-placeholder"]')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.find('svg').exists()).toBe(true)
  })

  it('falls back to the placeholder when the image fails to load', async () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: 'https://example.com/broken.jpg' },
    })

    expect(wrapper.find('img.news-card__image').exists()).toBe(true)
    await wrapper.find('img.news-card__image').trigger('error')

    expect(wrapper.find('img.news-card__image').exists()).toBe(false)
    expect(wrapper.find('[data-testid="news-card-image-placeholder"]').exists()).toBe(true)
  })

  it('formats the publication date/time in English, independent of the runtime timezone', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: null },
    })

    expect(wrapper.find('.news-card__date').text()).toBe('30 July 2026 at 12:00')
  })

  it('renders the source name near the publication date', () => {
    const wrapper = mount(NewsCard, {
      props: { ...baseProps, imageUrl: null },
    })

    expect(wrapper.find('.news-card__source').text()).toBe('Example Source')
  })
})
