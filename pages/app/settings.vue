<script setup lang="ts">
import type { UserSettings } from '~/types/api';

const toast = useToast();

// Paramètres d'affichage
const displaySettings = ref({
  cardsPerPage: 20,
  defaultView: 'grid',
  showCardNumbers: true,
  showPrices: true,
  defaultLanguage: 'fr',
});

// Paramètres de notification
const notificationSettings = ref({
  emailNotifications: true,
  newCardAlerts: false,
  priceDropAlerts: false,
  weeklyReport: true,
});

// Paramètres de confidentialité
const privacySettings = ref({
  profileVisibility: 'private',
  showCollection: false,
  showWishlist: false,
});

const loading = ref(false);

// Charger les paramètres au montage
onMounted(async () => {
  try {
    const { data } = await useAPI<UserSettings>('user/settings', {
      method: 'GET',
      default: () =>
        ({
          cardsPerPage: 20,
          defaultView: 'grid',
          showCardNumbers: true,
          showPrices: true,
          defaultLanguage: 'fr',
          emailNotifications: true,
          newCardAlerts: false,
          priceDropAlerts: false,
          weeklyReport: true,
          profileVisibility: 'private',
          showCollection: false,
          showWishlist: false,
        }) as UserSettings,
    });

    if (data.value && typeof data.value === 'object' && 'cardsPerPage' in data.value) {
      const settings = data.value as UserSettings;
      displaySettings.value = {
        cardsPerPage: settings.cardsPerPage || 20,
        defaultView: settings.defaultView || 'grid',
        showCardNumbers: settings.showCardNumbers ?? true,
        showPrices: settings.showPrices ?? true,
        defaultLanguage: settings.defaultLanguage || 'fr',
      };

      notificationSettings.value = {
        emailNotifications: settings.emailNotifications ?? true,
        newCardAlerts: settings.newCardAlerts ?? false,
        priceDropAlerts: settings.priceDropAlerts ?? false,
        weeklyReport: settings.weeklyReport ?? true,
      };

      privacySettings.value = {
        profileVisibility: settings.profileVisibility || 'private',
        showCollection: settings.showCollection ?? false,
        showWishlist: settings.showWishlist ?? false,
      };
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
  }
});

const saveSettings = async () => {
  loading.value = true;
  try {
    await useAPI('/user/settings', {
      method: 'PUT',
      body: {
        ...displaySettings.value,
        ...notificationSettings.value,
        ...privacySettings.value,
      },
      default: () => ({}),
    });
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Paramètres sauvegardés avec succès',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de sauvegarder les paramètres',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-6 fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Paramètres</h1>
      <p class="text-gray-600 dark:text-gray-400">Personnalisez votre expérience TCG Card</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Affichage -->
      <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-eye text-blue-500" />
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">Affichage</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                Cartes par page
              </label>
              <Select v-model="displaySettings.cardsPerPage" :options="[10, 20, 50, 100]" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                Vue par défaut
              </label>
              <Select
                v-model="displaySettings.defaultView"
                :options="[
                  { label: 'Grille', value: 'grid' },
                  { label: 'Liste', value: 'list' },
                ]"
                option-label="label"
                option-value="value"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                Langue par défaut
              </label>
              <Select
                v-model="displaySettings.defaultLanguage"
                :options="[
                  { label: 'Français 🇫🇷', value: 'fr' },
                  { label: 'English 🇬🇧', value: 'en' },
                  { label: 'Japonais 🇯🇵', value: 'jap' },
                ]"
                option-label="label"
                option-value="value"
              />
            </div>

            <div class="flex items-center justify-between py-2">
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                Afficher les numéros
              </label>
              <InputSwitch v-model="displaySettings.showCardNumbers" />
            </div>

            <div class="flex items-center justify-between py-2">
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                Afficher les prix
              </label>
              <InputSwitch v-model="displaySettings.showPrices" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Notifications -->
      <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-bell text-purple-500" />
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">Notifications</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-2">
              <div>
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Notifications par email
                </label>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Recevoir des emails de notification
                </span>
              </div>
              <InputSwitch v-model="notificationSettings.emailNotifications" />
            </div>

            <div class="flex items-center justify-between py-2">
              <div>
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Alertes nouvelles cartes
                </label>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Nouveaux sets et extensions
                </span>
              </div>
              <InputSwitch v-model="notificationSettings.newCardAlerts" />
            </div>

            <div class="flex items-center justify-between py-2">
              <div>
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Alertes baisse de prix
                </label>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Cartes de votre wishlist
                </span>
              </div>
              <InputSwitch v-model="notificationSettings.priceDropAlerts" />
            </div>

            <div class="flex items-center justify-between py-2">
              <div>
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Rapport hebdomadaire
                </label>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Statistiques de la semaine
                </span>
              </div>
              <InputSwitch v-model="notificationSettings.weeklyReport" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Confidentialité -->
      <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-lock text-green-500" />
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">Confidentialité</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                Visibilité du profil
              </label>
              <Select
                v-model="privacySettings.profileVisibility"
                :options="[
                  { label: 'Public', value: 'public' },
                  { label: 'Amis seulement', value: 'friends' },
                  { label: 'Privé', value: 'private' },
                ]"
                option-label="label"
                option-value="value"
              />
            </div>

            <div class="flex items-center justify-between py-2">
              <div>
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Afficher ma collection
                </label>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Visible par les autres utilisateurs
                </span>
              </div>
              <InputSwitch v-model="privacySettings.showCollection" />
            </div>

            <div class="flex items-center justify-between py-2">
              <div>
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Afficher ma wishlist
                </label>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  Cartes que vous recherchez
                </span>
              </div>
              <InputSwitch v-model="privacySettings.showWishlist" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Données -->
      <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-info-circle text-blue-500" />
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">À propos</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Application de gestion de collection TCG Pokémon
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Version 1.0.0</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Bouton de sauvegarde -->
    <div class="mt-6 flex justify-end">
      <Button
        label="Sauvegarder les paramètres"
        icon="pi pi-check"
        size="large"
        :loading="loading"
        class="touch-manipulation"
        @click="saveSettings"
      />
    </div>
  </div>
</template>
