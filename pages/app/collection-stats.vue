<script setup lang="ts">
import { ref } from 'vue';
import type { CollectionStats } from '~/types/api';

interface SetStats {
  setId: string;
  setName: string;
  setLogo: string;
  totalCards: number;
  ownedCards: number;
  percentage: number;
  releaseDate: string;
}

const sets = ref<SetStats[]>([]);
const loading = ref(true);
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref('releaseDate');

// Statistiques globales
const totalSets = computed(() => sets.value.length);
const completedSets = computed(() => sets.value.filter(s => s.percentage === 100).length);
const averageCompletion = computed(() => {
  if (sets.value.length === 0) return 0;
  const sum = sets.value.reduce((acc, s) => acc + s.percentage, 0);
  return Math.round(sum / sets.value.length);
});

const fetchCollectionStats = async () => {
  loading.value = true;
  try {
    const data = await $fetch<CollectionStats>('/api/collection/stats', {
      baseURL: useRuntimeConfig().public.apiBase,
    });

    sets.value = data.sets.map(set => ({
      setId: set.id,
      setName: set.name,
      setLogo: `https://images.pokemontcg.io/${set.id}/logo.png`,
      totalCards: set.total,
      ownedCards: set.owned,
      percentage: set.percentage,
      releaseDate: set.releaseDate,
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    sets.value = [];
  } finally {
    loading.value = false;
  }
};

const sortedSets = computed(() => {
  const sorted = [...sets.value];
  if (sortBy.value === 'percentage') {
    return sorted.sort((a, b) => b.percentage - a.percentage);
  } else if (sortBy.value === 'name') {
    return sorted.sort((a, b) => a.setName.localeCompare(b.setName));
  } else {
    return sorted.sort(
      (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  }
});

onMounted(() => {
  fetchCollectionStats();
});
</script>

<template>
  <div class="container mx-auto p-6 fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Ma Collection</h1>
      <p class="text-gray-600 dark:text-gray-400">Vue d'ensemble de vos sets et extensions</p>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card class="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <template #content>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">{{ totalSets }}</div>
            <div class="text-sm opacity-90">Sets suivis</div>
          </div>
        </template>
      </Card>

      <Card class="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <template #content>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">{{ completedSets }}</div>
            <div class="text-sm opacity-90">Sets complétés</div>
          </div>
        </template>
      </Card>

      <Card class="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <template #content>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">{{ averageCompletion }}%</div>
            <div class="text-sm opacity-90">Complétion moyenne</div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Filtres et vue -->
    <div class="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <div class="flex gap-2">
        <Select
          v-model="sortBy"
          :options="[
            { label: 'Date de sortie', value: 'releaseDate' },
            { label: 'Nom', value: 'name' },
            { label: 'Pourcentage', value: 'percentage' },
          ]"
          option-label="label"
          option-value="value"
          placeholder="Trier par"
          class="w-52"
        />
      </div>
      <Button
        :icon="viewMode === 'grid' ? 'pi pi-th-large' : 'pi pi-bars'"
        :outlined="viewMode === 'list'"
        @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
      >
        {{ viewMode === 'grid' ? 'Grille' : 'Liste' }}
      </Button>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <template #header>
          <div class="p-4">
            <Skeleton width="100%" height="4rem" />
          </div>
        </template>
        <template #title>
          <Skeleton width="70%" height="1.5rem" />
        </template>
        <template #content>
          <Skeleton width="100%" height="1rem" class="mb-3" />
          <Skeleton width="100%" height="2rem" class="mb-3" />
          <Skeleton width="50%" height="0.75rem" />
        </template>
      </Card>
    </div>

    <!-- Message si aucune collection -->
    <Message
      v-else-if="!loading && sets.length === 0"
      severity="info"
      :closable="false"
      class="my-8"
    >
      <div class="text-center py-6">
        <i class="pi pi-inbox text-6xl text-gray-300 dark:text-gray-600 mb-4 block" />
        <p class="text-gray-700 dark:text-gray-300 text-lg font-semibold">
          Aucune carte dans votre collection
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Commencez par ajouter des cartes depuis la
          <NuxtLink to="/app/search" class="font-bold underline">recherche</NuxtLink> !
        </p>
      </div>
    </Message>

    <!-- Vue Grille -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Card
        v-for="set in sortedSets"
        :key="set.setId"
        class="hover-lift transition-smooth bg-white dark:bg-gray-800 border dark:border-gray-700"
      >
        <template #header>
          <div
            class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
          >
            <OptimizedImage
              :src="set.setLogo"
              :alt="set.setName"
              class="h-16 mx-auto object-contain"
              :width="64"
              :height="64"
              :quality="85"
            />
          </div>
        </template>
        <template #title>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ set.setName }}</h3>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progression</span>
              <span class="font-bold">{{ set.ownedCards }} / {{ set.totalCards }}</span>
            </div>
            <ProgressBar
              :value="set.percentage"
              :show-value="true"
              :class="{
                'bg-green-500': set.percentage === 100,
                'bg-blue-500': set.percentage >= 75 && set.percentage < 100,
                'bg-yellow-500': set.percentage >= 50 && set.percentage < 75,
                'bg-red-500': set.percentage < 50,
              }"
            />
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Sortie: {{ new Date(set.releaseDate).toLocaleDateString('fr-FR') }}
            </div>
            <Button
              label="Voir les détails"
              outlined
              icon="pi pi-arrow-right"
              class="w-full"
              size="small"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Vue Liste -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <DataTable :value="sortedSets" striped-rows>
        <Column field="setLogo" header="Logo">
          <template #body="slotProps">
            <OptimizedImage
              :src="slotProps.data.setLogo"
              :alt="slotProps.data.setName"
              class="h-12"
              :width="48"
              :height="48"
              :quality="85"
            />
          </template>
        </Column>
        <Column field="setName" header="Nom" sortable class="dark:text-gray-100" />
        <Column field="ownedCards" header="Progression" sortable>
          <template #body="slotProps">
            <span class="dark:text-gray-100">
              {{ slotProps.data.ownedCards }} / {{ slotProps.data.totalCards }}
            </span>
          </template>
        </Column>
        <Column field="percentage" header="Pourcentage" sortable>
          <template #body="slotProps">
            <ProgressBar :value="slotProps.data.percentage" :show-value="true" />
          </template>
        </Column>
        <Column field="releaseDate" header="Sortie" sortable>
          <template #body="slotProps">
            <span class="dark:text-gray-100">
              {{ new Date(slotProps.data.releaseDate).toLocaleDateString('fr-FR') }}
            </span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body>
            <Button label="Détails" outlined size="small" icon="pi pi-arrow-right" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Message si aucun set -->
    <div v-if="!loading && sets.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun set dans votre collection</p>
      <Button label="Ajouter des cartes" icon="pi pi-plus" @click="$router.push('/app/search')" />
    </div>
  </div>
</template>
