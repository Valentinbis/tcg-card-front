<script setup lang="ts">
import type { WishlistItem } from '~/types/api';

definePageMeta({
  middleware: 'auth',
});

const {
  wishlistItems,
  isLoading,
  fetchWishlist,
  removeFromWishlist,
  fetchWishlistStats,
  wishlistStats,
} = useWishlist();

const filters = ref({
  minPriority: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  orderBy: 'priority' as 'priority' | 'createdAt' | 'maxPrice',
  direction: 'DESC' as 'ASC' | 'DESC',
});

const selectedItem = ref<WishlistItem | null>(null);
const showEditDialog = ref(false);
const editForm = ref({
  priority: 0,
  notes: '',
  maxPrice: undefined as number | undefined,
});

// Chargement initial
onMounted(async () => {
  await Promise.all([fetchWishlist(filters.value), fetchWishlistStats()]);
});

// Filtre de recherche
const applyFilters = async () => {
  await fetchWishlist(filters.value);
};

const resetFilters = async () => {
  filters.value = {
    minPriority: undefined,
    maxPrice: undefined,
    orderBy: 'priority',
    direction: 'DESC',
  };
  await fetchWishlist(filters.value);
};

// Édition d'un élément
const openEditDialog = (item: WishlistItem) => {
  selectedItem.value = item;
  editForm.value = {
    priority: item.priority,
    notes: item.notes || '',
    maxPrice: item.maxPrice,
  };
  showEditDialog.value = true;
};

const saveEdit = async () => {
  if (!selectedItem.value) return;

  const { updateWishlistItem } = useWishlist();
  await updateWishlistItem(selectedItem.value.cardId, editForm.value);

  showEditDialog.value = false;
  await fetchWishlist(filters.value);
};

// Suppression d'un élément
const confirmDelete = async (item: WishlistItem) => {
  const confirm = window.confirm(`Remove "${item.cardId}" from wishlist?`);
  if (confirm) {
    await removeFromWishlist(item.cardId);
    await fetchWishlistStats();
  }
};

// Priorités
const priorityOptions = [
  { label: 'Low (0)', value: 0 },
  { label: 'Medium (1)', value: 1 },
  { label: 'High (2)', value: 2 },
  { label: 'Very High (3)', value: 3 },
  { label: 'Critical (5)', value: 5 },
];

const getPriorityLabel = (priority: number) => {
  const option = priorityOptions.find(o => o.value === priority);
  return option?.label || `Priority ${priority}`;
};

const getPriorityColor = (priority: number) => {
  if (priority >= 5) return 'bg-red-500';
  if (priority >= 3) return 'bg-orange-500';
  if (priority >= 2) return 'bg-yellow-500';
  if (priority >= 1) return 'bg-blue-500';
  return 'bg-gray-400';
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">My Wishlist</h1>

      <!-- Statistiques -->
      <div v-if="wishlistStats" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <template #content>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ wishlistStats.total }}</div>
              <div class="text-sm text-gray-600">Total Cards</div>
            </div>
          </template>
        </Card>

        <Card>
          <template #content>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">
                {{ Object.keys(wishlistStats.byPriority).length }}
              </div>
              <div class="text-sm text-gray-600">Priority Levels</div>
            </div>
          </template>
        </Card>

        <Card>
          <template #content>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">
                {{ wishlistStats.byPriority[5] || 0 }}
              </div>
              <div class="text-sm text-gray-600">High Priority</div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Filtres -->
      <Card class="mb-6">
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Min Priority</label>
              <InputNumber
                v-model="filters.minPriority"
                :min="0"
                :max="5"
                placeholder="Any"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Max Price</label>
              <InputNumber
                v-model="filters.maxPrice"
                :min="0"
                mode="currency"
                currency="USD"
                placeholder="Any"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Sort By</label>
              <Select
                v-model="filters.orderBy"
                :options="[
                  { label: 'Priority', value: 'priority' },
                  { label: 'Date Added', value: 'createdAt' },
                  { label: 'Max Price', value: 'maxPrice' },
                ]"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Direction</label>
              <Select
                v-model="filters.direction"
                :options="[
                  { label: 'Descending', value: 'DESC' },
                  { label: 'Ascending', value: 'ASC' },
                ]"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex gap-2 mt-4">
            <Button label="Apply Filters" @click="applyFilters" />
            <Button label="Reset" severity="secondary" @click="resetFilters" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Liste des cartes -->
    <div v-if="isLoading" class="text-center py-12">
      <ProgressSpinner />
    </div>

    <div v-else-if="wishlistItems.length === 0" class="text-center py-12">
      <Message severity="info">
        <p class="text-lg">Your wishlist is empty</p>
        <p class="text-sm mt-2">Start adding cards you want to collect!</p>
      </Message>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <Card v-for="item in wishlistItems" :key="item.id" class="hover:shadow-lg transition-shadow">
        <template #content>
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Image de la carte (placeholder) -->
            <div
              class="w-full md:w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <span class="text-gray-500">{{ item.cardId }}</span>
            </div>

            <!-- Détails -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold">{{ item.cardId }}</h3>
                  <div class="flex items-center gap-2 mt-2">
                    <span
                      class="px-3 py-1 rounded-full text-white text-sm font-medium"
                      :class="getPriorityColor(item.priority)"
                    >
                      {{ getPriorityLabel(item.priority) }}
                    </span>
                    <span v-if="item.maxPrice" class="text-sm text-gray-600">
                      Max: ${{ item.maxPrice }}
                    </span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <Button
                    icon="pi pi-pencil"
                    severity="info"
                    text
                    rounded
                    @click="openEditDialog(item)"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                    @click="confirmDelete(item)"
                  />
                </div>
              </div>

              <div v-if="item.notes" class="bg-gray-50 p-3 rounded-lg mb-3">
                <p class="text-sm text-gray-700">{{ item.notes }}</p>
              </div>

              <div class="flex gap-4 text-xs text-gray-500">
                <span>Added: {{ new Date(item.createdAt).toLocaleDateString() }}</span>
                <span>Updated: {{ new Date(item.updatedAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Dialog d'édition -->
    <Dialog
      v-model:visible="showEditDialog"
      header="Edit Wishlist Item"
      :modal="true"
      class="w-full md:w-1/2"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Priority</label>
          <Select
            v-model="editForm.priority"
            :options="priorityOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Max Price</label>
          <InputNumber
            v-model="editForm.maxPrice"
            :min="0"
            mode="currency"
            currency="USD"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Notes</label>
          <Textarea
            v-model="editForm.notes"
            rows="4"
            class="w-full"
            placeholder="Add notes about this card..."
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" @click="showEditDialog = false" />
        <Button label="Save" @click="saveEdit" />
      </template>
    </Dialog>
  </div>
</template>
