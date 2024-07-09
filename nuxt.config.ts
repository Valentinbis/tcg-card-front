// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: "http://192.168.111.119:8000/api/",
    },
  },

  devtools: {
    enabled: false,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    '@primevue/nuxt-module',
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],

  primevue: {
    options: {
      ripple: true,
    },
    components: {
      include: "*",
    },
    importTheme: { from: '@/themes/auratheme.ts' },
  },

  css: [
    "@mdi/font/css/materialdesignicons.css",
  ],

  compatibilityDate: "2024-07-09",
});