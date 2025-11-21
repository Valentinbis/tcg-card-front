<script setup lang="ts">
interface Props {
  count?: number;
  viewMode?: 'grid' | 'list' | 'compact';
}

const props = withDefaults(defineProps<Props>(), {
  count: 12,
  viewMode: 'grid',
});
</script>

<template>
  <div class="skeleton-grid" :class="`view-${props.viewMode}`">
    <CardSkeleton v-for="n in props.count" :key="n" />
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  gap: 1rem;
}

.skeleton-grid.view-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.skeleton-grid.view-list {
  grid-template-columns: 1fr;
}

.skeleton-grid.view-compact {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
</style>
