<script setup lang="ts">
import type { CategoryTab } from './components/CategoryTabs.vue'
import { formatRelativeTime } from './utils/relativeTime'

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

const ALL_TAB: CategoryTab = { slug: 'all', label: 'All news' }
const TABS: CategoryTab[] = [ALL_TAB, ...CATEGORY_TABS]
const CATEGORY_SLUGS = CATEGORY_TABS.map((tab) => tab.slug)
const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(CATEGORY_TABS.map((tab) => [tab.slug, tab.label]))

useHead({
  script: [
    {
      innerHTML:
        "(function(){try{var t=localStorage.getItem('news.theme');if(t!=='light'&&t!=='dark'){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();",
      tagPosition: 'head',
    },
  ],
})

const { cache, status, loadCategories, refreshCategories, allItems } = useNewsCategories()
const { isRead, markRead, markAllRead, dimRead } = useReadState()
const { boundary } = useLastVisit()
const { density } = useDensity()
const { theme, toggleTheme } = useTheme()

const activeCategory = ref('all')
const expandedId = ref<string | null>(null)

onMounted(() => {
  loadCategories(CATEGORY_SLUGS)
})

function selectCategory(slug: string) {
  activeCategory.value = slug
  expandedId.value = null
  if (typeof window !== 'undefined') window.scrollTo(0, 0)
}

function sortedByPublishedDesc<T extends { published_at: string }>(items: T[]): T[] {
  return items.slice().sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}

const activeItems = computed(() => {
  if (activeCategory.value === 'all') return allItems.value
  return sortedByPublishedDesc(cache.value[activeCategory.value] ?? [])
})

const activeIsLoading = computed(() => {
  if (activeCategory.value === 'all') {
    return CATEGORY_SLUGS.every((slug) => !cache.value[slug]) && CATEGORY_SLUGS.some((slug) => status.value[slug] === 'pending')
  }
  return status.value[activeCategory.value] === 'pending' && !cache.value[activeCategory.value]
})

const activeHasError = computed(() => {
  if (activeCategory.value === 'all') {
    return CATEGORY_SLUGS.every((slug) => !cache.value[slug]) && CATEGORY_SLUGS.every((slug) => status.value[slug] === 'error')
  }
  return status.value[activeCategory.value] === 'error' && !cache.value[activeCategory.value]
})

const unreadCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const slug of CATEGORY_SLUGS) {
    counts[slug] = (cache.value[slug] ?? []).filter((item) => !isRead(item.id)).length
  }
  counts.all = allItems.value.filter((item) => !isRead(item.id)).length
  return counts
})

const statusLine = computed(() => {
  const unread = unreadCounts.value[activeCategory.value] ?? 0
  if (unread === 0) return 'All caught up'
  const newest = activeItems.value[0]
  return newest ? `${unread} unread · updated ${formatRelativeTime(newest.published_at)}` : `${unread} unread`
})

const footerLine = computed(() => {
  if (activeCategory.value === 'all') {
    return `${activeItems.value.length} stories from ${CATEGORY_SLUGS.length} feeds`
  }
  const tab = CATEGORY_TABS.find((t) => t.slug === activeCategory.value)
  return `${activeItems.value.length} in ${tab?.label ?? activeCategory.value}`
})

const thumbSize = computed(() => (density.value === 'compact' ? 58 : density.value === 'large' ? 96 : 76))
const clampLines = computed(() => (density.value === 'compact' ? 2 : 3))

const feedEntries = computed(() => {
  let dividerPlaced = false
  let seenNew = false
  return activeItems.value.map((item) => {
    const isNew = new Date(item.published_at).getTime() >= boundary.value
    if (isNew) seenNew = true
    const showDivider = !isNew && seenNew && !dividerPlaced
    if (showDivider) dividerPlaced = true
    return { item, showDivider }
  })
})

function handleCardTap(id: string) {
  markRead(id)
  expandedId.value = expandedId.value === id ? null : id
}

function handleMarkAllRead() {
  markAllRead(activeItems.value.map((item) => item.id))
}

const refreshing = ref(false)
const pullDistance = ref(0)
let touchStartY: number | null = null
let touchStartX: number | null = null

async function refresh() {
  if (refreshing.value) return
  refreshing.value = true
  pullDistance.value = 0
  try {
    const slugs = activeCategory.value === 'all' ? CATEGORY_SLUGS : [activeCategory.value]
    await refreshCategories(slugs)
  } finally {
    refreshing.value = false
  }
}

function onTouchStart(event: TouchEvent) {
  const target = event.target as HTMLElement | null
  const touch = event.touches[0]
  const insideRail = target?.closest('.category-tabs') != null
  if (insideRail || window.scrollY > 0 || !touch) {
    touchStartY = null
    touchStartX = null
    return
  }
  touchStartY = touch.clientY
  touchStartX = touch.clientX
}

function onTouchMove(event: TouchEvent) {
  if (touchStartY == null || touchStartX == null || refreshing.value) return
  const touch = event.touches[0]
  if (!touch) return
  const deltaY = touch.clientY - touchStartY
  const deltaX = touch.clientX - touchStartX
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Predominantly horizontal drag (e.g. swiping the category rail) — not a pull-to-refresh.
    touchStartY = null
    touchStartX = null
    pullDistance.value = 0
    return
  }
  if (deltaY > 0) pullDistance.value = Math.min(90, deltaY * 0.55)
}

