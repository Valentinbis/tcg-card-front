# 🎨 Frontend Nuxt - Guide des fonctionnalités

## 📦 State Management (Pinia)

### Stores disponibles

#### 1. `useAuthStore` - Authentification
```typescript
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// State
authStore.user           // User | null
authStore.authenticated  // boolean
authStore.loading        // boolean
authStore.errorMessage   // string | null

// Actions
await authStore.login({ email, password })
await authStore.register({ firstName, lastName, email, password })
await authStore.logout()
await authStore.refreshToken()
await authStore.verifyToken()
```

#### 2. `useCardsStore` - Gestion des cartes
```typescript
import { useCardsStore } from '~/stores/cards'

const cardsStore = useCardsStore()

// State
cardsStore.cards         // Card[]
cardsStore.selectedCard  // Card | null
cardsStore.loading       // boolean
cardsStore.pagination    // { currentPage, totalPages, totalItems, itemsPerPage }
cardsStore.filters       // CardFilters

// Actions
await cardsStore.fetchCards({ search: 'Pikachu', page: 1 })
await cardsStore.fetchCardById('card-id')
cardsStore.setFilters({ search: 'value', rarity: 'rare' })
cardsStore.clearFilters()
cardsStore.nextPage()
cardsStore.previousPage()
cardsStore.goToPage(3)
```

#### 3. `useCollectionStore` - Collection utilisateur
```typescript
import { useCollectionStore } from '~/stores/collection'

const collectionStore = useCollectionStore()

// State
collectionStore.userCards  // UserCard[]
collectionStore.loading    // boolean

// Actions
await collectionStore.fetchUserCards()
await collectionStore.addCardToCollection('card-id', 2, ['fr', 'en'])
await collectionStore.updateCardInCollection('card-id', 3, ['fr'])
await collectionStore.removeCardFromCollection('card-id')

// Helpers
collectionStore.hasCard('card-id')           // boolean
collectionStore.getCardQuantity('card-id')   // number
```

#### 4. `useToastStore` - Notifications
```typescript
import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()

// Actions
toastStore.success('Titre', 'Détails optionnels', 3000)
toastStore.error('Erreur', 'Message d\'erreur')
toastStore.warn('Attention', 'Avertissement')
toastStore.info('Info', 'Information')
toastStore.clear()  // Efface tous les toasts
```

#### 5. `useLoadingStore` - États de chargement
```typescript
import { useLoadingStore } from '~/stores/loading'

const loadingStore = useLoadingStore()

// Actions
loadingStore.startLoading('myOperation')
loadingStore.stopLoading('myOperation')
loadingStore.isLoading('myOperation')     // boolean
loadingStore.isAnyLoading()               // boolean
```

---

## 🎯 Composables

### `useToast`
```typescript
const { showSuccess, showError, showInfo, showWarn } = useToast()

showSuccess('Opération réussie !')
showError('Une erreur est survenue', 'Détails...')
```

### `useLoading`
```typescript
const { startLoading, stopLoading, isLoading, withLoading } = useLoading()

// Méthode manuelle
startLoading('login')
await loginUser()
stopLoading('login')

// Méthode automatique (recommandé)
await withLoading('login', async () => {
  await loginUser()
})
```

### `useValidation`
```typescript
const validation = useValidation()

// State
validation.errors  // Record<string, string>

// Méthodes
validation.validateEmail('test@example.com')
validation.validatePassword('password123', 'password', true) // strong = true
validation.validateName('John', 'firstName')
validation.validatePasswordMatch('pass123', 'pass123', 'confirmPassword')
validation.clearErrors()
validation.clearError('email')
```

### `useAPI`
```typescript
const { data, error, pending } = await useAPI<MyType>('endpoint', {
  method: 'GET',
  params: { page: 1, limit: 20 },
  default: () => [],
})
```

---

## 🛡️ Gestion d'erreurs globale

Le plugin `api.ts` gère automatiquement :

### Erreurs HTTP
- **400** : Requête invalide → Toast error
- **401** : Non authentifié → Refresh token automatique ou redirect login
- **403** : Accès refusé → Toast error
- **404** : Non trouvé → Toast error
- **422** : Validation → Toast avec premier message d'erreur
- **429** : Rate limit → Toast warn avec retry after
- **500** : Erreur serveur → Toast error
- **503** : Service indisponible → Toast error

