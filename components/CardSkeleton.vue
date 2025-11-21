<template>
  <Card class="pointer-events-none">
    <template #header>
      <div class="skeleton-image" />
    </template>
    <template #title>
      <div class="skeleton-title" />
    </template>
    <template #subtitle>
      <div class="skeleton-subtitle" />
    </template>
    <template #content>
      <div class="py-4">
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.skeleton-image {
  height: 280px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.5rem;
}

.skeleton-title {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.skeleton-subtitle {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
  width: 60%;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
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
.dark .skeleton-image,
.dark .skeleton-title,
.dark .skeleton-subtitle,
.dark .skeleton-line {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}
</style>
