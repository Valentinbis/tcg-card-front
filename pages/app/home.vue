<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { ref, watch } from 'vue';
import type { Card, Pagination, CardParams } from '~/types/card';

const { user } = storeToRefs(useAuthStore());
const cards = ref<Card[]>([]);
const pagination = ref<Pagination>({
  current_page: 1,
  per_page: 20,
  total_items: 0,
  total_pages: 1,
});

const page = ref(1);
const limit = ref(20);
const showFilters = ref(false);

const filterOwned = ref(''); // "", "true", "false"
const filterType = ref(''); // "", "Fire", "Water", etc.
const filterNumber = ref<number | null>(null); // null ou nombre

const apiBase = useRuntimeConfig().public.apiBase.replace('/api/', '');

// Options pour les dropdowns PrimeVue
const ownedOptions = [
  { label: 'Toutes', value: '' },
  { label: 'Possédées', value: 'true' },
  { label: 'Non possédées', value: 'false' },
];

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
  { label: 'Normal', value: 'Normal' },
  { label: 'Spectre', value: 'Ghost' },
];

const limitOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
];

function getImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return apiBase + path;
}

const fetchCards = async () => {
  const params: CardParams = {
    page: page.value,
    limit: limit.value,
  };
  if (filterOwned.value) params.owned = filterOwned.value;
  if (filterType.value) params.type = filterType.value;
  if (filterNumber.value) params.number = filterNumber.value.toString();

  const data = await useAPI<{ data: Card[]; pagination: Pagination }>('cards', {
    method: 'GET',
    params,
    default: () =>
      ({
        data: [],
        pagination: { current_page: 1, per_page: 20, total_items: 0, total_pages: 1 },
      }) as { data: Card[]; pagination: Pagination },
  });
  if (data.data.value && typeof data.data.value === 'object' && 'data' in data.data.value) {
    const response = data.data.value as { data: Card[]; pagination: Pagination };
    cards.value = response.data;
    pagination.value = response.pagination;
    // Synchronise la page courante si modifiée côté back
    page.value = pagination.value.current_page;
    limit.value = pagination.value.per_page;
  }
};

// Réinitialise la page à 1 lors d'un changement de filtre
watch([filterOwned, filterType, filterNumber, limit], () => {
  page.value = 1;
  fetchCards();
});

// Rafraîchir à chaque changement de page
watch(page, fetchCards, { immediate: true });
</script>

<template>
  <div class="container mx-auto p-4 md:p-6 fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Bienvenue {{ user?.firstName }} {{ user?.lastName }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">Gérez votre collection de cartes Pokémon</p>
    </div>

    <!-- Bouton toggle filtres mobile -->
    <div class="md:hidden mb-4">
      <Button
        :icon="showFilters ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        :label="showFilters ? 'Masquer les filtres' : 'Afficher les filtres'"
        class="w-full touch-manipulation transition-smooth"
        severity="secondary"
        @click="showFilters = !showFilters"
      />
    </div>

    <!-- Filtres avec PrimeVue -->
    <div
      class="flex flex-wrap gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      :class="{ 'hidden md:flex': !showFilters }"
    >
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Possession</label>
        <Select
          v-model="filterOwned"
          :options="ownedOptions"
          option-label="label"
          option-value="value"
          placeholder="Toutes"
          class="w-44 transition-smooth"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Type</label>
        <Select
          v-model="filterType"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          placeholder="Tous"
          class="w-44 transition-smooth"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Numéro</label>
        <InputNumber
          v-model="filterNumber"
          :min="1"
          placeholder="Numéro"
          class="w-32 transition-smooth"
          :use-grouping="false"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Par page</label>
        <Select
          v-model="limit"
          :options="limitOptions"
          option-label="label"
          option-value="value"
          class="w-28 transition-smooth"
        />
      </div>
    </div>

    <!-- Grille des cartes avec animations -->
    <div
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6"
    >
      <Card
        v-for="(card, index) in cards"
        :key="card.id"
        class="hover-lift transition-smooth stagger-item bg-white dark:bg-gray-800 border dark:border-gray-700"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <template #header>
          <OptimizedImage
            :src="getImageUrl(card.images?.small || '')"
            :alt="card.name"
            class="w-full h-auto object-contain"
            :width="200"
            :height="280"
            :quality="85"
          />
        </template>

        <template #title>
          <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
            {{ card.nameFr }}
          </h2>
        </template>

        <template #subtitle>
          <div class="text-sm text-gray-600 dark:text-gray-400">#{{ card.number }}</div>
        </template>

        <template #content>
          <div class="space-y-2">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <strong>Rareté:</strong> {{ card.rarity }}
            </div>
            <div
              v-if="card.nationalPokedexNumbers"
              class="text-xs text-gray-500 dark:text-gray-400"
            >
              <strong>Pokédex:</strong> {{ card.nationalPokedexNumbers.join(', ') }}
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Pagination avec PrimeVue -->
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
/* Styles mobiles */
@media (max-width: 768px) {
  .p-card-body {
    padding: 0.75rem !important;
  }

  .p-card-content {
    padding: 0 !important;
  }

  .p-card-title {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }

  .p-card-subtitle {
    font-size: 0.75rem !important;
  }
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

/* Touch manipulation pour les interactions tactiles */
.touch-manipulation {
  touch-action: manipulation;
}
</style>
