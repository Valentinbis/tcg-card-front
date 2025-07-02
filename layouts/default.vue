<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const { logout } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore());

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const logoutEvent = () => {
  logout();
  router.push("/auth/login");
};
</script>

<template>
  <aside>
    <div class="flex flex-row">
      <div
        :class="[
          'transition-width duration-300 bg-gray-900 text-white h-screen',
          { 'w-16': !isSidebarOpen, 'w-64': isSidebarOpen },
        ]"
      >
        <ul>
          <li class="p-4">
            <nuxt-link to="/app/home" class="flex items-center">
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#ffffff"
                >
                  <path
                    d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640ZM120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160q-17 0-28.5-11.5T120-480Zm400 320v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160Zm-400 0v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Zm80-360h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"
                  />
                </svg>
              </i>
              <span v-if="isSidebarOpen" class="ml-2">Accueil</span>
            </nuxt-link>
          </li>
          <li class="p-4">
            <nuxt-link
              @click="logoutEvent"
              class="flex items-center cursor-pointer"
            >
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
                  />
                </svg>
              </i>
              <span v-if="isSidebarOpen" class="ml-2">Se déconnecter</span>
            </nuxt-link>
          </li>
        </ul>
      </div>
      <div class="ml-2">
        <button @click="toggleSidebar" class="">
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path
                d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm240-80h400v-480H400v480Zm-80 0v-480H160v480h160Zm-160 0v-480 480Zm160 0h80-80Zm0-480h80-80Z"
              />
            </svg>
          </i>
        </button>
        <slot />
      </div>
    </div>
  </aside>
  <main>
  </main>
  <footer>
    <h1>Footer</h1>
  </footer>
</template>
