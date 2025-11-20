<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import type { UserStats } from '~/types/api';

const { user } = storeToRefs(useAuthStore());
const toast = useToast();

// Informations du profil
const profileData = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  avatar: '',
});

// Changement de mot de passe
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Statistiques utilisateur
const stats = ref({
  totalCards: 0,
  totalOwnedCards: 0,
  completionPercentage: 0,
  totalValue: 0,
  favoriteType: '',
  joinDate: new Date(),
});

const loading = ref(false);

const fetchUserStats = async () => {
  try {
    const data = await $fetch<UserStats>('/api/user/stats', {
      baseURL: useRuntimeConfig().public.apiBase,
    });

    stats.value = {
      totalCards: data.totalCards,
      totalOwnedCards: data.totalOwnedCards,
      completionPercentage: data.completionPercentage,
      totalValue: data.totalValue,
      favoriteType: data.favoriteType,
      joinDate: new Date(data.joinDate),
    };
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
  }
};

// Charger les stats au montage
onMounted(() => {
  fetchUserStats();
});

const updateProfile = async () => {
  loading.value = true;
  try {
    await useAPI('/user/profile', {
      method: 'PUT',
      body: profileData.value,
      default: () => ({}),
    });
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Profil mis à jour avec succès',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de mettre à jour le profil',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const updatePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Les mots de passe ne correspondent pas',
      life: 3000,
    });
    return;
  }

  loading.value = true;
  try {
    await useAPI('/user/password', {
      method: 'PUT',
      body: {
        currentPassword: passwordData.value.currentPassword,
        newPassword: passwordData.value.newPassword,
      },
      default: () => ({}),
    });
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Mot de passe modifié avec succès',
      life: 3000,
    });
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de modifier le mot de passe',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserStats();
});
</script>

<template>
  <div class="container mx-auto p-4 md:p-6 fade-in">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Mon Profil</h1>
      <p class="text-gray-600 dark:text-gray-400">Gérez vos informations personnelles</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Colonne gauche - Informations et Avatar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Avatar et infos rapides -->
        <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <template #content>
            <div class="text-center">
              <div class="mb-4">
                <div
                  class="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-4xl font-bold"
                >
                  {{ profileData.firstName?.charAt(0) }}{{ profileData.lastName?.charAt(0) }}
                </div>
              </div>
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                {{ profileData.firstName }} {{ profileData.lastName }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ profileData.email }}</p>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Membre depuis {{ new Date(stats.joinDate).toLocaleDateString('fr-FR') }}
              </div>
            </div>
          </template>
        </Card>

        <!-- Statistiques -->
        <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <template #title>
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">Statistiques</span>
          </template>
          <template #content>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600 dark:text-gray-400">Collection</span>
                  <span class="font-bold text-gray-800 dark:text-gray-100">
                    {{ stats.totalOwnedCards }} / {{ stats.totalCards }}
                  </span>
                </div>
                <ProgressBar :value="stats.completionPercentage" :show-value="true" />
              </div>

              <div class="flex justify-between py-2 border-b dark:border-gray-700">
                <span class="text-sm text-gray-600 dark:text-gray-400">Valeur estimée</span>
                <span class="font-bold text-green-600 dark:text-green-400">
                  {{ stats.totalValue.toFixed(2) }} €
                </span>
              </div>

              <div class="flex justify-between py-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">Type favori</span>
                <span class="font-bold text-gray-800 dark:text-gray-100">{{
                  stats.favoriteType
                }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Colonne droite - Formulaires -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Informations personnelles -->
        <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <template #title>
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">
              Informations Personnelles
            </span>
          </template>
          <template #content>
            <form class="space-y-4" @submit.prevent="updateProfile">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-300">Prénom</label>
                  <InputText v-model="profileData.firstName" required />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold text-gray-700 dark:text-gray-300">Nom</label>
                  <InputText v-model="profileData.lastName" required />
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
                <InputText v-model="profileData.email" type="email" required />
              </div>

              <div class="flex justify-end">
                <Button
                  type="submit"
                  label="Sauvegarder"
                  icon="pi pi-check"
                  :loading="loading"
                  class="touch-manipulation"
                />
              </div>
            </form>
          </template>
        </Card>

        <!-- Changement de mot de passe -->
        <Card class="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <template #title>
            <span class="text-lg font-bold text-gray-800 dark:text-gray-100">
              Changer le Mot de Passe
            </span>
          </template>
          <template #content>
            <form class="space-y-4" @submit.prevent="updatePassword">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Mot de passe actuel
                </label>
                <Password
                  v-model="passwordData.currentPassword"
                  :feedback="false"
                  toggle-mask
                  required
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Nouveau mot de passe
                </label>
                <Password v-model="passwordData.newPassword" toggle-mask required />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Confirmer le mot de passe
                </label>
                <Password
                  v-model="passwordData.confirmPassword"
                  :feedback="false"
                  toggle-mask
                  required
                />
              </div>

              <div class="flex justify-end">
                <Button
                  type="submit"
                  label="Modifier le mot de passe"
                  icon="pi pi-lock"
                  :loading="loading"
                  severity="warning"
                  class="touch-manipulation"
                />
              </div>
            </form>
          </template>
        </Card>

        <!-- Danger Zone -->
        <Card class="bg-white dark:bg-gray-800 border-2 border-red-500 dark:border-red-600">
          <template #title>
            <span class="text-lg font-bold text-red-600 dark:text-red-400">Zone Dangereuse</span>
          </template>
          <template #content>
            <div class="space-y-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                La suppression de votre compte est irréversible. Toutes vos données seront perdues.
              </p>
              <Button
                label="Supprimer mon compte"
                icon="pi pi-trash"
                severity="danger"
                outlined
                class="touch-manipulation"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
