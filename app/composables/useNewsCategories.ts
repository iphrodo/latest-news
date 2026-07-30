interface NewsItem {
  title: string
  excerpt: string
  publishedAt: string
  link: string
  imageUrl: string | null
}

type CategoryStatus = 'idle' | 'pending' | 'error'

const cache = ref<Record<string, NewsItem[]>>({})
const status = ref<Record<string, CategoryStatus>>({})

export function useNewsCategories() {
  async function loadCategory(slug: string) {
    if (cache.value[slug]) return

    status.value[slug] = 'pending'

    try {
      const items = await $fetch<NewsItem[]>(`/api/news/${slug}`)
      cache.value[slug] = items
      status.value[slug] = 'idle'
    } catch {
      status.value[slug] = 'error'
    }
  }

  return { cache, status, loadCategory }
}
