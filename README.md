# TCG Card Collection - Frontend

[![CI/CD](https://github.com/YOUR_USERNAME/tcg-card-front/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/tcg-card-front/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/tcg-card-front/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/tcg-card-front)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Application web moderne de gestion de collection de cartes Pokémon TCG, construite avec Nuxt 3, Vue 3, et PrimeVue.

## 🚀 Fonctionnalités

- ✅ **Recherche avancée** : Filtres multiples (type, rareté, série, HP, attaque)
- ✅ **Gestion de collection** : Ajout/suppression de cartes avec langues multiples
- ✅ **Statistiques détaillées** : Progression par set, valeur totale, type favori
- ✅ **Interface moderne** : PrimeVue UI avec thème personnalisable
- ✅ **États de chargement** : Loading states et skeletons pour une UX fluide
- ✅ **Confirmations** : Dialogs de confirmation avant suppressions
- ✅ **Notifications** : Toast notifications pour tous les feedbacks
- ✅ **TypeScript** : Type-safety complète sur toute l'application
- ✅ **Tests unitaires** : Coverage des composables critiques

## 📋 Prérequis

- Node.js >= 18.x
- npm >= 9.x
- API Backend (Symfony) en cours d'exécution

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/YOUR_USERNAME/tcg-card-front.git
cd tcg-card-front

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer l'URL de l'API dans .env
# NUXT_PUBLIC_API_BASE=http://localhost:8000/api/
```

## 💻 Développement

```bash
# Démarrer le serveur de développement
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm test

# Lancer les tests une seule fois
npm run test:run

# Générer le rapport de coverage
npm run test:coverage

# Interface UI pour les tests
npm run test:ui
```

## 📝 Qualité du code

```bash
# Lancer ESLint
npm run lint

# Corriger automatiquement les erreurs ESLint
npm run lint:fix

# Vérifier le formatage Prettier
npm run format:check

# Formater le code avec Prettier
npm run format

# Vérifier les types TypeScript
npm run type-check

# Lancer toutes les vérifications de qualité
npm run quality
```

## 🏗️ Build de production

```bash
# Build pour production
npm run build

# Prévisualiser le build de production localement
npm run preview

# Analyser le bundle
npm run build:analyze
```

## 📁 Structure du projet

```
front/
├── .github/
│   └── workflows/
│       └── ci.yml              # Configuration CI/CD
├── assets/
│   └── css/                    # Styles globaux
├── components/
│   ├── app/                    # Composants spécifiques app
│   └── ui/                     # Composants UI réutilisables
├── composables/
│   ├── useAPI.ts              # Wrapper pour appels API
│   └── useUserCards.ts        # Gestion collection cartes
├── layouts/                    # Layouts Nuxt
├── middleware/                 # Middleware de routing
├── pages/
│   ├── app/                   # Pages de l'application
│   │   ├── search.vue         # Recherche de cartes
│   │   ├── cards.vue          # Ma collection
│   │   ├── collection.vue     # Stats par set
│   │   ├── profile.vue        # Profil utilisateur
│   │   └── settings.vue       # Paramètres
│   └── index.vue              # Page d'accueil
├── plugins/                    # Plugins Nuxt
├── stores/                     # Pinia stores
├── tests/
│   ├── composables/           # Tests des composables
│   ├── stores/                # Tests des stores
│   └── setup.ts               # Configuration tests
├── types/
│   └── api.ts                 # Types TypeScript API
└── utils/                     # Utilitaires

```

## 🎨 Technologies utilisées

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Library**: [PrimeVue 4](https://primevue.org/)
- **CSS Framework**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Testing**: [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/)
- **Linting**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de l'API Backend
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/

# Autres configurations...
```

### PrimeVue Thème

Le thème PrimeVue est configuré dans `nuxt.config.ts`. Vous pouvez personnaliser :

- Palette de couleurs
- Taille des composants
- Mode sombre/clair

## 📊 Coverage des tests

Les tests couvrent actuellement :

- ✅ Composables : `useUserCards` (10 tests)
- ✅ Stores : `auth`, `toast`, `loading`
- ✅ Validations : `useValidation` (26 tests)

Objectif de coverage : 80% minimum sur toutes les métriques

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Convention de commits

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, style
- `refactor:` Refactoring de code
- `perf:` Amélioration de performance
- `test:` Ajout/modification de tests
- `chore:` Tâches de maintenance

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - _Développeur initial_

## 🔗 Liens utiles

- [Documentation Nuxt 3](https://nuxt.com/docs)
- [Documentation PrimeVue](https://primevue.org/)
- [API Backend Repository](https://github.com/YOUR_USERNAME/tcg-card-api)
