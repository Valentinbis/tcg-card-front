<template>
  <div class="collection-page">
    <div class="collection-header">
      <h1>Ma Collection</h1>
      <div class="header-actions">
        <ViewModeToggle />
        <Button
          label="Stats par set"
          icon="pi pi-chart-bar"
          outlined
          @click="navigateTo('/app/collection-stats')"
        />
      </div>
    </div>

    <div v-if="stats" class="collection-stats">
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <span class="stat-label">Cartes totales</span>
            <span class="stat-value">{{ stats.totalCards }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <span class="stat-label">Cartes uniques</span>
            <span class="stat-value">{{ stats.uniqueCards }}</span>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <span class="stat-label">Valeur totale</span>
            <span class="stat-value">{{ formatPrice(stats.totalValue) }}</span>
          </div>
        </template>
      </Card>
    </div>

    <div class="collection-filters">
      <div class="filter-group">
        <label for="condition-filter">État</label>
        <Dropdown
          id="condition-filter"
          v-model="selectedCondition"
          :options="conditionOptions"
          option-label="label"
          option-value="value"
          placeholder="Tous les états"
          show-clear
          @change="applyFilters"
        />
      </div>
      <div class="filter-group">
        <label for="quantity-filter">Quantité min.</label>
        <InputNumber
          id="quantity-filter"
          v-model="minQuantity"
          :min="1"
          placeholder="Min"
          @input="applyFilters"
        />
      </div>
    </div>

    <ProgressBar v-if="loading" mode="indeterminate" class="loading-bar" />

    <div v-if="!loading && collection.length === 0" class="empty-state">
      <i class="pi pi-inbox" style="font-size: 3rem; color: var(--text-color-secondary)" />
      <p>Votre collection est vide</p>
      <Button label="Parcourir les cartes" @click="navigateTo('/app/cards')" />
    </div>

    <div v-else :class="['collection-container', `view-${viewMode}`]">
      <Card v-for="item in collection" :key="item.cardId" class="collection-card">
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
                <span class="label">Quantité:</span>
                <Badge :value="item.quantity" severity="info" />
              </div>
              <div v-if="item.condition" class="detail-row">
                <span class="label">État:</span>
                <Tag
                  :value="getConditionLabel(item.condition)"
                  :severity="getConditionSeverity(item.condition)"
                />
              </div>
              <div v-if="item.purchasePrice" class="detail-row">
                <span class="label">Prix d'achat:</span>
                <span class="value">{{ formatPrice(item.purchasePrice) }}</span>
              </div>
              <div v-if="item.languages && item.languages.length > 0" class="detail-row">
                <span class="label">Langues:</span>
                <div class="languages">
                  <Tag
                    v-for="lang in item.languages"
                    :key="lang"
                    :value="lang"
                    severity="secondary"
                  />
                </div>
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
      header="Modifier la carte"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div v-if="editingItem" class="edit-form">
        <div class="field">
          <label for="quantity">Quantité</label>
          <InputNumber id="quantity" v-model="editingItem.quantity" :min="1" />
        </div>
        <div class="field">
          <label for="condition">État</label>
          <Dropdown
            id="condition"
            v-model="editingItem.condition"
            :options="conditionOptions"
            option-label="label"
            option-value="value"
            placeholder="Sélectionner un état"
          />
        </div>
        <div class="field">
          <label for="price">Prix d'achat</label>
          <InputNumber
            id="price"
            v-model="editingItem.purchasePrice"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
          />
        </div>
        <div class="field">
          <label for="notes">Notes</label>
          <Textarea id="notes" v-model="editingItem.notes" rows="3" />
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
      <p>Êtes-vous sûr de vouloir retirer cette carte de votre collection ?</p>
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

<script setup lang="ts">
import type { CollectionItem } from '~/composables/useCollection';
import { useViewMode } from '~/composables/useViewMode';

definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

const { viewMode } = useViewMode();

const {
  collection,
  stats,
  loading,
  fetchCollection,
  fetchStats,
  updateCollectionItem,
  removeFromCollection,
} = useCollection();

const selectedCondition = ref<string | null>(null);
const minQuantity = ref<number | null>(null);

const editDialogVisible = ref(false);
const removeDialogVisible = ref(false);
const editingItem = ref<CollectionItem | null>(null);
const itemToRemove = ref<CollectionItem | null>(null);

const conditionOptions = [
  { label: 'Mint', value: 'mint' },
  { label: 'Near Mint', value: 'near_mint' },
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Light Played', value: 'light_played' },
  { label: 'Played', value: 'played' },
  { label: 'Poor', value: 'poor' },
];

const applyFilters = () => {
  const filters: { condition?: string; minQuantity?: number } = {};

  if (selectedCondition.value) {
    filters.condition = selectedCondition.value;
  }
  if (minQuantity.value) {
    filters.minQuantity = minQuantity.value;
  }

  fetchCollection(filters);
};

const openEditDialog = (item: CollectionItem) => {
  editingItem.value = { ...item };
  editDialogVisible.value = true;
};

const confirmRemove = (item: CollectionItem) => {
  itemToRemove.value = item;
  removeDialogVisible.value = true;
};

const saveEdit = async () => {
  if (!editingItem.value) return;

  await updateCollectionItem(editingItem.value.cardId, {
    quantity: editingItem.value.quantity,
    condition: editingItem.value.condition,
    purchasePrice: editingItem.value.purchasePrice,
    notes: editingItem.value.notes,
  });

  editDialogVisible.value = false;
  editingItem.value = null;
};

const performRemove = async () => {
  if (!itemToRemove.value) return;

  await removeFromCollection(itemToRemove.value.cardId);

  removeDialogVisible.value = false;
  itemToRemove.value = null;

  // Rafraîchir les stats
  await fetchStats();
};

const getConditionLabel = (condition: string): string => {
  const option = conditionOptions.find(opt => opt.value === condition);
  return option?.label || condition;
};

const getConditionSeverity = (condition: string): string => {
  const severityMap: Record<string, string> = {
    mint: 'success',
    near_mint: 'success',
    excellent: 'info',
    good: 'info',
    light_played: 'warning',
    played: 'warning',
    poor: 'danger',
  };
  return severityMap[condition] || 'secondary';
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/images/card-placeholder.png';
};

onMounted(async () => {
  await Promise.all([fetchCollection(), fetchStats()]);
});
</script>

<style scoped>
.collection-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.collection-header h1 {
  font-size: 2rem;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.collection-stats {
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

.collection-filters {
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

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.collection-card :deep(.p-card-header img) {
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

.languages {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
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
.collection-container.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.collection-container.view-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.collection-container.view-list .collection-card {
  display: flex;
  flex-direction: row;
  height: auto;
  min-height: 120px;
}

.collection-container.view-list .collection-card :deep(.p-card-header) {
  flex: 0 0 120px;
  margin-right: 1rem;
}

.collection-container.view-list .collection-card :deep(.p-card-header img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collection-container.view-list .card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.collection-container.view-list .card-info h3 {
  margin-bottom: 0.5rem;
}

.collection-container.view-list .card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.collection-container.view-list .card-actions {
  flex: 0 0 auto;
  margin-top: 0;
  align-self: center;
}

.collection-container.view-compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.collection-container.view-compact .collection-card {
  padding: 0.75rem;
}

.collection-container.view-compact .collection-card :deep(.p-card-header) {
  margin-bottom: 0.5rem;
}

.collection-container.view-compact .collection-card :deep(.p-card-header img) {
  height: 80px;
  object-fit: cover;
}

.collection-container.view-compact .card-info h3 {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.collection-container.view-compact .card-details {
  gap: 0.5rem;
}

.collection-container.view-compact .detail-row {
  gap: 0.25rem;
}

.collection-container.view-compact .card-actions {
  margin-top: 0.5rem;
  gap: 0.25rem;
}

.collection-container.view-compact .card-actions .p-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>