function onTouchEnd() {
  if (pullDistance.value > 46) {
    refresh()
  } else {
    pullDistance.value = 0
  }
  touchStartY = null
  touchStartX = null
}

const pullHeight = computed(() => (refreshing.value ? 52 : Math.round(pullDistance.value)))
const pullLabel = computed(() => {
  if (refreshing.value) return 'Fetching new stories…'
  return pullDistance.value > 46 ? 'Release to refresh' : 'Pull to refresh'
})
</script>

<template>
  <div class="page" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <header class="header">
      <div class="header__row">
        <div class="header__titles">
          <h1 class="header__title">Latest News</h1>
          <p class="header__status">{{ statusLine }}</p>
        </div>
        <button
          type="button"
          class="header__button"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.5 14.8A8.7 8.7 0 0 1 9.2 3.5a8.7 8.7 0 1 0 11.3 11.3z" />
          </svg>
        </button>
        <button type="button" class="header__button" aria-label="Mark all read" @click="handleMarkAllRead">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 13l4 4L14 7" /><path d="M12 16l2 2 8-11" />
          </svg>
        </button>
      </div>

      <div class="header__rail">
        <CategoryTabs :tabs="TABS" :active-slug="activeCategory" :unread-counts="unreadCounts" @select="selectCategory" />
      </div>
      <div class="header__divider" />
    </header>

    <div class="pull-indicator" :style="{ height: `${pullHeight}px` }">
      <span class="pull-indicator__spinner" :class="{ 'pull-indicator__spinner--spin': refreshing }" />
      <span>{{ pullLabel }}</span>
    </div>

    <main class="feed">
      <p v-if="activeIsLoading" class="state state--loading">Loading news...</p>

      <div v-else-if="activeHasError" class="state state--error">
        <p>Failed to load news. Please try again.</p>
        <button type="button" @click="refresh">Try again</button>
      </div>

      <template v-else>
        <div v-for="entry in feedEntries" :key="entry.item.id" class="feed-entry">
          <div v-if="entry.showDivider" class="earlier-divider">
            <span class="earlier-divider__line" />
            <span class="earlier-divider__label">Earlier</span>
            <span class="earlier-divider__line" />
          </div>
          <NewsCard
            :id="entry.item.id"
            :title="entry.item.title"
            :excerpt="entry.item.excerpt"
            :published-at="entry.item.published_at"
            :link="entry.item.link"
            :image-url="entry.item.imageUrl"
            :source="entry.item.source"
            :category-label="activeCategory === 'all' ? CATEGORY_LABELS[entry.item.category] : undefined"
            :read="isRead(entry.item.id)"
            :dim-read="dimRead"
            :expanded="expandedId === entry.item.id"
            :thumb-size="thumbSize"
            :clamp-lines="clampLines"
            @tap="handleCardTap(entry.item.id)"
          />
        </div>
      </template>
    </main>

    <footer class="footer">
      <div class="footer__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 13l5 5L20 6" />
        </svg>
      </div>
      <div class="footer__heading">That's everything</div>
      <div class="footer__line">{{ footerLine }}</div>
      <button type="button" class="footer__button" @click="refresh">Check for new</button>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--color-bg);
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.page {
  min-height: 100vh;
  max-width: 440px;
  min-width: 0;
  margin: 0 auto;
  background: var(--color-bg);
  color: var(--color-text);
  padding-bottom: 44px;
  overflow-x: hidden;
}

.header {
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--color-bg);
  padding: 14px 18px 0;
}

.header__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__titles {
  flex: 1;
  min-width: 0;
}

.header__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 23px;
  line-height: 1.1;
  letter-spacing: 0.2px;
  font-weight: normal;
}

.header__status {
  margin: 2px 0 0;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-neutral-600);
}

.header__button {
  width: 44px;
  height: 44px;
  flex: none;
  border: 1.5px solid var(--color-divider);
  background: transparent;
  color: var(--color-text);
  border-radius: var(--radius-pill);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.header__rail {
  padding: 13px 18px;
  margin: 0 -18px;
}

.header__divider {
  height: 1px;
  background: var(--color-divider);
  margin: 0 -18px;
}

.pull-indicator {
  display: grid;
  place-items: center;
  overflow: hidden;
  transition: height 0.18s ease;
}

.pull-indicator__spinner {
  width: 17px;
  height: 17px;
  border-radius: var(--radius-pill);
  border: 2.5px solid var(--color-accent-300);
  border-top-color: var(--color-accent);
  display: inline-block;
}

.pull-indicator__spinner--spin {
  animation: spin 0.8s linear infinite;
}

.pull-indicator span {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-neutral-600);
}

.feed {
  padding: 14px 14px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.earlier-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 6px 4px;
}

.earlier-divider__line {
  height: 1px;
  flex: 1;
  background: var(--color-divider);
}

.earlier-divider__label {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-neutral-600);
}

.state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--color-neutral-600);
}

.state--error button {
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  border: 1.5px solid var(--color-divider);
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  cursor: pointer;
  font-size: 0.95rem;
}

.footer {
  text-align: center;
  padding: 30px 24px 10px;
  color: var(--color-neutral-600);
}

.footer__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--color-accent-2-200);
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
}

.footer__heading {
  font-family: var(--font-heading);
  font-size: 17px;
  color: var(--color-text);
}

.footer__line {
  font-size: 13px;
  margin-top: 5px;
}

.footer__button {
  margin-top: 16px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-divider);
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}
</style>
