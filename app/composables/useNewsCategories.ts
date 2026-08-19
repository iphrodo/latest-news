export interface NewsItem {
  id: string
  title: string
  excerpt: string
  published_at: string
  link: string
  imageUrl: string | null
  source: string
  category: string
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

  function loadCategories(slugs: string[]) {
    return Promise.all(slugs.map((slug) => loadCategory(slug)))
  }

  async function refreshCategory(slug: string): Promise<NewsItem[]> {
    try {
      const items = await $fetch<NewsItem[]>(`/api/news/${slug}`)
      const existingIds = new Set((cache.value[slug] ?? []).map((item) => item.id))
      const fresh = items.filter((item) => !existingIds.has(item.id))
      cache.value[slug] = [...fresh, ...(cache.value[slug] ?? [])]
      status.value[slug] = 'idle'
      return fresh
    } catch {
      // Keep whatever was already cached; a failed refresh shouldn't wipe existing items
      // or leave the caller's overall refresh() promise hanging.
      return []
    }
  }

  function refreshCategories(slugs: string[]) {
    return Promise.all(slugs.map((slug) => refreshCategory(slug)))
  }

  const allItems = computed<NewsItem[]>(() => {
    const seen = new Set<string>()
    const deduped: NewsItem[] = []
    for (const item of Object.values(cache.value).flat()) {
      if (seen.has(item.id)) continue
      seen.add(item.id)
      deduped.push(item)
    }
    return deduped.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  })

  return { cache, status, loadCategory, loadCategories, refreshCategory, refreshCategories, allItems }
}
