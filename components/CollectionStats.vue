<script setup lang="ts">
import { usePricing } from '~/composables/usePricing';

interface Props {
  stats: {
    totalCards: number;
    uniqueCards: number;
    totalValue: number;
    countByCondition?: Array<{ condition: string; count: number }>;
    valueByCondition?: Array<{ condition: string; total_value: number }>;
  };
  loading?: boolean;
}

const { stats, loading = false } = defineProps<Props>();

const { formatPrice } = usePricing();
</script>

<template>
  <div class="collection-stats-grid">
    <!-- Cartes totales -->
    <Card class="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
      <template #content>
        <div class="text-center">
          <div class="text-2xl font-bold mb-1">
            {{ loading ? '...' : stats.totalCards }}
          </div>
          <div class="text-sm opacity-90">Cartes totales</div>
        </div>
      </template>
    </Card>

    <!-- Cartes uniques -->
    <Card class="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
      <template #content>
        <div class="text-center">
          <div class="text-2xl font-bold mb-1">
            {{ loading ? '...' : stats.uniqueCards }}
          </div>
          <div class="text-sm opacity-90">Cartes uniques</div>
        </div>
      </template>
    </Card>

    <!-- Valeur totale -->
    <Card class="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
      <template #content>
        <div class="text-center">
          <div class="text-2xl font-bold mb-1">
            {{ loading ? '...' : formatPrice(stats.totalValue) }}
          </div>
          <div class="text-sm opacity-90">Valeur totale</div>
        </div>
      </template>
    </Card>

    <!-- Répartition par condition -->
    <Card
      v-if="stats.countByCondition && stats.countByCondition.length > 0"
      class="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0"
    >
      <template #content>
        <div class="text-center">
          <div class="text-lg font-bold mb-1">
            {{ stats.countByCondition.length }}
          </div>
          <div class="text-sm opacity-90">Conditions différentes</div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.collection-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
</style>
