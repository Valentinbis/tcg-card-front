<script setup lang="ts">
import { ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import type { Card, Pagination } from '~/types/card';
import CardSkeletonGrid from '~/components/CardSkeletonGrid.vue';
import CardSkeletonList from '~/components/CardSkeletonList.vue';

const confirm = useConfirm();
const toast = useToast();
const { removeCardFromCollection } = useUserCards();

const cards = ref<Card[]>([]);
const pagination = ref<Pagination>({
  current_page: 1,
  per_page: 20,
  total_items: 0,
  total_pages: 1,
});

const page = ref(1);
const limit = ref(20);
const viewMode = ref<'grid' | 'list'>('grid');
const loading = ref(false);
const removingCards = ref<Set<string>>(new Set());

// Filtres
const filterType = ref('');
const filterRarity = ref('');
const filterSet = ref('');
const searchQuery = ref('');
const showFilters = ref(false);

const sets = ref<Array<{ id: string; name: string }>>([]);
const filteredSets = ref<Array<{ id: string; name: string }>>([]);

const apiBase = useRuntimeConfig().public.apiBase.replace('/api/', '');

const typeOptions = [
  { label: 'Tous', value: '' },
  { label: 'Feu', value: 'Fire' },
  { label: 'Eau', value: 'Water' },
  { label: 'Plante', value: 'Grass' },
  { label: 'Électrique', value: 'Lightning' },
  { label: 'Psy', value: 'Psychic' },
  { label: 'Combat', value: 'Fighting' },
  { label: 'Obscurité', value: 'Darkness' },
  { label: 'Métal', value: 'Metal' },
  { label: 'Dragon', value: 'Dragon' },
  { label: 'Incolore', value: 'Colorless' },
];

const rarityOptions = [
  { label: 'Toutes', value: '' },
  { label: 'Common', value: 'Common' },
  { label: 'Uncommon', value: 'Uncommon' },
  { label: 'Rare', value: 'Rare' },
  { label: 'Rare Holo', value: 'Rare Holo' },
  { label: 'Ultra Rare', value: 'Ultra Rare' },
];

function searchSet(event: { query: string }) {
  const query = event.query.toLowerCase();
  filteredSets.value = sets.value.filter(set => set.name.toLowerCase().includes(query));
}

function getImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return apiBase + path;
}

const fetchSets = async () => {
  try {
    const { data } = await useAPI<{ id: string; name: string }[]>('sets', {
      method: 'GET',
      default: () => [] as { id: string; name: string }[],
    });

    if (data.value) {
      sets.value = data.value as { id: string; name: string }[];
    }
  } catch (error) {
    console.error('Erreur lors du chargement des sets:', error);
  }
};

