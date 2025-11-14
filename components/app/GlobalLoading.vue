<script setup lang="ts">
import { useLoadingStore } from '~/stores/loading';

const loadingStore = useLoadingStore();
const isAnyLoading = computed(() => loadingStore.isAnyLoading());
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isAnyLoading"
      class="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[9999] fade-in"
    >
      <div class="flex flex-col items-center scale-in">
        <div
          class="w-12 h-12 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin"
        />
        <p class="mt-4 text-white font-medium">Chargement...</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transition pour l'apparition/disparition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
