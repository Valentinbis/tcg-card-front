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

const filterOwned = ref(''); // "", "true", "false"
const filterLang = ref(''); // "", "fr", "jap", "reverse"
const filterType = ref(''); // "", "Fire", "Water", etc.
const filterNumber = ref<number | null>(null); // null ou nombre

const apiBase = useRuntimeConfig().public.apiBase.replace('/api/', '');

// Options pour les dropdowns PrimeVue
const ownedOptions = [
  { label: 'Toutes', value: '' },
  { label: 'Possédées', value: 'true' },
  { label: 'Non possédées', value: 'false' },
];

const langOptions = [
  { label: 'Toutes', value: '' },
  { label: 'Français 🇫🇷', value: 'fr' },
  { label: 'Japonais 🇯🇵', value: 'jap' },
  { label: 'Reverse 🔁', value: 'reverse' },
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
  if (filterLang.value) params.lang = filterLang.value;
  if (filterType.value) params.type = filterType.value;
  if (filterNumber.value) params.number = filterNumber.value.toString();

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
  // Synchronise la page courante si modifiée côté back
  page.value = pagination.value.current_page;
  limit.value = pagination.value.per_page;
};

async function toggleLanguage(card: Card, lang: string, checked: boolean) {
  const newLanguages = [...(card.owned_languages || [])];
  if (checked && !newLanguages.includes(lang)) {
    newLanguages.push(lang);
  } else if (!checked && newLanguages.includes(lang)) {
    const idx = newLanguages.indexOf(lang);
    newLanguages.splice(idx, 1);
  }
  card.owned_languages = newLanguages;
  await useAPI(`/cards/${card.id}/languages`, {
    method: 'POST',
    body: { languages: newLanguages },
    default: () => ({}),
  });
}

function onCheckboxChange(card: Card, lang: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  toggleLanguage(card, lang, checked);
}

// Réinitialise la page à 1 lors d'un changement de filtre
watch([filterOwned, filterLang, filterType, filterNumber, limit], () => {
  page.value = 1;
  fetchCards();
});

// Rafraîchir à chaque changement de page
watch(page, fetchCards, { immediate: true });
</script>

<template>
  <div class="container mx-auto p-4 fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Bienvenue {{ user?.firstName }} {{ user?.lastName }}
      </h1>
      <p class="text-gray-600">Gérez votre collection de cartes Pokémon</p>
    </div>

    <!-- Filtres avec PrimeVue -->
    <div class="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700">Possession</label>
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
        <label class="text-xs font-bold text-gray-700">Langue</label>
        <Select
          v-model="filterLang"
          :options="langOptions"
          option-label="label"
          option-value="value"
          placeholder="Toutes"
          class="w-52 transition-smooth"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700">Type</label>
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
        <label class="text-xs font-bold text-gray-700">Numéro</label>
        <InputNumber
          v-model="filterNumber"
          :min="1"
          placeholder="Numéro"
          class="w-32 transition-smooth"
          :use-grouping="false"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-gray-700">Par page</label>
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
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <Card
        v-for="(card, index) in cards"
        :key="card.id"
        class="hover-lift transition-smooth stagger-item"
        :style="{ animationDelay: `${index * 0.05}s` }"
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
          <h2 class="text-lg font-bold">{{ card.nameFr }}</h2>
        </template>

        <template #subtitle>
          <div class="text-sm text-gray-600">#{{ card.number }}</div>
        </template>

        <template #content>
          <div class="space-y-2">
            <div class="text-xs text-gray-500"><strong>Rareté:</strong> {{ card.rarity }}</div>
            <div v-if="card.nationalPokedexNumbers" class="text-xs text-gray-500">
              <strong>Pokédex:</strong> {{ card.nationalPokedexNumbers.join(', ') }}
            </div>

            <div class="flex gap-2 mt-3 justify-center">
              <label class="flex items-center gap-1 cursor-pointer hover-scale transition-fast">
                <Checkbox
                  :model-value="card.owned_languages?.includes('fr')"
                  :binary="true"
                  @change="onCheckboxChange(card, 'fr', $event)"
                />
                <span>🇫🇷</span>
              </label>

              <label
                v-if="['Common', 'Uncommon', 'Rare'].includes(card.rarity)"
                class="flex items-center gap-1 cursor-pointer hover-scale transition-fast"
              >
                <Checkbox
                  :model-value="card.owned_languages?.includes('reverse')"
                  :binary="true"
                  @change="onCheckboxChange(card, 'reverse', $event)"
                />
                <span>🔁</span>
              </label>

              <label class="flex items-center gap-1 cursor-pointer hover-scale transition-fast">
                <Checkbox
                  :model-value="card.owned_languages?.includes('jap')"
                  :binary="true"
                  @change="onCheckboxChange(card, 'jap', $event)"
                />
                <span>🇯🇵</span>
              </label>
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
