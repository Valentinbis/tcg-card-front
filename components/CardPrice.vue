<script setup lang="ts">
import { usePricing } from '~/composables/usePricing';
import { usePriceService } from '~/composables/usePriceService';
import type { Card } from '~/types/card';

import type { PriceData } from '~/composables/usePriceService';

interface Props {
  card: Card;
  showRange?: boolean;
  compact?: boolean;
  autoFetch?: boolean;
  showLanguageSelector?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showRange: false,
  compact: false,
  autoFetch: false,
  showLanguageSelector: true,
});

const { formatPrice, getCurrentValue } = usePricing();
const { fetchCardPrices, getEstimatedPrice } = usePriceService();
const priceData = ref<PriceData | null>(null);
const selectedLanguage = ref<'fr' | 'en' | 'jp'>('en');

// Récupération automatique des prix si demandé
onMounted(async () => {
  if (props.autoFetch && props.card.id) {
    try {
      const data = await fetchCardPrices(String(props.card.id));
      priceData.value = data;
    } catch (err) {
      console.error('Erreur récupération prix:', err);
    }
  }
});

const currentPrice = computed(() => {
  if (priceData.value && priceData.value[selectedLanguage.value]) {
    return priceData.value[selectedLanguage.value]?.marketPrice;
  }
  return (
    getCurrentValue(props.card) ??
    (props.card.rarity
      ? priceData.value && getEstimatedPrice(props.card.rarity)[selectedLanguage.value]?.marketPrice
      : undefined)
  );
});

const priceRange = computed(() => {
  if (priceData.value && priceData.value[selectedLanguage.value]) {
    const langData = priceData.value[selectedLanguage.value];
    if (langData && langData.lowPrice !== undefined && langData.highPrice !== undefined) {
      return {
        low: langData.lowPrice,
        high: langData.highPrice,
      };
    }
  }
  return null;
});

const availableLanguages = computed(() => {
  if (!priceData.value) return ['en'];
  return Object.keys(priceData.value).filter(
    lang => priceData.value && priceData.value[lang]?.marketPrice
  );
});
</script>

<template>
  <div class="price-display">
    <!-- Sélecteur de langue -->
    <div
      v-if="showLanguageSelector && availableLanguages.length > 1"
      class="language-selector mb-2"
    >
      <select
        v-model="selectedLanguage"
        class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
      >
        <option v-for="lang in availableLanguages" :key="lang" :value="lang">
          {{ lang.toUpperCase() }}
        </option>
      </select>
    </div>

    <!-- Prix actuel -->
    <div v-if="currentPrice" class="current-price">
      <span class="price-value text-lg font-bold text-green-600 dark:text-green-400">
        {{ formatPrice(currentPrice) }}
      </span>
      <span v-if="!compact" class="price-label text-sm text-gray-500 dark:text-gray-400 ml-1">
        ({{ selectedLanguage.toUpperCase() }})
      </span>
    </div>

    <!-- Fourchette de prix -->
    <div v-if="showRange && priceRange" class="price-range mt-1">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Entre {{ formatPrice(priceRange.low) }} et {{ formatPrice(priceRange.high) }}
      </span>
    </div>

    <!-- Prix estimé si pas de prix réel -->
    <div v-if="!currentPrice && card.rarity" class="estimated-price">
      <span class="text-sm text-orange-600 dark:text-orange-400">
        Prix estimé:
        {{
          formatPrice(
            card.rarity ? getEstimatedPrice(card.rarity)[selectedLanguage]?.marketPrice || 0 : 0
          )
        }}
      </span>
    </div>

    <!-- Dernière mise à jour -->
    <div v-if="priceData && priceData.lastUpdated && !compact" class="last-updated mt-1">
      <span class="text-xs text-gray-400 dark:text-gray-500">
        Mis à jour: {{ new Date(priceData.lastUpdated).toLocaleDateString('fr-FR') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.price-display {
  display: flex;
  flex-direction: column;
}

.current-price {
  display: flex;
  align-items: baseline;
}

.price-range {
  font-size: 0.875rem;
}
</style>
