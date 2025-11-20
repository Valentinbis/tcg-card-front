<script setup lang="ts">
import type { WishlistItem } from '~/types/api';
import { useViewMode } from '~/composables/useViewMode';
import CardSkeletonGrid from '~/components/CardSkeletonGrid.vue';

definePageMeta({
  middleware: ['auth'],
  layout: 'default',
});

const { viewMode } = useViewMode();

const {
  wishlistItems: wishlist,
  wishlistStats: stats,
  isLoading: loading,
  fetchWishlist,
  fetchWishlistStats,
  updateWishlistItem,
  removeFromWishlist,
} = useWishlist();

const minPriority = ref<number | null>(null);
const selectedVariant = ref<'normal' | 'reverse' | 'holo' | null>(null);
const minPriceFilter = ref<number | null>(null);
const maxPriceFilter = ref<number | null>(null);
const sortBy = ref<'priority' | 'createdAt' | 'maxPrice'>('priority');
const sortDirection = ref<'ASC' | 'DESC'>('DESC');

const editDialogVisible = ref(false);
const removeDialogVisible = ref(false);
const editingItem = ref<WishlistItem | null>(null);
const itemToRemove = ref<WishlistItem | null>(null);
const showFilters = ref(false);

const sortOptions = [
  { label: 'Priorité', value: 'priority' },
  { label: "Date d'ajout", value: 'createdAt' },
  { label: 'Prix max', value: 'maxPrice' },
];

const directionOptions = [
  { label: 'Décroissant', value: 'DESC' },
  { label: 'Croissant', value: 'ASC' },
];

// Stats calculées
const computedStats = computed(() => {
  if (!stats.value) return null;

  const items = wishlist.value;
  const totalCards = stats.value.total;
  const averagePriority =
    items.length > 0
      ? Math.round((items.reduce((sum, item) => sum + item.priority, 0) / items.length) * 10) / 10
      : 0;
  const totalMaxPrice = items.reduce((sum, item) => sum + (item.maxPrice || 0), 0);

  return {
    totalCards,
    averagePriority,
    totalMaxPrice,
  };
});

const applyFilters = () => {
  const filters: {
    minPriority?: number;
    variant?: string;
    minPrice?: number;
    maxPrice?: number;
    orderBy?: 'priority' | 'createdAt' | 'maxPrice';
    direction?: 'ASC' | 'DESC';
  } = {};

  if (minPriority.value !== null) {
    filters.minPriority = minPriority.value;
  }
  if (selectedVariant.value) {
    filters.variant = selectedVariant.value;
  }
  if (minPriceFilter.value !== null) {
    filters.minPrice = minPriceFilter.value;
  }
  if (maxPriceFilter.value !== null) {
    filters.maxPrice = maxPriceFilter.value;
  }
  if (sortBy.value) {
    filters.orderBy = sortBy.value;
  }
  if (sortDirection.value) {
    filters.direction = sortDirection.value;
  }

  fetchWishlist(filters);
};

const openEditDialog = (item: WishlistItem) => {
  editingItem.value = { ...item };
  editDialogVisible.value = true;
};

const confirmRemove = (item: WishlistItem) => {
  itemToRemove.value = item;
  removeDialogVisible.value = true;
};

const saveEdit = async () => {
  if (!editingItem.value) return;

  await updateWishlistItem(editingItem.value.cardId, {
    priority: editingItem.value.priority,
    maxPrice: editingItem.value.maxPrice,
    notes: editingItem.value.notes,
  });

  editDialogVisible.value = false;
  editingItem.value = null;
};

const performRemove = async () => {
  if (!itemToRemove.value) return;

  await removeFromWishlist(itemToRemove.value.cardId);

  removeDialogVisible.value = false;
  itemToRemove.value = null;

  // Rafraîchir les stats
  await fetchWishlistStats();
};

const getPrioritySeverity = (priority: number): string => {
  if (priority >= 8) return 'success';
  if (priority >= 6) return 'info';
  if (priority >= 4) return 'warning';
  return 'danger';
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/images/card-placeholder.png';
};

