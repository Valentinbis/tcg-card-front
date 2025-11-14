<script setup lang="ts">
interface Props {
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 10,
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="n in props.count" :key="n" class="skeleton-list-item">
      <div class="skeleton-image" />
      <div class="skeleton-content">
        <div class="skeleton-title" />
        <div class="skeleton-subtitle" />
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-list-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.skeleton-image {
  width: 64px;
  height: 90px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-title {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
  width: 60%;
}

.skeleton-subtitle {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
  width: 40%;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
}

.skeleton-line.short {
  width: 70%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Dark mode support */
.dark .skeleton-list-item {
  background: #374151;
  border-color: #4b5563;
}

.dark .skeleton-image,
.dark .skeleton-title,
.dark .skeleton-subtitle,
.dark .skeleton-line {
  background: linear-gradient(90deg, #4b5563 25%, #6b7280 50%, #4b5563 75%);
  background-size: 200% 100%;
}
</style>
