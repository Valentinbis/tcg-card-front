<script setup lang="ts">
import { ref } from 'vue';
import type { Card, Pagination } from '~/types/card';

const { addCardToCollection } = useUserCards();

const cards = ref<Card[]>([]);
const pagination = ref<Pagination>({
  current_page: 1,
  per_page: 20,
  total_items: 0,
  total_pages: 1,
});

const page = ref(1);
const limit = ref(20);
const addingCards = ref<Set<string>>(new Set());

// Filtres de recherche avancée
const searchQuery = ref('');
const filterType = ref('');
const filterRarity = ref('');
const filterSet = ref('');
const filterHpMin = ref<number | null>(null);
const filterHpMax = ref<number | null>(null);
const filterAttackName = ref('');

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

function getImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return apiBase + path;
}

const fetchCards = async () => {
  const params: Record<string, string | number> = {
    page: page.value,
    limit: limit.value,
  };
  if (searchQuery.value) params.search = searchQuery.value;
  if (filterType.value) params.type = filterType.value;
  if (filterRarity.value) params.rarity = filterRarity.value;
  if (filterSet.value) params.set = filterSet.value;
  if (filterHpMin.value) params.hpMin = filterHpMin.value;
  if (filterHpMax.value) params.hpMax = filterHpMax.value;
  if (filterAttackName.value) params.attackName = filterAttackName.value;

  const data = await useAPI<{ data: Card[]; pagination: Pagination }>('/cards', {
    method: 'GET',
    params,
    default: () => ({
      data: [],
      pagination: { current_page: 1, per_page: 20, total_items: 0, total_pages: 1 },
    }),
  });
  cards.value = data.data.value.data;
  pagination.value = data.data.value.pagination;
};

async function addToCollection(card: Card, lang: string) {
  const cardKey = `${card.id}-${lang}`;
  addingCards.value.add(cardKey);

  const newLanguages = [...(card.owned_languages || [])];
  if (!newLanguages.includes(lang)) {
    newLanguages.push(lang);
  }

  const result = await addCardToCollection(String(card.id), newLanguages);

  if (result.success) {
    card.owned_languages = newLanguages;
  }

  addingCards.value.delete(cardKey);
}

const isCardAdding = (cardId: string | number, lang: string) => {
  return addingCards.value.has(`${cardId}-${lang}`);
};

const resetFilters = () => {
  searchQuery.value = '';
  filterType.value = '';
  filterRarity.value = '';
  filterSet.value = '';
  filterHpMin.value = null;
  filterHpMax.value = null;
  filterAttackName.value = '';
  page.value = 1;
};

watch(
  [
    searchQuery,
    filterType,
    filterRarity,
    filterSet,
    filterHpMin,
    filterHpMax,
    filterAttackName,
    limit,
  ],
  () => {
    page.value = 1;
    fetchCards();
  }
);

watch(page, fetchCards, { immediate: true });
</script>

