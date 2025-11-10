<script setup lang="ts">
import { useLoadingStore } from '~/stores/loading';

const loadingStore = useLoadingStore();
const isAnyLoading = computed(() => loadingStore.isAnyLoading());
</script>

<template>
  <Transition name="fade">
    <div v-if="isAnyLoading" class="global-loading-overlay fade-in">
      <div class="loading-spinner scale-in">
        <div class="spinner spin" />
        <p class="mt-4 text-white font-medium">Chargement...</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
}

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
