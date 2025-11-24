// https://nuxt.com/docs/api/configuration/nuxt-config
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineNuxtConfig({
  // ssr: false, // Désactive le rendu côté serveur (SSR) pour une application SPA
  routeRules: {
    '/app/**': { ssr: false },
    '/auth/**': { ssr: false },
    '/public/**': { ssr: true },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
    },
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/image',
  ],

  // Performance: Image optimization
  image: {
    format: ['webp', 'avif', 'jpeg'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // Performance: Vite optimizations
  vite: {
    build: {
      // Chunk splitting pour meilleur caching
      rollupOptions: {
        output: {
          manualChunks: {
            'primevue-core': ['primevue'],
            pinia: ['pinia'],
            vue: ['vue', 'vue-router'],
          },
        },
        plugins: [
          visualizer({
            filename: './dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
          }) as Plugin,
        ],
      },
      // Minification optimale
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Retire les console.log en production
          drop_debugger: true,
        },
      },
      // Taille des chunks
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['pinia', 'vue', 'vue-router'],
    },
    plugins: [
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
    ],
  },

  // Performance: Nitro optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  // Performance: Experimental features
  experimental: {
    payloadExtraction: true, // Extraction du payload pour SSR
    viewTransition: true, // Transitions de page natives
  },

  // Performance: App config
  app: {
    head: {
      link: [
        // Preconnect aux domaines externes (dynamique selon l'environnement)
        {
          rel: 'preconnect',
          href: process.env.NUXT_PUBLIC_API_BASE
            ? new URL(process.env.NUXT_PUBLIC_API_BASE).origin
            : 'http://localhost:8000',
        },
        {
          rel: 'dns-prefetch',
          href: process.env.NUXT_PUBLIC_API_BASE
            ? new URL(process.env.NUXT_PUBLIC_API_BASE).origin
            : 'http://localhost:8000',
        },
      ],
    },
  },

  primevue: {
    options: {
      // unstyled: true,
      ripple: true,
      locale: {
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        dayNamesShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        dayNamesMin: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        monthNames: [
          'Janvier',
          'Février',
          'Mars',
          'Avril',
          'Mai',
          'Juin',
          'Juillet',
          'Août',
          'Septembre',
          'Octobre',
          'Novembre',
          'Décembre',
        ],
        monthNamesShort: [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Juin',
          'Juil',
          'Août',
          'Sep',
          'Oct',
          'Nov',
          'Déc',
        ],
        today: "Aujourd'hui",
        weekHeader: 'Semaine',
        firstDayOfWeek: 1,
        dateFormat: 'dd/mm/yy',
        fileSizeTypes: [],
        clear: 'Effacer',
      },
    },
    components: {
      include: '*',
    },
    importTheme: { from: '@/themes/Auratheme.ts' },
  },

  css: [
    'primeicons/primeicons.css',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/css/animations.css',
  ],

  compatibilityDate: '2024-11-01',
});
