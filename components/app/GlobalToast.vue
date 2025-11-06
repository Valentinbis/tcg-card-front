<script setup lang="ts">
import { useToastStore } from '~/stores/toast';

const toastStore = useToastStore();

const toastClasses = {
  success: 'bg-green-50 border-green-500 text-green-900',
  info: 'bg-blue-50 border-blue-500 text-blue-900',
  warn: 'bg-yellow-50 border-yellow-500 text-yellow-900',
  error: 'bg-red-50 border-red-500 text-red-900',
};

const toastIcons = {
  success: 'mdi mdi-check-circle text-green-600',
  info: 'mdi mdi-information text-blue-600',
  warn: 'mdi mdi-alert text-yellow-600',
  error: 'mdi mdi-alert-circle text-red-600',
};
</script>

<template>
  <div class="toast-container fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="[
          'toast-item',
          'min-w-[320px] max-w-[480px]',
          'rounded-lg shadow-lg',
          'p-4 flex items-start gap-3',
          'border-l-4',
          toastClasses[toast.severity]
        ]"
      >
        <i :class="[toastIcons[toast.severity], 'text-xl mt-0.5']" />
        
        <div class="flex-1">
          <h4 class="font-semibold mb-1">{{ toast.summary }}</h4>
          <p v-if="toast.detail" class="text-sm opacity-90">{{ toast.detail }}</p>
        </div>

        <button
          @click="toastStore.remove(toast.id)"
          class="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="mdi mdi-close text-xl" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
