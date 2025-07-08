<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { ref, watch } from "vue";

const { user } = storeToRefs(useAuthStore());
const cards = ref<any>([]);
const pagination = ref({
  current_page: 1,
  per_page: 20,
  total_items: 0,
  total_pages: 1,
});

const page = ref(1);
const limit = ref(20);

const filterOwned = ref(""); // "", "true", "false"
const filterLang = ref(""); // "", "fr", "jap", "reverse"
const filterType = ref(""); // "", "Fire", "Water", etc.
const filterNumber = ref(""); // "", "12", etc.

const apiBase = useRuntimeConfig().public.apiBase.replace("/api/", "");

function getImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return apiBase + path;
}

const fetchCards = async () => {
  let params: any = {
    page: page.value,
    limit: limit.value,
  };
  if (filterOwned.value) params.owned = filterOwned.value;
  if (filterLang.value) params.lang = filterLang.value;
  if (filterType.value) params.type = filterType.value;
  if (filterNumber.value) params.number = filterNumber.value;

  const data = await useAPI("/cards", {
    method: "GET",
    params,
    default: () => ({}),
  });
  cards.value = data.data.value.data;
  pagination.value = data.data.value.pagination;
  // Synchronise la page courante si modifiée côté back
  page.value = pagination.value.current_page;
  limit.value = pagination.value.per_page;
};

async function toggleLanguage(card: any, lang: string, checked: boolean) {
  const newLanguages = [...card.owned_languages];
  if (checked && !newLanguages.includes(lang)) {
    newLanguages.push(lang);
  } else if (!checked && newLanguages.includes(lang)) {
    const idx = newLanguages.indexOf(lang);
    newLanguages.splice(idx, 1);
  }
  card.owned_languages = newLanguages;
  await useAPI(`/cards/${card.id}/languages`, {
    method: "POST",
    body: { languages: newLanguages },
  });
}

function onCheckboxChange(card: any, lang: string, event: Event) {
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
  <h1>Bienvenue sur la home page {{ user?.lastName }} {{ user?.firstName }}</h1>

  <!-- Filtres -->
  <div class="flex flex-wrap gap-4 mb-4 items-end">
    <div>
      <label class="block text-xs font-bold mb-1">Possession</label>
      <select v-model="filterOwned" class="border rounded px-2 py-1">
        <option value="">Toutes</option>
        <option value="true">Possédées</option>
        <option value="false">Non possédées</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-bold mb-1">Langue</label>
      <select v-model="filterLang" class="border rounded px-2 py-1">
        <option value="">Toutes</option>
        <option value="fr">Français 🇫🇷</option>
        <option value="jap">Japonais 🇯🇵</option>
        <option value="reverse">Reverse 🔁</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-bold mb-1">Type</label>
      <select v-model="filterType" class="border rounded px-2 py-1">
        <option value="">Tous</option>
        <option value="Fire">Feu</option>
        <option value="Water">Eau</option>
        <option value="Grass">Plante</option>
        <option value="Electric">Électrique</option>
        <!-- Ajoute ici tous les types nécessaires -->
      </select>
    </div>
    <div>
      <label class="block text-xs font-bold mb-1">Numéro</label>
      <input
        v-model="filterNumber"
        type="number"
        min="1"
        class="border rounded px-2 py-1 w-20"
        placeholder="Numéro"
      />
    </div>
    <div>
      <label class="block text-xs font-bold mb-1">Par page</label>
      <select v-model="limit" class="border rounded px-2 py-1">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>
  </div>

  <!-- Grille des cartes -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="card in cards"
      :key="card.id"
      class="bg-white rounded shadow p-4 flex flex-col items-center"
    >
      <img
        :src="getImageUrl(card.images.small)"
        :alt="card.name"
        class="mb-2 w-32 h-44 object-contain"
      />
      <h2 class="font-bold text-lg mb-1">{{ card.nameFr }}</h2>
      <div class="text-sm text-gray-600 mb-1">#{{ card.number }}</div>
      <div class="text-xs text-gray-500 mb-1">Rareté : {{ card.rarity }}</div>
      <div class="text-xs text-gray-500 mb-1">
        Pokédex : {{ card.nationalPokedexNumbers.join(", ") }}
      </div>
      <div class="flex gap-2 mt-2">
        <label class="flex items-center gap-1">
          <input
            type="checkbox"
            :checked="card.owned_languages.includes('fr')"
            @change="onCheckboxChange(card, 'fr', $event)"
          />
          🇫🇷
        </label>
        <label class="flex items-center gap-1">
          <input
            type="checkbox"
            :checked="card.owned_languages.includes('reverse')"
            @change="onCheckboxChange(card, 'reverse', $event)"
          />
          🔁
        </label>
        <label class="flex items-center gap-1">
          <input
            type="checkbox"
            :checked="card.owned_languages.includes('jap')"
            @change="onCheckboxChange(card, 'jap', $event)"
          />
          🇯🇵
        </label>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div class="flex justify-center mt-6 gap-2">
    <button
      class="px-3 py-1 rounded border"
      :disabled="pagination.current_page <= 1"
      @click="page--"
    >
      Précédent
    </button>
    <span class="px-2 py-1">
      Page {{ pagination.current_page }} / {{ pagination.total_pages }}
    </span>
    <button
      class="px-3 py-1 rounded border"
      :disabled="pagination.current_page >= pagination.total_pages"
      @click="page++"
    >
      Suivant
    </button>
  </div>
</template>