### Refresh Token automatique
Lorsqu'une requête reçoit un **401** :
1. Le plugin intercepte l'erreur
2. Tente un refresh du token
3. Si succès : rejoue la requête automatiquement
4. Si échec : déconnecte et redirige vers `/auth/login`

### File d'attente
Pendant le refresh token, toutes les requêtes sont mises en file d'attente et rejouées une fois le token rafraîchi.

---

## 🎨 Composants globaux

### `<AppGlobalToast />`
Affiche automatiquement les notifications.  
Déjà inclus dans `layouts/default.vue`.

### `<AppGlobalLoading />`
Overlay de chargement global.  
S'affiche quand `loadingStore.isAnyLoading() === true`.

---

## 🧩 Exemple complet : Page avec formulaire

```vue
<template>
  <div class="page">
    <h1>Ajouter une carte à ma collection</h1>

    <form @submit.prevent="handleSubmit">
      <input
        v-model="cardId"
        placeholder="ID de la carte"
        :class="{ 'error': validation.errors.cardId }"
      />
      <p v-if="validation.errors.cardId" class="error-message">
        {{ validation.errors.cardId }}
      </p>

      <button type="submit" :disabled="isLoading('addCard')">
        <span v-if="!isLoading('addCard')">Ajouter</span>
        <span v-else>Ajout en cours...</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useCollectionStore } from '~/stores/collection'
import { useValidation } from '~/composables/useValidation'
import { useLoading } from '~/composables/useLoading'
import { useToast } from '~/composables/useToast'

const collectionStore = useCollectionStore()
const validation = useValidation()
const { withLoading, isLoading } = useLoading()
const { showSuccess, showError } = useToast()

const cardId = ref('')

const handleSubmit = async () => {
  validation.clearErrors()

  if (!cardId.value) {
    validation.errors.value.cardId = 'ID requis'
    return
  }

  await withLoading('addCard', async () => {
    const success = await collectionStore.addCardToCollection(cardId.value)

    if (success) {
      showSuccess('Carte ajoutée', 'La carte a été ajoutée à votre collection')
      cardId.value = ''
    } else {
      showError('Erreur', collectionStore.error || 'Impossible d\'ajouter la carte')
    }
  })
}
</script>
```

---

## ✅ Bonnes pratiques

### 1. Toujours utiliser `withLoading`
```typescript
// ❌ Mauvais
startLoading('operation')
await doSomething()
stopLoading('operation')

// ✅ Bon
await withLoading('operation', async () => {
  await doSomething()
})
```

### 2. Valider avant de soumettre
```typescript
// ✅ Bon
const handleSubmit = async () => {
  validation.clearErrors()

  if (!validation.validateEmail(email)) return
  if (!validation.validatePassword(password)) return

  await submitForm()
}
```

### 3. Afficher les feedbacks utilisateur
```typescript
// ✅ Bon
const success = await myAction()

if (success) {
  showSuccess('Opération réussie !')
} else {
  showError('Erreur', errorMessage)
}
```

### 4. Utiliser les stores pour l'état partagé
```typescript
// ❌ Mauvais - useState local
const cards = useState('cards', () => [])

// ✅ Bon - Store Pinia
const cardsStore = useCardsStore()
const cards = computed(() => cardsStore.cards)
```

### 5. Gérer les erreurs API
```typescript
// ✅ Les erreurs sont gérées automatiquement par le plugin api.ts
// Mais vous pouvez ajouter une logique custom si besoin
try {
  await useAPI('endpoint', { method: 'POST', body: data })
} catch (error) {
  // Logique custom en plus de la gestion globale
  console.error('Custom error handling', error)
}
```

---

## 🔧 Configuration

### Variables d'environnement
Fichier `.env` :
```bash
NUXT_PUBLIC_API_URL=http://localhost:8000/api/
```

Production (Vercel) :
```bash
NUXT_PUBLIC_API_URL=https://your-api.railway.app/api/
```

---

## 🚀 Prochaines améliorations possibles

- [ ] Ajouter Vee-Validate pour validation avancée
- [ ] Intégrer Zod pour validation de schémas
- [ ] Ajouter tests Vitest/Playwright
- [ ] Implémenter PWA avec offline support
- [ ] Ajouter i18n pour multi-langue
- [ ] Optimiser images avec Nuxt Image

---

## 📚 Ressources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [PrimeVue Components](https://primevue.org/)
- [TailwindCSS](https://tailwindcss.com/)
