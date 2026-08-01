<script setup lang="ts">
defineProps<{
  title: string
  excerpt: string
  publishedAt: string
  link: string
  imageUrl: string | null
  source: string
}>()

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}
</script>

<template>
  <a class="news-card" :href="link" target="_blank" rel="noopener noreferrer">
    <img
      v-if="imageUrl"
      class="news-card__image"
      :src="imageUrl"
      :alt="title"
      loading="lazy"
    />
    <div v-else class="news-card__image news-card__image--placeholder" data-testid="news-card-image-placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
        <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
        <path d="M3 16l5-4 4 3 5-5 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <div class="news-card__body">
      <h2 class="news-card__title">{{ title }}</h2>
      <p class="news-card__excerpt">{{ excerpt }}</p>
      <p class="news-card__meta">
        <span class="news-card__source">{{ source }}</span>
        <time class="news-card__date" :datetime="publishedAt">{{ formatDate(publishedAt) }}</time>
      </p>
    </div>
  </a>
</template>

<style scoped>
.news-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid #e2e2e2;
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

.news-card:hover {
  border-color: #6b21a8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.news-card__image {
  flex: 0 0 auto;
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 0.5rem;
  background: #f0f0f0;
}

.news-card__image--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b3b8;
}

.news-card__image--placeholder svg {
  width: 32px;
  height: 32px;
}

.news-card__body {
  flex: 1 1 auto;
  min-width: 0;
}

.news-card__title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.news-card__excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  margin: 0 0 0.75rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #6b7280;
  font-size: 0.85rem;
}

.news-card__source {
  font-weight: 600;
  color: #374151;
}

.news-card__source::after {
  content: '·';
  margin-left: 0.5rem;
  color: #9ca3af;
  font-weight: 400;
}

@media (max-width: 480px) {
  .news-card {
    flex-direction: column;
  }

  .news-card__image {
    width: 100%;
    height: 160px;
  }
}
</style>
