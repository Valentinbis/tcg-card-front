<script setup lang="ts">
import { ref } from 'vue';
import type { Card, Pagination } from '~/types/card';
import CardPrice from '~/components/CardPrice.vue';

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
const showFilters = ref(false);
const filterType = ref('');
const filterRarity = ref('');
const filterSet = ref('');
const filterHpMin = ref<number | null>(null);
const filterHpMax = ref<number | null>(null);
const filterPriceMin = ref<number | null>(null);
const filterPriceMax = ref<number | null>(null);
const filterAttackName = ref('');

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
  if (filterPriceMin.value) params.priceMin = filterPriceMin.value;
  if (filterPriceMax.value) params.priceMax = filterPriceMax.value;
  if (filterAttackName.value) params.attackName = filterAttackName.value;

  const data = await useAPI<{ data: Card[]; pagination: Pagination }>('cards', {
    method: 'GET',
    params,
    default: () =>
      ({
        data: [],
        pagination: { current_page: 1, per_page: 20, total_items: 0, total_pages: 1 },
      }) as { data: Card[]; pagination: Pagination },
  });
  if (data.data.value) {
    cards.value = (data.data.value as { data: Card[]; pagination: Pagination }).data;
    pagination.value = (data.data.value as { data: Card[]; pagination: Pagination }).pagination;
  }
};

const fetchSets = async () => {
  try {
    const { data } = await useAPI<Array<{ id: string; name: string }>>('sets', {
      method: 'GET',
      default: () => [] as Array<{ id: string; name: string }>,
    });

    if (data.value) {
      sets.value = data.value as { id: string; name: string }[];
    }
  } catch (error) {
    console.error('Erreur lors du chargement des sets:', error);
  }
};

function searchSet(event: { query: string }) {
  const query = event.query.toLowerCase();
  filteredSets.value = sets.value.filter(set => set.name.toLowerCase().includes(query));
}

async function addToCollection(card: Card, lang: string) {
  const cardKey = `${card.id}-${lang}`;
  addingCards.value.add(cardKey);

  const newLanguages = [...((card as Card & { owned_languages?: string[] }).owned_languages || [])];
  if (!newLanguages.includes(lang)) {
    newLanguages.push(lang);
  }

  const result = await addCardToCollection(String(card.id), newLanguages);

  if (result.success) {
    (card as Card & { owned_languages?: string[] }).owned_languages = newLanguages;
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
  filterPriceMin.value = null;
  filterPriceMax.value = null;
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
    filterPriceMin,
    filterPriceMax,
    filterAttackName,
    limit,
  ],
  () => {
    page.value = 1;
    fetchCards();
  }
);

watch(page, fetchCards, { immediate: true });

// Charger les sets au montage
onMounted(fetchSets);
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
        <div
          :class="[
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
            showFilters ? 'block' : 'hidden sm:grid',
          ]"
        >
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
            <AutoComplete
              v-model="filterSet"
              :suggestions="filteredSets"
              field="name"
              placeholder="Nom de l'extension"
              class="w-full"
              :dropdown="true"
              :multiple="false"
              @complete="searchSet"
            />
          </div>

          <!-- Prix Min -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300"
              >Prix Minimum (€)</label
            >
            <InputNumber
              v-model="filterPriceMin"
              :min="0"
              :max="1000"
              :step="0.01"
              placeholder="Ex: 0.50"
              mode="currency"
              currency="EUR"
              locale="fr-FR"
            />
          </div>

          <!-- Prix Max -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-700 dark:text-gray-300"
              >Prix Maximum (€)</label
            >
            <InputNumber
              v-model="filterPriceMax"
              :min="0"
              :max="1000"
              :step="0.01"
              placeholder="Ex: 50.00"
              mode="currency"
              currency="EUR"
              locale="fr-FR"
            />
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
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6"
    >
      <Card
        v-for="card in cards"
        :key="card.id"
        class="hover-lift transition-smooth bg-white dark:bg-gray-800 border dark:border-gray-700 touch-manipulation"
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
          <h3 class="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
            {{ card.nameFr }}
          </h3>
        </template>
        <template #subtitle>
          <div class="text-xs text-gray-600 dark:text-gray-400">#{{ card.number }}</div>
        </template>
        <template #content>
          <div class="space-y-2">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <div><strong>Type:</strong> {{ card.types?.join(', ') }}</div>
              <div class="hidden sm:block"><strong>Rareté:</strong> {{ card.rarity }}</div>
              <div v-if="card.hp" class="hidden sm:block"><strong>HP:</strong> {{ card.hp }}</div>
            </div>

            <!-- Prix de la carte -->
            <CardPrice :card="card" compact class="mt-2" />

            <!-- Boutons d'ajout rapide -->
            <div class="flex gap-1 mt-3">
              <Button
                v-tooltip.top="'Ajouter FR'"
                icon="pi pi-plus"
                rounded
                text
                size="small"
                severity="success"
                :disabled="
                  (card as Card & { owned_languages?: string[] }).owned_languages?.includes('fr')
                "
                :loading="isCardAdding(card.id, 'fr')"
                class="touch-manipulation"
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
                :disabled="
                  (card as Card & { owned_languages?: string[] }).owned_languages?.includes(
                    'reverse'
                  )
                "
                :loading="isCardAdding(card.id, 'reverse')"
                class="touch-manipulation"
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
                :disabled="
                  (card as Card & { owned_languages?: string[] }).owned_languages?.includes('jap')
                "
                :loading="isCardAdding(card.id, 'jap')"
                class="touch-manipulation"
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

<style scoped>
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
