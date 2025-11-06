<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";
import type { User } from "~/types/user";

const router = useRouter();
const { register } = useAuthStore();

const { authenticated, errorMessage } = storeToRefs(useAuthStore());

const user = ref<User>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const registerEvent = async () => {
  await register(user.value);
  // redirect to homepage if user is authenticated
  if (authenticated.value) {
    router.push("/app/home");
  }
};
</script>

<template>
  <div
    class="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl"
  >
    <div class="flex flex-row gap-3 pb-4">
      <div>
        <img src="" width="50" alt="Logo" />
      </div>
      <h1 class="text-3xl font-bold text-[#4B5563] text-[#4B5563] my-auto">
        CashTrack
      </h1>
    </div>
    <div class="text-sm font-light text-[#6B7280] pb-8">
      Créer un compte sur TCG Card.
    </div>
    
    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="registerEvent" class="flex flex-col">
      <div class="pb-2">
        <label for="email" class="block mb-2 text-sm font-medium text-[#111827]"
          >Prénom</label
        >
        <div class="relative text-gray-400">
          <InputText
            v-model="user.firstName"
            type="text"
            name="name"
            id="name"
            class="mb-2 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            placeholder="Michel"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="pb-2">
        <label for="email" class="block mb-2 text-sm font-medium text-[#111827]"
          >Nom</label
        >
        <div class="relative text-gray-400">
          <input
            v-model="user.lastName"
            type="text"
            name="name"
            id="name"
            class="mb-2 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            placeholder="Durant"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="pb-2">
        <label for="email" class="block mb-2 text-sm font-medium text-[#111827]"
          >Email</label
        >
        <div class="relative text-gray-400">
          <input
            v-model="user.email"
            type="email"
            name="email"
            id="email"
            class="mb-2 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            placeholder="name@company.com"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="pb-6">
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-[#111827]"
          >Mot de passe</label
        >
        <div class="relative text-gray-400">
          <Password
            type="password"
            id="password"
            v-model="user.password"
            toggleMask
            :inputProps="{ autocomplete: 'new-password' }"
            fluid
            placeholder="••••••••••"
          >
            <template #header>
              <div class="font-semibold text-xm mb-4">
                Entrer un mot de passe
              </div>
            </template>
            <template #footer>
              <Divider />
              <ul class="pl-2 ml-2 my-0 leading-normal">
                <li>Au moins une minuscule</li>
                <li>Au moins une majuscule</li>
                <li>Au moins un chiffre</li>
                <li>Minimum 8 caractères</li>
              </ul>
            </template>
          </Password>
        </div>
      </div>
      <Button
        type="submit"
        class="w-full text-[#FFFFFF] bg-[#4F46E5] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
      >
        Créer un compte
      </Button>
      <div class="text-sm font-light text-[#6B7280] text-center">
        Vous avez déjà un compte ?
        <nuxt-link to="/auth/login">
          <a class="font-medium text-[#4F46E5] hover:underline">Se connecter</a>
        </nuxt-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.button-register {
  margin-top: 20px;
}
.font-semibold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem; /* 14px */
}

.mb-4 {
  margin-bottom: 1rem; /* 16px */
}

.pl-2 {
  padding-left: 0.5rem; /* 8px */
}

.ml-2 {
  margin-left: 0.5rem; /* 8px */
}

.my-0 {
  margin-top: 0;
  margin-bottom: 0;
}

.leading-normal {
  line-height: 1.5;
}
</style>
