<script setup lang="ts">
import type { CollectionItem } from '~/composables/useCollection';
import { useViewMode } from '~/composables/useViewMode';
import CardSkeletonGrid from '~/components/CardSkeletonGrid.vue';
import CollectionStats from '~/components/CollectionStats.vue';
import CardPrice from '~/components/CardPrice.vue';

definePageMeta({
  middleware: ['auth'],
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
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);

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
  const filters: {
    condition?: string;
    minQuantity?: number;
    minPrice?: number;
    maxPrice?: number;
  } = {};

  if (selectedCondition.value) {
    filters.condition = selectedCondition.value;
  }
  if (minQuantity.value) {
    filters.minQuantity = minQuantity.value;
  }
  if (minPrice.value !== null) {
    filters.minPrice = minPrice.value;
  }
  if (maxPrice.value !== null) {
    filters.maxPrice = maxPrice.value;
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

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl text-gray-800 dark:text-gray-100">Ma Collection</h1>
      <div class="flex items-center gap-2">
        <ViewModeToggle />
        <Button
          label="Stats par set"
          icon="pi pi-chart-bar"
          outlined
          @click="navigateTo('/app/collection-stats')"
        />
      </div>
    </div>

    <CollectionStats v-if="stats" :stats="stats" :loading="loading" class="mb-8" />

    <div class="flex gap-4 mb-8 flex-wrap">
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="condition-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >État</label
        >
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
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="quantity-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Quantité min.</label
        >
        <InputNumber
          id="quantity-filter"
          v-model="minQuantity"
          :min="1"
          placeholder="Min"
          @input="applyFilters"
        />
      </div>
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="min-price-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Prix min.</label
        >
        <InputNumber
          id="min-price-filter"
          v-model="minPrice"
          :min="0"
          placeholder="Min €"
          @input="applyFilters"
        />
      </div>
      <div class="flex flex-col gap-2 min-w-[200px]">
        <label for="max-price-filter" class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >Prix max.</label
        >
        <InputNumber
          id="max-price-filter"
          v-model="maxPrice"
          :min="0"
          placeholder="Max €"
          @input="applyFilters"
        />
      </div>
    </div>

    <ProgressBar v-if="loading" mode="indeterminate" class="mb-8" />

    <div
      v-if="!loading && collection.length === 0"
      class="text-center py-16 flex flex-col items-center gap-4"
    >
      <i class="pi pi-inbox text-6xl text-gray-400" />
      <p class="text-lg text-gray-600 dark:text-gray-400">Votre collection est vide</p>
      <Button label="Parcourir les cartes" @click="navigateTo('/app/cards')" />
    </div>

    <CardSkeletonGrid
      v-else-if="loading && collection.length === 0"
      :count="20"
      :view-mode="viewMode"
    />

    <div v-else :class="['collection-container', `view-${viewMode}`]">
      <Card v-for="item in collection" :key="item.cardId" class="collection-card">
        <template #header>
          <OptimizedImage
            :src="`https://images.pokemontcg.io/${item.cardId}_hires.png`"
            :alt="item.cardId"
            class="w-full h-auto block"
            :width="200"
            :height="280"
            :quality="85"
            @error="handleImageError"
          />
        </template>
        <template #content>
          <div class="card-info">
            <h3 class="text-lg mb-4 text-gray-800 dark:text-gray-100">{{ item.cardId }}</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Quantité:</span>
                <Badge :value="item.quantity" severity="info" />
              </div>
              <div v-if="item.condition" class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">État:</span>
                <Tag
                  :value="getConditionLabel(item.condition)"
                  :severity="getConditionSeverity(item.condition)"
                />
              </div>
              <div v-if="item.purchasePrice" class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium"
                  >Prix d'achat:</span
                >
                <span class="text-sm text-gray-800 dark:text-gray-100">{{
                  formatPrice(item.purchasePrice)
                }}</span>
              </div>

              <!-- Prix du marché -->
              <div class="mt-2">
                <CardPrice
                  :card="{
                    id: item.cardId,
                    name: item.cardId,
                    number: '001',
                    rarity: 'Common',
                    marketPrice: 15.99,
                    lowPrice: 12.5,
                    highPrice: 25.0,
                  }"
                  compact
                />
              </div>
              <div
                v-if="item.languages && item.languages.length > 0"
                class="flex items-center gap-2 flex-wrap"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Langues:</span>
                <div class="flex gap-1 flex-wrap">
                  <Tag
                    v-for="lang in item.languages"
                    :key="lang"
                    :value="lang"
                    severity="secondary"
                  />
                </div>
              </div>
              <div v-if="item.notes" class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Notes:</span>
                <span
                  class="text-sm text-gray-600 dark:text-gray-400 italic max-w-full break-words"
                  >{{ item.notes }}</span
                >
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
      <div v-if="editingItem" class="flex flex-col gap-6 pt-4">
        <div class="flex flex-col gap-2">
          <label for="quantity" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Quantité</label
          >
          <InputNumber id="quantity" v-model="editingItem.quantity" :min="1" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="condition" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >État</label
          >
          <Dropdown
            id="condition"
            v-model="editingItem.condition"
            :options="conditionOptions"
            option-label="label"
            option-value="value"
            placeholder="Sélectionner un état"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="price" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Prix d'achat</label
          >
          <InputNumber
            id="price"
            v-model="editingItem.purchasePrice"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="notes" class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Notes</label
          >
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

<style scoped>
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
</style>
