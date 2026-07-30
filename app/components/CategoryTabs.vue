<script setup lang="ts">
export interface CategoryTab {
  slug: string
  label: string
}

defineProps<{
  tabs: CategoryTab[]
  activeSlug: string
}>()

const emit = defineEmits<{
  select: [slug: string]
}>()
</script>

<template>
  <nav class="category-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.slug"
      type="button"
      class="category-tabs__tab"
      :class="{ 'category-tabs__tab--active': tab.slug === activeSlug }"
      @click="emit('select', tab.slug)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style scoped>
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.category-tabs__tab {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #fff;
  color: #374151;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.category-tabs__tab:hover {
  border-color: #6b21a8;
}

.category-tabs__tab--active {
  background: #6b21a8;
  border-color: #6b21a8;
  color: #fff;
}
</style>
