<script setup lang="ts">
import type { CategoryTab } from './components/CategoryTabs.vue'

interface NewsItem {
  title: string
  excerpt: string
  publishedAt: string
  link: string
  imageUrl: string | null
}

const CATEGORY_TABS: CategoryTab[] = [
  { slug: 'epl', label: 'EPL' },
  { slug: 'artificial-intelligence', label: 'Artificial Intelligence' },
  { slug: 'technology', label: 'Technology' },
  { slug: 'finance', label: 'Finance' },
  { slug: 'gadgets', label: 'Gadgets' },
  { slug: 'digital-currencies', label: 'Digital Currencies' },
  { slug: 'playstation', label: 'Playstation' },
  { slug: 'apple', label: 'Apple' },
  { slug: 'it-jobs', label: 'IT Jobs' },
]

const { data: eplNews, pending: eplPending, error: eplError, refresh: refreshEpl } = await useFetch<NewsItem[]>('/api/news')

const { cache, status, loadCategory } = useNewsCategories()
const activeCategory = ref('epl')

function selectCategory(slug: string) {
  activeCategory.value = slug
  if (slug !== 'epl') loadCategory(slug)
}

const activeNews = computed(() => cache.value[activeCategory.value])
const activeStatus = computed(() => status.value[activeCategory.value] ?? 'idle')
</script>

<template>
  <div class="page">
    <header class="page__header">
      <h1>Останні новини</h1>
    </header>

    <CategoryTabs :tabs="CATEGORY_TABS" :active-slug="activeCategory" @select="selectCategory" />

    <main>
      <template v-if="activeCategory === 'epl'">
        <p v-if="eplPending" class="state state--loading">Завантаження новин...</p>

        <div v-else-if="eplError" class="state state--error">
          <p>Не вдалося завантажити новини. Спробуйте ще раз.</p>
          <button type="button" @click="refreshEpl()">Спробувати ще раз</button>
        </div>

        <ul v-else class="news-list">
          <li v-for="item in eplNews" :key="item.link">
            <NewsCard
              :title="item.title"
              :excerpt="item.excerpt"
              :published-at="item.publishedAt"
              :link="item.link"
              :image-url="item.imageUrl"
            />
          </li>
        </ul>
      </template>

      <template v-else>
        <p v-if="activeStatus === 'pending'" class="state state--loading">Завантаження новин...</p>

        <div v-else-if="activeStatus === 'error'" class="state state--error">
          <p>Не вдалося завантажити новини. Спробуйте ще раз.</p>
          <button type="button" @click="loadCategory(activeCategory)">Спробувати ще раз</button>
        </div>

        <ul v-else class="news-list">
          <li v-for="item in activeNews" :key="item.link">
            <NewsCard
              :title="item.title"
              :excerpt="item.excerpt"
              :published-at="item.publishedAt"
              :link="item.link"
              :image-url="item.imageUrl"
            />
          </li>
        </ul>
      </template>
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #fafafa;
  color: #111827;
}

.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.page__header h1 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}

.news-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.state {
  text-align: center;
  padding: 2rem 1rem;
  color: #4b5563;
}

.state--error button {
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  border: 1px solid #6b21a8;
  border-radius: 0.5rem;
  background: #6b21a8;
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
}

.state--error button:hover {
  background: #581c87;
}

@media (max-width: 480px) {
  .page {
    padding: 1rem 0.75rem 2rem;
  }

  .news-list {
    grid-template-columns: 1fr;
  }
}
</style>
