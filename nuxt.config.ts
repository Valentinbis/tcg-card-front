// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false, // Désactive le rendu côté serveur (SSR) pour une application SPA
  routeRules: {
    '/app/**': { ssr: false },
    '/auth/**': { ssr: false },
  },
  runtimeConfig: {
    public: {
      apiBase: "http://127.0.0.1:8000/api/",
    },
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    "@primevue/nuxt-module",
    "@pinia/nuxt",
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  primevue: {
    options: {
      // unstyled: true,
      ripple: true,
      locale: {
        dayNames: [
          "Lundi",
          "Mardi",
          "Mercredi",
          "Jeudi",
          "Vendredi",
          "Samedi",
          "Dimanche",
        ],
        dayNamesShort: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        dayNamesMin: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
        monthNames: [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ],
        monthNamesShort: [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Juin",
          "Juil",
          "Août",
          "Sep",
          "Oct",
          "Nov",
          "Déc",
        ],
        today: "Aujourd'hui",
        weekHeader: "Semaine",
        firstDayOfWeek: 1,
        dateFormat: "dd/mm/yy",
        fileSizeTypes: [],
        clear: "Effacer",
      },
    },
    components: {
      include: "*",
    },
    importTheme: { from: "@/themes/auratheme.ts" },
  },

  css: ["@mdi/font/css/materialdesignicons.css"],

  compatibilityDate: "2024-07-09",
});