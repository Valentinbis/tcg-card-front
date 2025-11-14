<script setup lang="ts">
import type { CollectionItem } from '~/types/collection';
import { usePricing } from '~/composables/usePricing';

interface Props {
  item: CollectionItem;
  showProfitLoss?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showProfitLoss: true,
  compact: false,
});

const { formatPrice, calculateProfitLoss, getProfitLossColor, getProfitLossBadge } = usePricing();

const profitData = computed(() => calculateProfitLoss(props.item));
const badgeInfo = computed(() => {
  if (!profitData.value?.profitLossPercentage) return null;
  return getProfitLossBadge(profitData.value.profitLossPercentage);
});
</script>

<template>
  <div class="collection-value">
    <!-- Valeur actuelle -->
    <div class="current-value">
      <span class="value-amount text-lg font-bold text-green-600 dark:text-green-400">
        {{ formatPrice(profitData?.currentValue) }}
      </span>
      <span v-if="!compact" class="value-label text-sm text-gray-500 dark:text-gray-400 ml-1">
        (valeur actuelle)
      </span>
    </div>

    <!-- Prix d'achat -->
    <div v-if="item.purchasePrice && !compact" class="purchase-price mt-1">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Acheté: {{ formatPrice(item.purchasePrice) }} × {{ item.quantity }} =
        {{ formatPrice(item.purchasePrice * item.quantity) }}
      </span>
    </div>

    <!-- Profit/Perte -->
    <div v-if="showProfitLoss && profitData" class="profit-loss mt-2">
      <div class="flex items-center gap-2">
        <Badge
          v-if="badgeInfo"
          :value="formatPrice(Math.abs(profitData.profitLoss))"
          :severity="badgeInfo.severity"
          class="profit-badge"
        />
        <span
          :class="[
            'profit-percentage font-medium',
            getProfitLossColor(profitData.profitLossPercentage),
          ]"
        >
          ({{ profitData.profitLossPercentage > 0 ? '+' : ''
          }}{{ profitData.profitLossPercentage.toFixed(1) }}%)
        </span>
      </div>
    </div>

    <!-- Condition -->
    <div v-if="item.condition && !compact" class="condition mt-1">
      <Badge
        :value="item.condition.replace('_', ' ').toUpperCase()"
        severity="info"
        class="condition-badge"
      />
    </div>
  </div>
</template>

<style scoped>
.collection-value {
  display: flex;
  flex-direction: column;
}

.profit-badge {
  font-size: 0.75rem;
}

.profit-percentage {
  font-size: 0.875rem;
}

.condition-badge {
  font-size: 0.75rem;
}
</style>
