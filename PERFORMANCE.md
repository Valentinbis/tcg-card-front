# 🚀 Optimisations de Performance

## Vue d'ensemble

Ce document décrit les optimisations de performance implémentées dans le frontend.

## 🎯 Objectifs

- Bundle size < 500KB (gzipped)
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Lighthouse Score > 90

## ⚡ Optimisations Implémentées

### 1. Images

**@nuxt/image**

- Formats modernes : WebP, AVIF
- Lazy loading natif
- Responsive images avec srcset
- Placeholder pendant chargement
- Compression qualité 80%

```vue
<LazyImage
  src="/path/to/image.jpg"
  alt="Description"
  width="300"
  height="400"
  :quality="80"
  format="webp"
/>
```

### 2. Code Splitting

**Chunks manuels**

- `primevue-core` : Composants PrimeVue
- `pinia` : State management
- `vue` : Core Vue + Router

**Résultat** : Meilleur caching, chargement parallèle

### 3. Compression

**Gzip + Brotli**

- `.gz` files pour serveurs compatibles
- `.br` files pour meilleure compression
- Réduction ~70% de la taille

### 4. Minification

**Terser**

- Suppression `console.log` en production
- Suppression `debugger`
- Dead code elimination
- Mangling des noms de variables

### 5. Lazy Loading

**Composables**

- `useLazyComponent` : Chargement client-side only
- `useDelayedLoad` : Chargement après délai
- `useInteractionLoad` : Chargement sur interaction

```ts
// Charger composant lourd après 2s
const { shouldLoad } = useDelayedLoad(2000);

// Dans le template
<HeavyComponent v-if="shouldLoad" />
```

### 6. SSR/SPA Routing

```ts
routeRules: {
  '/app/**': { ssr: false },      // SPA pour app
  '/auth/**': { ssr: false },     // SPA pour auth
  '/public/**': { ssr: true },    // SSR pour SEO
}
```

### 7. Nitro Optimizations

- `compressPublicAssets: true`
- `minify: true`
- Payload extraction pour SSR

### 8. Experimental Features

- `payloadExtraction` : Extraction payload SSR
- `viewTransition` : Transitions natives

### 9. Preconnect

```html
<link rel="preconnect" href="http://localhost:8000" />
<link rel="dns-prefetch" href="http://localhost:8000" />
```

## 📊 Analyse du Bundle

```bash
npm run build:analyze
```

Ouvre `dist/stats.html` avec visualisation interactive :

- Taille de chaque module
- Dependencies tree
- Gzip/Brotli sizes
- Identify bloat

## 🔍 Monitoring

### Lighthouse CI

```bash
npx lighthouse http://localhost:3000 --view
```

### Core Web Vitals

- **LCP** (Largest Contentful Paint) : < 2.5s
- **FID** (First Input Delay) : < 100ms
- **CLS** (Cumulative Layout Shift) : < 0.1

## 🎨 Best Practices

### Images

✅ **DO**

- Utiliser `<LazyImage>` ou `<NuxtImg>`
- Spécifier width/height pour éviter CLS
- Utiliser WebP/AVIF
- Lazy load images hors viewport

❌ **DON'T**

- Charger images haute résolution inutilement
- Oublier `alt` text
- Utiliser `<img>` standard

### Components

✅ **DO**

- Lazy load composants lourds non critiques
- Utiliser `defineAsyncComponent` pour modales
- Code split par route

❌ **DON'T**

- Importer tout dans layout
- Charger composants jamais utilisés

### JavaScript

✅ **DO**

- Utiliser composables Nuxt
- Auto-imports pour tree-shaking optimal
- Éviter large dependencies

❌ **DON'T**

- Importer librairies entières (`import _ from 'lodash'`)
- Laisser `console.log` en production
- Bundle polyfills inutiles

## 📈 Résultats Attendus

### Avant

- Bundle: ~800KB (gzipped)
- FCP: 2.5s
- TTI: 5s
- Lighthouse: 65

### Après

- Bundle: ~400KB (gzipped) 📉 -50%
- FCP: 1.2s 📉 -52%
- TTI: 2.8s 📉 -44%
- Lighthouse: 92 📈 +42%

## 🔧 Configuration

Voir `nuxt.config.ts` pour configuration complète :

- Vite optimizations
- Nitro config
- Image config
- Experimental features

## 📚 Ressources

- [Nuxt Performance](https://nuxt.com/docs/guide/going-further/performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [@nuxt/image](https://image.nuxt.com/)
