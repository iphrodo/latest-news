<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatRelativeTime } from '../utils/relativeTime'

const props = defineProps<{
  id: string
  title: string
  excerpt: string
  publishedAt: string
  link: string
  imageUrl: string | null
  source: string
  categoryLabel?: string
  read: boolean
  dimRead: boolean
  expanded: boolean
  thumbSize: number
  clampLines: number
}>()

const emit = defineEmits<{
  tap: []
}>()

const TINTS = ['var(--color-accent-200)', 'var(--color-accent-2-200)', 'var(--color-neutral-300)', 'var(--color-accent-100)']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

const tint = computed(() => TINTS[hashString(props.id) % TINTS.length])
const initial = computed(() => (props.source.match(/[A-Za-z]/)?.[0] ?? props.source[0] ?? '?').toUpperCase())

const minutesOld = computed(() => Math.max(0, Math.round((Date.now() - new Date(props.publishedAt).getTime()) / 60000)))
const isRecent = computed(() => minutesOld.value <= 30)
const relativeTime = computed(() => formatRelativeTime(props.publishedAt))
const isFresh = computed(() => isRecent.value && !props.read)

const imageFailedToLoad = ref(false)

function onTap() {
  emit('tap')
}

function stop(event: Event) {
  event.stopPropagation()
}
</script>

<template>
  <article
    class="news-card"
    :class="{ 'news-card--expanded': expanded }"
    :style="{
      opacity: read && dimRead && !expanded ? 0.62 : 1,
      boxShadow: read ? 'none' : 'var(--shadow-sm)',
      background: expanded ? 'var(--color-accent-100)' : 'var(--color-surface)',
    }"
    @click="onTap"
  >
    <div class="news-card__thumb" :style="{ width: `${thumbSize}px`, height: `${thumbSize}px`, background: tint }">
      <img
        v-if="imageUrl && !imageFailedToLoad"
        class="news-card__thumb-image"
        :src="imageUrl"
        :alt="title"
        loading="lazy"
        @error="imageFailedToLoad = true"
      />
      <span v-else class="news-card__thumb-initial">{{ initial }}</span>
    </div>

    <div class="news-card__body">
      <div class="news-card__title-row">
        <span v-if="isFresh" class="news-card__dot" aria-hidden="true" />
        <h3 class="news-card__title" :style="{ fontWeight: read ? 600 : 800 }">{{ title }}</h3>
      </div>

      <p class="news-card__summary" :style="{ WebkitLineClamp: expanded ? 'unset' : String(clampLines) }">
        {{ excerpt }}
      </p>

      <div class="news-card__meta">
        <span class="news-card__time" :style="{ color: isRecent ? 'var(--color-accent-700)' : 'var(--color-neutral-600)' }">
          {{ relativeTime }}
        </span>
        <span class="news-card__meta-dot" aria-hidden="true" />
        <span>{{ source }}</span>
        <span v-if="categoryLabel" class="news-card__category">{{ categoryLabel }}</span>
        <span v-if="read" class="news-card__read-check" aria-label="Read">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12l5 5L20 6" />
          </svg>
        </span>
      </div>

      <div v-if="expanded" class="news-card__open-row">
        <a class="news-card__open-link" :href="link" target="_blank" rel="noopener" @click="stop">
          Open on {{ source }}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17 17 7" /><path d="M8 7h9v9" />
          </svg>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.news-card {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 13px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
}

.news-card__thumb {
  flex: none;
  border-radius: var(--radius-thumb);
  overflow: hidden;
  position: relative;
  display: grid;
  place-items: center;
  filter: saturate(0.8);
}

.news-card__thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-card__thumb-initial {
  font-family: var(--font-heading);
  font-size: 21px;
  color: var(--color-neutral-700);
  opacity: 0.55;
}

.news-card__body {
  flex: 1;
  min-width: 0;
}

.news-card__title-row {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.news-card__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  flex: none;
  transform: translateY(-2px);
}

.news-card__title {
  margin: 0;
  font-family: var(--font-body);
  font-size: 16.5px;
  line-height: 1.28;
  letter-spacing: -0.1px;
  color: var(--color-text);
}

.news-card__summary {
  margin: 5px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: var(--color-neutral-700);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 9px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-neutral-600);
}

.news-card__meta-dot {
  width: 3px;
  height: 3px;
  border-radius: var(--radius-pill);
  background: var(--color-neutral-400);
}

.news-card__category {
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: var(--color-accent-2-100);
  color: var(--color-accent-2-700);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.news-card__read-check {
  margin-left: auto;
  display: flex;
  align-items: center;
  color: var(--color-accent-2-700);
}

.news-card__open-row {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-divider);
}

.news-card__open-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}
</style>
