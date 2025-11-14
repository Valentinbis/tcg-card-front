<script setup lang="ts">
import type { WishlistItem } from '~/types/api';
import { useViewMode } from '~/composables/useViewMode';

definePageMeta({
  middleware: 'auth',
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
const maxPriceFilter = ref<number | null>(null);
const sortBy = ref<'priority' | 'createdAt' | 'maxPrice'>('priority');
const sortDirection = ref<'ASC' | 'DESC'>('DESC');

const editDialogVisible = ref(false);
const removeDialogVisible = ref(false);
const editingItem = ref<WishlistItem | null>(null);
const itemToRemove = ref<WishlistItem | null>(null);

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
    maxPrice?: number;
    orderBy?: 'priority' | 'createdAt' | 'maxPrice';
    direction?: 'ASC' | 'DESC';
  } = {};

  if (minPriority.value !== null) {
    filters.minPriority = minPriority.value;
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
  <div class="wishlist-page">
    <div class="wishlist-header">
      <h1>Ma Wishlist</h1>
      <div class="header-actions">
        <ViewModeToggle />
      </div>
    </div>

    <div v-if="computedStats" class="wishlist-stats">
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <span class="stat-label">Cartes souhaitées</span>
            <span class="stat-value">{{ computedStats.totalCards }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <span class="stat-label">Priorité moyenne</span>
            <span class="stat-value">{{ computedStats.averagePriority }}/10</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <span class="stat-label">Budget max total</span>
            <span class="stat-value">{{ formatPrice(computedStats.totalMaxPrice) }}</span>
          </div>
        </template>
      </Card>
    </div>

    <div class="wishlist-filters">
      <div class="filter-group">
        <label for="priority-filter">Priorité min.</label>
        <InputNumber
          id="priority-filter"
          v-model="minPriority"
          :min="0"
          :max="10"
          placeholder="Min"
          @input="applyFilters"
        />
      </div>
      <div class="filter-group">
        <label for="max-price-filter">Prix max</label>
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
      <div class="filter-group">
        <label for="sort-filter">Trier par</label>
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
      <div class="filter-group">
        <label for="direction-filter">Ordre</label>
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

    <ProgressBar v-if="loading" mode="indeterminate" class="loading-bar" />

    <div v-if="!loading && wishlist.length === 0" class="empty-state">
      <i class="pi pi-heart" style="font-size: 3rem; color: var(--text-color-secondary)" />
      <p>Votre wishlist est vide</p>
      <Button label="Parcourir les cartes" @click="navigateTo('/app/cards')" />
    </div>

    <div v-else :class="['wishlist-container', `view-${viewMode}`]">
      <Card v-for="item in wishlist" :key="item.cardId" class="wishlist-card">
        <template #header>
          <img
            :src="`https://images.pokemontcg.io/${item.cardId}_hires.png`"
            :alt="item.cardId"
            @error="handleImageError"
          />
        </template>
        <template #content>
          <div class="card-info">
            <h3>{{ item.cardId }}</h3>
            <div class="card-details">
              <div class="detail-row">
                <span class="label">Priorité:</span>
                <Badge :value="item.priority" :severity="getPrioritySeverity(item.priority)" />
              </div>
              <div v-if="item.maxPrice" class="detail-row">
                <span class="label">Prix max:</span>
                <span class="value">{{ formatPrice(item.maxPrice) }}</span>
              </div>
              <div v-if="item.notes" class="detail-row">
                <span class="label">Notes:</span>
                <span class="notes">{{ item.notes }}</span>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="card-actions">
            <Button
              label="Modifier"
              icon="pi pi-pencil"
              size="small"
              text
              @click="openEditDialog(item)"
            />
            <Button
              label="Retirer"
              icon="pi pi-trash"
              severity="danger"
              size="small"
              text
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
      <div v-if="editingItem" class="edit-form">
        <div class="field">
          <label for="priority">Priorité (0-10)</label>
          <InputNumber
            id="priority"
            v-model="editingItem.priority"
            :min="0"
            :max="10"
            placeholder="Priorité"
          />
        </div>
        <div class="field">
          <label for="maxPrice">Prix maximum</label>
          <InputNumber
            id="maxPrice"
            v-model="editingItem.maxPrice"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
            placeholder="Prix maximum souhaité"
          />
        </div>
        <div class="field">
          <label for="notes">Notes</label>
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
.wishlist-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.wishlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.wishlist-header h1 {
  font-size: 2rem;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wishlist-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card :deep(.p-card-body) {
  padding: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.wishlist-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
}

.loading-bar {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state p {
  font-size: 1.125rem;
  color: var(--text-color-secondary);
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.wishlist-card :deep(.p-card-header img) {
  width: 100%;
  height: auto;
  display: block;
}

.card-info h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.detail-row .label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-weight: 500;
}

.detail-row .value {
  font-size: 0.875rem;
  color: var(--text-color);
}

.detail-row .notes {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-style: italic;
  max-width: 100%;
  word-break: break-word;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
}

/* Modes de vue */
.wishlist-container.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
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
</style>