onMounted(async () => {
  await Promise.all([fetchWishlist(), fetchWishlistStats()]);
});
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl text-gray-800 dark:text-gray-100">Ma Wishlist</h1>
      <div class="flex items-center gap-2">
        <ViewModeToggle />
      </div>
    </div>

    <div v-if="computedStats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Card class="stat-card">
        <template #content>
          <div class="flex flex-col gap-2 p-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">Cartes souhaitées</span>
            <span class="text-xl font-bold text-blue-600">{{ computedStats.totalCards }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="flex flex-col gap-2 p-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">Priorité moyenne</span>
            <span class="text-xl font-bold text-blue-600"
              >{{ computedStats.averagePriority }}/10</span
            >
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="flex flex-col gap-2 p-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">Budget max total</span>
            <span class="text-xl font-bold text-blue-600">{{
              formatPrice(computedStats.totalMaxPrice)
            }}</span>
          </div>
        </template>
      </Card>
    </div>

    <!-- Bouton Filtres Mobile -->
    <div class="flex justify-center sm:hidden mb-4">
      <Button
        :label="showFilters ? 'Masquer les filtres' : 'Afficher les filtres'"
        icon="pi pi-filter"
        outlined
        class="touch-manipulation transition-all duration-200"
        @click="showFilters = !showFilters"
      />
    </div>

    <div :class="['flex gap-4 mb-8 flex-wrap', showFilters ? 'block' : 'hidden sm:flex']">
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="priority-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Priorité min.</label
        >
        <InputNumber
          id="priority-filter"
          v-model="minPriority"
          :min="0"
          placeholder="Prix min"
          @input="applyFilters"
        />
      </div>
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="max-price-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Prix max</label
        >
        <InputNumber
          id="max-price-filter"
          v-model="maxPriceFilter"
          mode="currency"
          currency="EUR"
          locale="fr-FR"
          placeholder="Prix max"
          @input="applyFilters"
        />
      </div>
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="sort-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Trier par</label
        >
        <Dropdown
          id="sort-filter"
          v-model="sortBy"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          placeholder="Trier par"
          @change="applyFilters"
        />
      </div>
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="direction-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Ordre</label
        >
        <Dropdown
          id="direction-filter"
          v-model="sortDirection"
          :options="directionOptions"
          option-label="label"
          option-value="value"
          placeholder="Ordre"
          @change="applyFilters"
        />
      </div>
    </div>

    <ProgressBar v-if="loading" mode="indeterminate" class="mb-8" />

    <div
      v-if="!loading && wishlist.length === 0"
      class="text-center py-16 flex flex-col items-center gap-4"
    >
      <i class="pi pi-heart text-6xl text-gray-400" />
      <p class="text-lg text-gray-600 dark:text-gray-400">Votre wishlist est vide</p>
      <Button label="Parcourir les cartes" @click="navigateTo('/app/cards')" />
    </div>

    <CardSkeletonGrid
      v-else-if="loading && wishlist.length === 0"
      :count="20"
      :view-mode="viewMode"
    />

    <div v-else :class="['wishlist-container', `view-${viewMode}`]">
      <Card v-for="item in wishlist" :key="item.cardId" class="wishlist-card">
        <template #header>
          <OptimizedImage
            :src="item.cardImage || '/images/card-placeholder.png'"
            :alt="item.cardName || item.cardId"
            :width="200"
            :height="280"
            :quality="85"
            @error="handleImageError"
          />
        </template>
        <template #content>
          <div class="card-info">
            <h3 class="text-lg mb-4 text-gray-800 dark:text-gray-100 line-clamp-2">
              {{ item.cardName || item.cardId }}
            </h3>
            <div class="flex items-center gap-2 mb-2">
              <Badge :value="item.variant" severity="info" />
            </div>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Priorité:</span>
                <Badge :value="item.priority" :severity="getPrioritySeverity(item.priority)" />
              </div>
              <div v-if="item.maxPrice" class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Prix max:</span>
                <span class="text-sm text-gray-800 dark:text-gray-100">{{
                  formatPrice(item.maxPrice)
                }}</span>
              </div>
              <div v-if="item.notes" class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Notes:</span>
                <span
                  class="text-sm text-gray-600 dark:text-gray-400 italic max-w-full break-words"
                  >{{ item.notes }}</span
                >
              </div>
              <div v-if="item.prices" class="mt-4 space-y-2">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Cardmarket</h4>
                  <div class="text-sm">Prix : {{ item.prices.cardmarket ?? 'N/A' }} €</div>
                  <div class="text-sm">
                    Prix tendance : {{ item.prices.cardmarket_trend ?? 'N/A' }} €
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">TCGPlayer</h4>
                  <div class="text-sm">Prix : {{ item.prices.tcgplayer ?? 'N/A' }} $</div>
                  <div class="text-sm">
                    Prix marché : {{ item.prices.tcgplayer_market ?? 'N/A' }} $
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between gap-2">
            <Button
              label="Modifier"
              icon="pi pi-pencil"
              size="small"
              text
              class="touch-manipulation"
              @click="openEditDialog(item)"
            />
            <Button
              label="Retirer"
              icon="pi pi-trash"
              severity="danger"
              size="small"
              text
              class="touch-manipulation"
              @click="confirmRemove(item)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Dialog d'édition -->
    <Dialog
      v-model:visible="editDialogVisible"
      header="Modifier la carte souhaitée"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div v-if="editingItem" class="flex flex-col gap-6 pt-4">
        <div class="flex flex-col gap-2">
          <label for="priority" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Priorité (0-10)</label
          >
          <InputNumber
            id="priority"
            v-model="editingItem.priority"
            :min="0"
            :max="10"
            placeholder="Priorité"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="maxPrice" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Prix maximum</label
          >
          <InputNumber
            id="maxPrice"
            v-model="editingItem.maxPrice"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
            placeholder="Prix maximum souhaité"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="notes" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Notes</label
          >
          <Textarea
            id="notes"
            v-model="editingItem.notes"
            rows="3"
            placeholder="Notes personnelles"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" text @click="editDialogVisible = false" />
        <Button label="Enregistrer" icon="pi pi-check" :loading="loading" @click="saveEdit" />
      </template>
    </Dialog>

    <!-- Dialog de confirmation de suppression -->
    <Dialog
      v-model:visible="removeDialogVisible"
      header="Confirmer la suppression"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <p>Êtes-vous sûr de vouloir retirer cette carte de votre wishlist ?</p>
      <template #footer>
        <Button label="Annuler" icon="pi pi-times" text @click="removeDialogVisible = false" />
        <Button
          label="Supprimer"
          icon="pi pi-trash"
          severity="danger"
          :loading="loading"
          @click="performRemove"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* Modes de vue */
.wishlist-container.view-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .wishlist-container.view-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 768px) {
  .wishlist-container.view-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .wishlist-container.view-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1280px) {
  .wishlist-container.view-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.wishlist-container.view-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wishlist-container.view-list .wishlist-card {
  display: flex;
  flex-direction: row;
  height: auto;
  min-height: 120px;
}

.wishlist-container.view-list .wishlist-card :deep(.p-card-header) {
  flex: 0 0 120px;
  margin-right: 1rem;
}

.wishlist-container.view-list .wishlist-card :deep(.p-card-header img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wishlist-container.view-list .card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wishlist-container.view-list .card-info h3 {
  margin-bottom: 0.5rem;
}

.wishlist-container.view-list .card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.wishlist-container.view-list .card-actions {
  flex: 0 0 auto;
  margin-top: 0;
  align-self: center;
}

.wishlist-container.view-compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.wishlist-container.view-compact .wishlist-card {
  padding: 0.75rem;
}

.wishlist-container.view-compact .wishlist-card :deep(.p-card-header) {
  margin-bottom: 0.5rem;
}

.wishlist-container.view-compact .wishlist-card :deep(.p-card-header img) {
  height: 80px;
  object-fit: cover;
}

.wishlist-container.view-compact .card-info h3 {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.wishlist-container.view-compact .card-details {
  gap: 0.5rem;
}

.wishlist-container.view-compact .detail-row {
  gap: 0.25rem;
}

.wishlist-container.view-compact .card-actions {
  margin-top: 0.5rem;
  gap: 0.25rem;
}

.wishlist-container.view-compact .card-actions .p-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .p-8 {
    padding: 1rem;
  }

  .wishlist-container.view-grid {
    gap: 0.75rem;
  }

  .wishlist-container.view-compact {
    gap: 0.5rem;
  }

  .wishlist-card :deep(.p-card) {
    padding: 0.75rem;
  }

  .wishlist-card :deep(.p-card-header img) {
    height: 120px;
  }

  .wishlist-card :deep(.p-card-content) {
    padding: 0.5rem 0;
  }

  .wishlist-card :deep(.p-card-footer) {
    padding: 0.5rem 0 0 0;
  }

  .wishlist-container.view-list .wishlist-card :deep(.p-card-header) {
    flex: 0 0 100px;
  }

  .wishlist-container.view-compact .wishlist-card :deep(.p-card-header img) {
    height: 60px;
  }
}
</style>
