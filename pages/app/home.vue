<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { user } = storeToRefs(useAuthStore());
const cards = ref<any>([]);

const apiBase = useRuntimeConfig().public.apiBase.replace("/api/", "");

function getImageUrl(path: string) {
  if (!path) return "";
  // Si déjà une URL absolue, retourne-la
  if (path.startsWith("http")) return path;
  // Sinon, préfixe avec l’URL de l’API (sans /api)
  return apiBase + path;
}

const fetchCards = async () => {
  let params = {};
  const data = await useAPI("/cards", {
    method: "GET",
    params: params,
    default: () => ({}),
  });
  cards.value = data.data.value;
};

fetchCards();
</script>

<template>
  <h1>Bienvenue sur la home page {{ user?.lastName }} {{ user?.firstName }}</h1>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  >
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
      <h2 class="font-bold text-lg mb-1">{{ card.name }}</h2>
      <div class="text-sm text-gray-600 mb-1">#{{ card.number }}</div>
      <div class="text-xs text-gray-500 mb-1">Rareté : {{ card.rarity }}</div>
      <div class="text-xs text-gray-500 mb-1">
        Pokédex : {{ card.nationalPokedexNumbers.join(", ") }}
      </div>
      <div class="flex gap-2 mt-2">
        <label class="flex items-center gap-1">
          <input
            type="checkbox"
            disabled
            :checked="card.owned_languages.includes('fr')"
          />
          🇫🇷
        </label>
        <label class="flex items-center gap-1">
          <input
            type="checkbox"
            disabled
            :checked="card.owned_languages.includes('reverse')"
          />
          🔁
        </label>
        <label class="flex items-center gap-1">
          <input
            type="checkbox"
            disabled
            :checked="card.owned_languages.includes('jap')"
          />
          🇯🇵
        </label>
      </div>
    </div>
  </div>
</template>
