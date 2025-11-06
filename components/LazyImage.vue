<template>
  <img
    :src="src"
    :alt="alt"
    :class="className"
    loading="lazy"
    decoding="async"
    @error="handleError"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
});

const handleError = (event: Event) => {
  // Placeholder en cas d'erreur de chargement
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-card.png'; // Optionnel: créer un placeholder
  console.warn(`Failed to load image: ${props.src}`);
};
</script>
