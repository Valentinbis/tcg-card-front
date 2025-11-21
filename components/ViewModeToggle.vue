<script setup lang="ts">
import { useViewMode } from '~/composables/useViewMode';

const { viewMode, setViewMode, cycleViewMode } = useViewMode();

const viewOptions = [
  { value: 'grid', label: 'Grille', icon: 'pi pi-th-large' },
  { value: 'list', label: 'Liste', icon: 'pi pi-list' },
  { value: 'compact', label: 'Compact', icon: 'pi pi-th' },
] as const;
</script>

<template>
  <div class="view-mode-toggle">
    <!-- Version mobile : bouton cycle -->
    <Button
      class="md:hidden"
      :icon="viewOptions.find(opt => opt.value === viewMode)?.icon"
      severity="secondary"
      text
      rounded
      :title="`Mode actuel: ${viewOptions.find(opt => opt.value === viewMode)?.label}. Cliquez pour changer.`"
      @click="cycleViewMode"
    />

    <!-- Version desktop : boutons séparés -->
    <div class="hidden md:flex view-buttons">
      <Button
        v-for="option in viewOptions"
        :key="option.value"
        :icon="option.icon"
        :severity="viewMode === option.value ? 'info' : 'secondary'"
        :outlined="viewMode !== option.value"
        size="small"
        :title="option.label"
        @click="setViewMode(option.value)"
      />
    </div>
  </div>
</template>

<style scoped>
.view-mode-toggle {
  display: inline-flex;
  align-items: center;
}

.view-buttons {
  display: flex;
  gap: 0.25rem;
}
</style>
