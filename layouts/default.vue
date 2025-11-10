<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const { logout } = useAuthStore();

const isSidebarOpen = ref(false);
const isDarkMode = ref(true); // Dark mode par défaut

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;

  // Vérifier qu'on est côté client
  if (import.meta.client) {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};

// Initialiser le theme au chargement
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  } else {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
});

const logoutEvent = () => {
  logout();
  router.push('/auth/login');
};

// Navigation items avec icônes SVG
const menuItems = [
  {
    name: 'Dashboard',
    to: '/app/home',
    icon: 'M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z',
  },
  {
    name: 'Mes Cartes',
    to: '/app/cards',
    icon: 'M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm320 280Z',
  },
  {
    name: 'Collection',
    to: '/app/collection',
    icon: 'M120-200v-640l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v640l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80Zm-40 360h560v-440H200v440Zm0-440v440-440Z',
  },
  {
    name: 'Recherche',
    to: '/app/search',
    icon: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
  },
  {
    name: 'Profil',
    to: '/app/profile',
    icon: 'M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z',
  },
  {
    name: 'Paramètres',
    to: '/app/settings',
    icon: 'm370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z',
  },
];
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-950">
    <!-- Sidebar -->
    <aside class="flex flex-shrink-0">
      <!-- Barre latérale principale -->
      <div
        :class="[
          'transition-all duration-300 ease-in-out bg-gray-900 text-white flex flex-col',
          { 'w-16': !isSidebarOpen, 'w-64': isSidebarOpen },
        ]"
      >
        <!-- Logo / Header -->
        <div class="p-4 border-b border-gray-700 flex items-center justify-between h-16">
          <Transition name="fade">
            <div v-if="isSidebarOpen" class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="#3b82f6"
              >
                <path
                  d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm320 280Z"
                />
              </svg>
              <span class="text-xl font-bold">TCG Card</span>
            </div>
          </Transition>
          <button class="p-2 hover:bg-gray-800 rounded-lg transition-colors" @click="toggleSidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#ffffff"
              class="transition-transform duration-300"
              :class="{ 'rotate-180': isSidebarOpen }"
            >
              <path
                d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm240-80h400v-480H400v480Zm-80 0v-480H160v480h160Zm-160 0v-480 480Zm160 0h80-80Zm0-480h80-80Z"
              />
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-1 px-2">
            <li v-for="item in menuItems" :key="item.to">
              <nuxt-link
                :to="item.to"
                class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-gray-800 group relative"
                active-class="bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                  class="flex-shrink-0"
                >
                  <path :d="item.icon" />
                </svg>
                <Transition name="fade">
                  <span v-if="isSidebarOpen" class="text-sm font-medium whitespace-nowrap">
                    {{ item.name }}
                  </span>
                </Transition>
                <!-- Tooltip quand la sidebar est fermée -->
                <div
                  v-if="!isSidebarOpen"
                  class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                >
                  {{ item.name }}
                </div>
              </nuxt-link>
            </li>
          </ul>
        </nav>

        <!-- Footer / User Section -->
        <div class="border-t border-gray-700 p-2 space-y-2">
          <!-- Toggle Theme -->
          <button
            class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-gray-800 w-full group relative text-white"
            @click="toggleTheme"
          >
            <svg
              v-if="isDarkMode"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              class="flex-shrink-0"
            >
              <path
                d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              class="flex-shrink-0"
            >
              <path
                d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"
              />
            </svg>
            <Transition name="fade">
              <span v-if="isSidebarOpen" class="text-sm font-medium">
                {{ isDarkMode ? 'Mode clair' : 'Mode sombre' }}
              </span>
            </Transition>
            <!-- Tooltip quand la sidebar est fermée -->
            <div
              v-if="!isSidebarOpen"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
            >
              {{ isDarkMode ? 'Mode clair' : 'Mode sombre' }}
            </div>
          </button>

          <!-- Déconnexion -->
          <button
            class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-gray-800 w-full group relative text-red-400 hover:text-red-300"
            @click="logoutEvent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              class="flex-shrink-0"
            >
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
              />
            </svg>
            <Transition name="fade">
              <span v-if="isSidebarOpen" class="text-sm font-medium">Se déconnecter</span>
            </Transition>
            <!-- Tooltip quand la sidebar est fermée -->
            <div
              v-if="!isSidebarOpen"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
            >
              Se déconnecter
            </div>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Top Bar (optionnel) -->
      <header
        class="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800"
      >
        <div class="flex items-center justify-between w-full">
          <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {{ $route.name }}
          </h1>
          <div class="flex items-center gap-4">
            <!-- Notifications, User avatar, etc. peuvent être ajoutés ici -->
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
        <slot />
      </main>
    </div>

    <!-- Composants globaux -->
    <Toast position="top-right" />
    <AppGlobalLoading />
  </div>
</template>

<style scoped>
/* Animation pour les transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar personnalisée */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #1f2937;
}

aside::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
