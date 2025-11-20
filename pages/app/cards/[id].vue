<script setup lang="ts">
import type { Card } from '~/types/card';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const cardId = computed(() => route.params.id as string);

const {
  data: cardData,
  pending,
  error,
} = await useAPI<Card>(`cards/${cardId.value}`, {
  method: 'GET',
  default: () => ({} as Card),
});

const card = computed(() => cardData.value as Card | null);

// Gestion des erreurs
if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    message: error.value?.message || 'Card not found',
  });
}

// Helpers pour l'affichage
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    Fire: 'bg-red-500',
    Water: 'bg-blue-500',
    Grass: 'bg-green-500',
    Lightning: 'bg-yellow-500',
    Psychic: 'bg-purple-500',
    Fighting: 'bg-orange-500',
    Darkness: 'bg-gray-800',
    Metal: 'bg-gray-500',
    Dragon: 'bg-gradient-to-r from-orange-500 to-purple-500',
    Colorless: 'bg-gray-400',
  };
  return colors[type] || 'bg-gray-400';
};

const getRarityColor = (rarity: string) => {
  const colors: Record<string, string> = {
    Common: 'text-gray-600',
    Uncommon: 'text-green-600',
    Rare: 'text-blue-600',
    'Rare Holo': 'text-purple-600',
    'Rare Ultra': 'text-pink-600',
    'Rare Secret': 'text-yellow-600',
  };
  return colors[rarity] || 'text-gray-600';
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Bouton retour -->
    <Button
      icon="pi pi-arrow-left"
      label="Retour"
      severity="secondary"
      text
      class="mb-6"
      @click="$router.back()"
    />

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
      <ProgressSpinner />
    </div>

    <!-- Contenu de la carte -->
    <div v-else-if="card" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Image de la carte -->
      <div class="flex flex-col items-center">
        <OptimizedImage
          :src="card.images?.large || `https://images.pokemontcg.io/${card.id}_hires.png`"
          :alt="card.name"
          class="w-full max-w-md rounded-lg shadow-2xl"
        />

        <!-- Actions -->
        <div class="flex gap-4 mt-6 w-full max-w-md">
          <AppAddToWishlistButton
            :card-id="String(card.id)"
            :card-name="card.name"
            class="flex-1"
          />
          <Button
            icon="pi pi-star"
            label="Add to Collection"
            severity="success"
            outlined
            class="flex-1"
          />
        </div>
      </div>

      <!-- Informations de la carte -->
      <div class="space-y-6">
        <!-- En-tête -->
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ card.name }}</h1>
          <div class="flex items-center gap-3 mb-4">
            <Badge
              v-for="type in card.types"
              :key="type"
              :value="type"
              :class="getTypeColor(type) + ' text-white'"
            />
            <Badge :value="card.supertype" severity="info" />
          </div>
          <p v-if="card.subtypes" class="text-gray-600 dark:text-gray-400">
            {{ card.subtypes.join(' • ') }}
          </p>
        </div>

        <!-- Stats principales -->
        <Card>
          <template #title>Stats</template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="card.hp">
                <div class="text-sm text-gray-600 dark:text-gray-400">HP</div>
                <div class="text-2xl font-bold">{{ card.hp }}</div>
              </div>
              <div v-if="card.level">
                <div class="text-sm text-gray-600 dark:text-gray-400">Niveau</div>
                <div class="text-2xl font-bold">{{ card.level }}</div>
              </div>
              <div v-if="card.rarity">
                <div class="text-sm text-gray-600 dark:text-gray-400">Rareté</div>
                <div :class="['text-lg font-bold', getRarityColor(card.rarity)]">
                  {{ card.rarity }}
                </div>
              </div>
              <div v-if="card.set?.name">
                <div class="text-sm text-gray-600 dark:text-gray-400">Extension</div>
                <div class="text-lg font-semibold">{{ card.set.name }}</div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Capacités/Attaques -->
        <Card v-if="card.attacks?.length">
          <template #title>Capacités</template>
          <template #content>
            <div class="space-y-4">
              <div
                v-for="(attack, index) in card.attacks"
                :key="index"
                class="border-l-4 border-primary-500 pl-4"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <span class="font-bold text-lg">{{ attack.name }}</span>
                    <div v-if="attack.cost" class="flex gap-1 mt-1">
                      <Badge
                        v-for="(energy, i) in attack.cost"
                        :key="i"
                        :value="energy"
                        :class="getTypeColor(energy) + ' text-white text-xs'"
                      />
                    </div>
                  </div>
                  <div v-if="attack.damage" class="text-2xl font-bold text-red-600">
                    {{ attack.damage }}
                  </div>
                </div>
                <p v-if="attack.text" class="text-sm text-gray-700 dark:text-gray-300">
                  {{ attack.text }}
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Capacités spéciales (Abilities) -->
        <Card v-if="card.abilities?.length">
          <template #title>Talents</template>
          <template #content>
            <div class="space-y-4">
              <div
                v-for="(ability, index) in card.abilities"
                :key="index"
                class="border-l-4 border-purple-500 pl-4"
              >
                <div class="flex items-center gap-2 mb-2">
                  <Badge :value="ability.type" severity="warning" />
                  <span class="font-bold text-lg">{{ ability.name }}</span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ ability.text }}
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Faiblesses et Résistances -->
        <div v-if="card.weaknesses || card.resistances" class="grid grid-cols-2 gap-4">
          <Card v-if="card.weaknesses">
            <template #title>Faiblesses</template>
            <template #content>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="(weakness, index) in card.weaknesses"
                  :key="index"
                  :value="`${weakness.type} ${weakness.value}`"
                  severity="danger"
                />
              </div>
            </template>
          </Card>

          <Card v-if="card.resistances">
            <template #title>Résistances</template>
            <template #content>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="(resistance, index) in card.resistances"
                  :key="index"
                  :value="`${resistance.type} ${resistance.value}`"
                  severity="success"
                />
              </div>
            </template>
          </Card>
        </div>

        <!-- Coût de retraite -->
        <Card v-if="card.retreatCost?.length">
          <template #title>Coût de retraite</template>
          <template #content>
            <div class="flex gap-1">
              <Badge
                v-for="(energy, i) in card.retreatCost"
                :key="i"
                :value="energy"
                class="bg-gray-400 text-white"
              />
            </div>
          </template>
        </Card>

        <!-- Règles/Texte de la carte -->
        <Card v-if="card.rules?.length">
          <template #title>Règles</template>
          <template #content>
            <div class="space-y-2">
              <p
                v-for="(rule, index) in card.rules"
                :key="index"
                class="text-sm italic text-gray-700 dark:text-gray-300"
              >
                {{ rule }}
              </p>
            </div>
          </template>
        </Card>

        <!-- Informations supplémentaires -->
        <Card>
          <template #title>Informations</template>
          <template #content>
            <div class="space-y-2 text-sm">
              <div v-if="card.artist" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Artiste:</span>
                <span class="font-medium">{{ card.artist }}</span>
              </div>
              <div v-if="card.set?.releaseDate" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Date de sortie:</span>
                <span class="font-medium">{{
                  new Date(card.set.releaseDate).toLocaleDateString('fr-FR')
                }}</span>
              </div>
              <div v-if="card.number" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Numéro:</span>
                <span class="font-medium"
                  >{{ card.number }}/{{ card.set?.printedTotal || card.set?.total }}</span
                >
              </div>
              <div v-if="card.nationalPokedexNumbers" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Pokédex:</span>
                <span class="font-medium">#{{ card.nationalPokedexNumbers.join(', #') }}</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Prix (si disponible) -->
        <Card v-if="card.cardmarket || card.tcgplayer">
          <template #title>Prix du marché</template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="card.cardmarket?.prices">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Cardmarket</div>
                <div v-if="card.cardmarket.prices.averageSellPrice" class="mb-1">
                  <span class="text-xs">Moyenne:</span>
                  <span class="font-bold ml-2"
                    >{{ card.cardmarket.prices.averageSellPrice.toFixed(2) }} €</span
                  >
                </div>
                <div v-if="card.cardmarket.prices.trendPrice" class="mb-1">
                  <span class="text-xs">Tendance:</span>
                  <span class="font-bold ml-2"
                    >{{ card.cardmarket.prices.trendPrice.toFixed(2) }} €</span
                  >
                </div>
              </div>
              <div v-if="card.tcgplayer?.prices">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">TCGPlayer</div>
                <div v-if="card.tcgplayer.prices.normal?.market" class="mb-1">
                  <span class="text-xs">Market:</span>
                  <span class="font-bold ml-2"
                    >${{ card.tcgplayer.prices.normal.market.toFixed(2) }}</span
                  >
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">❌</div>
      <h3 class="text-xl font-semibold mb-2">Carte non trouvée</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        La carte que vous recherchez n'existe pas ou n'est plus disponible.
      </p>
      <Button label="Retour à la recherche" @click="$router.push('/app/search')" />
    </div>
  </div>
</template>
