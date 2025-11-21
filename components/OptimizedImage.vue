<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :class="className"
    :width="width"
    :height="height"
    :quality="quality"
    :format="format"
    loading="lazy"
    decoding="async"
    :placeholder="placeholder"
    @error="handleError"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  placeholder?: boolean | number;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  quality: 80,
  format: 'webp',
  placeholder: 10, // Low quality placeholder pendant chargement
});

const handleError = (event: Event | string) => {
  // Placeholder en cas d'erreur de chargement
  if (event instanceof Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/placeholder-card.png'; // Optionnel: créer un placeholder
  }
  console.warn(`Failed to load image: ${props.src}`);
};
</script>
