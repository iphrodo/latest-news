<script setup lang="ts">
export interface CategoryTab {
  slug: string
  label: string
}

defineProps<{
  tabs: CategoryTab[]
  activeSlug: string
  unreadCounts: Record<string, number>
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
      class="category-tabs__pill"
      :class="{ 'category-tabs__pill--active': tab.slug === activeSlug }"
      @click="emit('select', tab.slug)"
    >
      <span>{{ tab.label }}</span>
      <span v-if="(unreadCounts[tab.slug] ?? 0) > 0" class="category-tabs__badge">
        {{ unreadCounts[tab.slug] }}
      </span>
    </button>
  </nav>
</template>

<style scoped>
.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tabs__pill {
  flex: none;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 15px;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  border: 1.5px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-text);
}

.category-tabs__pill--active {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.category-tabs__badge {
  font-size: 11.5px;
  font-weight: 700;
  min-width: 19px;
  height: 19px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
  display: grid;
  place-items: center;
  background: var(--color-accent-200);
  color: var(--color-accent-700);
}

.category-tabs__pill--active .category-tabs__badge {
  background: rgba(255, 246, 236, 0.26);
  color: var(--color-on-accent);
}
</style>