<template>
  <div class="container mx-auto p-6 fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Recherche Avancée</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Trouvez la carte parfaite parmi {{ pagination.total_items }} résultats
      </p>
    </div>

    <!-- Barre de recherche principale -->
    <div class="mb-6">
      <div class="relative">
        <InputText
          v-model="searchQuery"
          placeholder="Rechercher par nom de carte, Pokémon..."
          class="w-full text-lg py-3"
          icon="pi pi-search"
        />
      </div>
    </div>

    <!-- Filtres avancés -->
    <Card class="mb-6 bg-white dark:bg-gray-800 border dark:border-gray-700">
      <template #title>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-gray-800 dark:text-gray-100">Filtres Avancés</span>
          <Button
            label="Réinitialiser"
            icon="pi pi-refresh"
            text
            size="small"
            @click="resetFilters"
          />
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <!-- Type -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Type</label>
            <Select
              v-model="filterType"
              :options="typeOptions"
              option-label="label"
              option-value="value"
              placeholder="Tous les types"
            />
          </div>

          <!-- Rareté -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Rareté</label>
            <Select
              v-model="filterRarity"
              :options="rarityOptions"
              option-label="label"
              option-value="value"
              placeholder="Toutes les raretés"
            />
          </div>

          <!-- Set -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Extension</label>
            <InputText v-model="filterSet" placeholder="Nom de l'extension" />
          </div>

          <!-- HP Min -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">HP Minimum</label>
            <InputNumber v-model="filterHpMin" :min="0" :max="300" placeholder="Ex: 50" />
          </div>

          <!-- HP Max -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">HP Maximum</label>
            <InputNumber v-model="filterHpMax" :min="0" :max="300" placeholder="Ex: 200" />
          </div>

          <!-- Nom d'attaque -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Nom d'attaque</label>
            <InputText v-model="filterAttackName" placeholder="Ex: Lance-Flammes" />
          </div>

          <!-- Résultats par page -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Par page</label>
            <Select v-model="limit" :options="[10, 20, 50, 100]" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Résultats -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6"
    >
      <Card
        v-for="card in cards"
        :key="card.id"
        class="hover-lift transition-smooth bg-white dark:bg-gray-800 border dark:border-gray-700"
      >
        <template #header>
          <img
            :src="getImageUrl(card.images?.small || '')"
            :alt="card.name"
            loading="lazy"
            class="w-full h-auto object-contain"
          />
        </template>
        <template #title>
          <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ card.nameFr }}</h3>
        </template>
        <template #subtitle>
          <div class="text-xs text-gray-600 dark:text-gray-400">#{{ card.number }}</div>
        </template>
        <template #content>
          <div class="space-y-2">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <div><strong>Type:</strong> {{ card.types?.join(', ') }}</div>
              <div><strong>Rareté:</strong> {{ card.rarity }}</div>
              <div v-if="card.hp"><strong>HP:</strong> {{ card.hp }}</div>
            </div>

            <!-- Boutons d'ajout rapide -->
            <div class="flex gap-1 mt-3">
              <Button
                v-tooltip.top="'Ajouter FR'"
                icon="pi pi-plus"
                rounded
                text
                size="small"
                severity="success"
                :disabled="card.owned_languages?.includes('fr')"
                :loading="isCardAdding(card.id, 'fr')"
                @click="addToCollection(card, 'fr')"
              >
                <template v-if="!isCardAdding(card.id, 'fr')" #default> 🇫🇷 </template>
              </Button>
              <Button
                v-if="['Common', 'Uncommon', 'Rare'].includes(card.rarity)"
                v-tooltip.top="'Ajouter Reverse'"
                icon="pi pi-plus"
                rounded
                text
                size="small"
                severity="success"
                :disabled="card.owned_languages?.includes('reverse')"
                :loading="isCardAdding(card.id, 'reverse')"
                @click="addToCollection(card, 'reverse')"
              >
                <template v-if="!isCardAdding(card.id, 'reverse')" #default> 🔁 </template>
              </Button>
              <Button
                v-tooltip.top="'Ajouter JAP'"
                icon="pi pi-plus"
                rounded
                text
                size="small"
                severity="success"
                :disabled="card.owned_languages?.includes('jap')"
                :loading="isCardAdding(card.id, 'jap')"
                @click="addToCollection(card, 'jap')"
              >
                <template v-if="!isCardAdding(card.id, 'jap')" #default> 🇯🇵 </template>
              </Button>
            </div>

            <!-- Bouton Wishlist -->
            <div class="mt-2">
              <AppAddToWishlistButton :card-id="String(card.id)" :card-name="card.nameFr" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Message si aucun résultat -->
    <Message v-if="cards.length === 0" severity="info" :closable="false" class="my-8">
      <div class="text-center py-6">
        <i class="pi pi-search text-6xl text-gray-300 dark:text-gray-600 mb-4 block" />
        <p class="text-gray-700 dark:text-gray-300 text-lg font-semibold">Aucune carte trouvée</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Essayez de modifier vos filtres de recherche
        </p>
      </div>
    </Message>

    <!-- Pagination -->
    <div v-if="cards.length > 0" class="flex justify-center">
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
