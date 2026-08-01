<script setup lang="ts">
import type { CategoryTab } from './components/CategoryTabs.vue'

interface NewsItem {
  title: string
  excerpt: string
  publishedAt: string
  link: string
  imageUrl: string | null
  source: string
}

const CATEGORY_TABS: CategoryTab[] = [
  { slug: 'epl', label: 'European Football' },
  { slug: 'football-transfers', label: 'Transfers & Rumours' },
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
      <svg class="page__logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
          fill="#f97316"
          stroke="#f97316"
          stroke-width="1.2"
          stroke-linejoin="round"
        />
      </svg>
      <h1>Latest News</h1>
    </header>

    <CategoryTabs :tabs="CATEGORY_TABS" :active-slug="activeCategory" @select="selectCategory" />

    <main>
      <template v-if="activeCategory === 'epl'">
        <p v-if="eplPending" class="state state--loading">Loading news...</p>

        <div v-else-if="eplError" class="state state--error">
          <p>Failed to load news. Please try again.</p>
          <button type="button" @click="refreshEpl()">Try again</button>
        </div>

        <ul v-else class="news-list">
          <li v-for="item in eplNews" :key="item.link">
            <NewsCard
              :title="item.title"
              :excerpt="item.excerpt"
              :published-at="item.publishedAt"
              :link="item.link"
              :image-url="item.imageUrl"
              :source="item.source"
            />
          </li>
        </ul>
      </template>

      <template v-else>
        <p v-if="activeStatus === 'pending'" class="state state--loading">Loading news...</p>

        <div v-else-if="activeStatus === 'error'" class="state state--error">
          <p>Failed to load news. Please try again.</p>
          <button type="button" @click="loadCategory(activeCategory)">Try again</button>
        </div>

        <ul v-else class="news-list">
          <li v-for="item in activeNews" :key="item.link">
            <NewsCard
              :title="item.title"
              :excerpt="item.excerpt"
              :published-at="item.publishedAt"
              :link="item.link"
              :image-url="item.imageUrl"
              :source="item.source"
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

.page__header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.page__header h1 {
  font-size: 1.6rem;
  margin: 0;
}

.page__logo {
  width: 2rem;
  height: 2rem;
  flex: 0 0 auto;
  animation: logo-pulse 2.4s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(249, 115, 22, 0));
  }
  50% {
    transform: scale(1.12);
    filter: drop-shadow(0 0 6px rgba(249, 115, 22, 0.55));
  }
}

@media (prefers-reduced-motion: reduce) {
  .page__logo {
    animation: none;
  }
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