const fetchCards = async () => {
  loading.value = true;
  try {
    const params: Record<string, string | number | boolean> = {
      page: page.value,
      limit: limit.value,
      owned: 'true', // Seulement les cartes possédées
    };
    if (filterType.value) params.type = filterType.value;
    if (filterRarity.value) params.rarity = filterRarity.value;
    if (filterSet.value) params.set = filterSet.value;
    if (searchQuery.value) params.search = searchQuery.value;

    const { data } = await useAPI<{ data: Card[]; pagination: Pagination }>('cards', {
      method: 'GET',
      default: () => ({
        data: [] as Card[],
        pagination: { current_page: 1, per_page: 20, total_items: 0, total_pages: 1 } as Pagination,
      }),
      params,
    });

    if (data.value) {
      cards.value = (data.value as { data: Card[]; pagination: Pagination }).data;
      pagination.value = (data.value as { data: Card[]; pagination: Pagination }).pagination;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des cartes:', error);
    cards.value = [];
  } finally {
    loading.value = false;
  }
};

async function confirmRemoveCard(card: Card) {
  confirm.require({
    message: `Voulez-vous vraiment retirer "${card.nameFr}" de votre collection ?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Oui, supprimer',
    rejectLabel: 'Annuler',
    acceptClass: 'p-button-danger',
    accept: () => removeCard(card),
  });
}

async function removeCard(card: Card) {
  const cardKey = String(card.id);
  removingCards.value.add(cardKey);

  try {
    const { success } = await removeCardFromCollection(cardKey);
    if (success) {
      toast.add({
        severity: 'success',
        summary: 'Carte retirée',
        detail: `"${card.nameFr}" a été retirée de votre collection`,
        life: 3000,
      });
      // Rafraîchir la liste
      await fetchCards();
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de retirer la carte',
        life: 3000,
      });
    }
  } finally {
    removingCards.value.delete(cardKey);
  }
}

const isCardRemoving = (cardId: string | number) => {
  return removingCards.value.has(String(cardId));
};

watch([filterType, filterRarity, filterSet, searchQuery, limit], () => {
  page.value = 1;
  fetchCards();
});

watch(page, fetchCards, { immediate: true });

// Charger les sets au montage
onMounted(fetchSets);
</script>

<template>
  <div class="container mx-auto p-6 fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Mes Cartes</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Gérez vos {{ pagination.total_items }} cartes possédées
      </p>
    </div>

    <!-- Barre de recherche et vue -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sm:items-center">
      <div class="flex-1 min-w-0">
        <InputText
          v-model="searchQuery"
          placeholder="Rechercher une carte..."
          class="w-full"
          icon="pi pi-search"
        />
      </div>
      <div class="flex gap-2 justify-center sm:justify-start">
        <Button
          v-tooltip.top="'Vue ' + (viewMode === 'grid' ? 'liste' : 'grille')"
          :icon="viewMode === 'grid' ? 'pi pi-th-large' : 'pi pi-bars'"
          :outlined="viewMode === 'list'"
          size="small"
          class="touch-manipulation"
          @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
        >
          <span class="hidden sm:inline">{{ viewMode === 'grid' ? 'Grille' : 'Liste' }}</span>
        </Button>
      </div>
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

    <!-- Filtres -->
    <div
      :class="[
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300',
        showFilters ? 'block' : 'hidden sm:grid',
      ]"
    >
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Type</label>
        <Select
          v-model="filterType"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          placeholder="Tous"
          class="w-full transition-all duration-200"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Rareté</label>
        <Select
          v-model="filterRarity"
          :options="rarityOptions"
          option-label="label"
          option-value="value"
          placeholder="Toutes"
          class="w-full transition-all duration-200"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Set</label>
        <AutoComplete
          v-model="filterSet"
          :suggestions="filteredSets"
          field="name"
          placeholder="Tous"
          class="w-full transition-all duration-200"
          :dropdown="true"
          :multiple="false"
          @complete="searchSet"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Par page</label>
        <Select
          v-model="limit"
          :options="[10, 20, 50, 100]"
          class="w-full transition-all duration-200"
        />
      </div>
    </div>

    <!-- Vue Grille -->
    <CardSkeletonGrid v-if="loading && cards.length === 0" :count="limit" view-mode="grid" />

    <Message
      v-else-if="!loading && cards.length === 0"
      severity="info"
      :closable="false"
      class="mb-6"
    >
      <p class="text-center">
        <i class="pi pi-inbox text-4xl block mb-3" />
        Aucune carte dans votre collection.<br />
        Allez dans la
        <NuxtLink to="/app/search" class="font-bold underline">recherche</NuxtLink> pour ajouter vos
        premières cartes !
      </p>
    </Message>

    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6"
    >
      <TransitionGroup
        name="card-list"
        tag="div"
        class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
      >
        <Card
          v-for="card in cards"
          :key="card.id"
          class="hover-lift transition-all duration-300 bg-white dark:bg-gray-800 border dark:border-gray-700 touch-manipulation"
        >
          <template #header>
            <OptimizedImage
              :src="getImageUrl(card.images?.small || '')"
              :alt="card.name"
              class="w-full h-auto object-contain transition-transform duration-200 hover:scale-105"
              :width="200"
              :height="280"
              :quality="85"
            />
          </template>
          <template #title>
            <h3 class="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
              {{ card.nameFr }}
            </h3>
          </template>
          <template #subtitle>
            <div class="text-xs text-gray-600 dark:text-gray-400">#{{ card.number }}</div>
          </template>
          <template #content>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <div class="hidden sm:block"><strong>Rareté:</strong> {{ card.rarity }}</div>
            </div>
          </template>
          <template #footer>
            <Button
              label="Retirer"
              icon="pi pi-trash"
              severity="danger"
              size="small"
              outlined
              class="w-full transition-all duration-200 hover:shadow-md touch-manipulation"
              :loading="isCardRemoving(card.id)"
              @click="confirmRemoveCard(card)"
            />
          </template>
        </Card>
      </TransitionGroup>
    </div>

    <!-- Vue Liste -->
    <CardSkeletonList v-if="loading && cards.length === 0" :count="limit" />
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <DataTable :value="cards" striped-rows class="dark:bg-gray-800">
        <Column field="images.small" header="Image">
          <template #body="slotProps">
            <OptimizedImage
              :src="getImageUrl(slotProps.data.images?.small || '')"
              :alt="slotProps.data.name"
              class="w-16 h-auto"
              :width="64"
              :height="90"
              :quality="85"
            />
          </template>
        </Column>
        <Column field="nameFr" header="Nom" sortable class="dark:text-gray-100" />
        <Column field="number" header="Numéro" sortable class="dark:text-gray-100" />
        <Column field="rarity" header="Rareté" sortable class="dark:text-gray-100" />
        <Column header="Actions">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              outlined
              :loading="isCardRemoving(slotProps.data.id)"
              @click="confirmRemoveCard(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center">
      <Paginator
        v-model:first="page"
        :rows="1"
        :total-records="pagination.total_pages"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        :current-page-report-template="`Page ${pagination.current_page} sur ${pagination.total_pages}`"
        @page="e => (page = e.page + 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.card-list-move {
  transition: transform 0.3s ease;
}

/* Optimisations mobile */
@media (max-width: 640px) {
  .p-card-body {
    padding: 0.75rem;
  }

  .p-card-content {
    padding: 0.5rem 0;
  }

  .p-card-footer {
    padding: 0.75rem;
  }
}

/* Améliorer les interactions tactiles */
.touch-manipulation {
  touch-action: manipulation;
}

/* Limiter le nombre de lignes du titre */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
