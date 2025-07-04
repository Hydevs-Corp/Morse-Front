# Quick Start

If you want to start quickly, navigate to the backend repository (`morse-back`) and run the following command:

```bash
docker compose up
```

---

# 📡 Morse Front

Une application web moderne de chat en temps réel avec traduction automatique en code Morse, développée avec React et TypeScript.

## 🚀 Fonctionnalités

### 💬 Chat en temps réel

- Messages instantanés avec WebSocket (Subscription GraphQL)

- Conversations privées et de groupe

- Gestion des participants

- Historique des conversations

### 🔤 Code Morse

- Traduction automatique bidirectionnelle (texte ↔ Morse)

- Visualisation en temps réel du code Morse

- Documentation interactive avec exemples

- Tableau de correspondance complet

### 👤 Gestion des utilisateurs

- Authentification sécurisée (inscription/connexion)

- Profils utilisateurs avec avatars

### 🎨 Interface utilisateur

- Design moderne et responsive avec Mantine UI

- Thème personnalisable

- Navigation intuitive

- Notifications en temps réel

## 🛠️ Technologies utilisées

### Frontend Core

- **React 19.1.0** - Framework frontend

- **TypeScript 5.8.3** - Typage statique

- **Vite 6.3.5** - Build tool et dev server

### Interface utilisateur

- **Mantine UI 8.1.1** - Bibliothèque de composants

- **Tabler Icons** - Icônes

- **React Router 7.6.2** - Routage

### Communication

- **Apollo Client 3.13.8** - Client GraphQL

- **GraphQL 16.11.0** - API query language

- **GraphQL-WS 6.0.5** - WebSocket pour GraphQL subscriptions

### Utilitaires

- **Morse Code Translator** - Traduction Morse

- **ESLint & Prettier** - Linting et formatage

## 📋 Prérequis

- **Node.js** (version 22 ou supérieure)

- **npm**

- **Docker** (optionnel pour la conteneurisation)

## 🚀 Installation et démarrage

### Option 1: Avec Docker (recommandé)

1. **Clonez le repository et naviguez dans le dossier**

   ```bash

   git clone https://github.com/Hydevs-Corp/Morse-Front.git

   cd Morse-Front

   ```

2. **Construisez l'image Docker**

   ```bash

   docker build -t angysquirrel/morse-front .

   ```

3. **Lancez le conteneur**

   ```bash

   docker run -p 5173:80 angysquirrel/morse-front

   ```

4. **Accédez à l'application**

   - L'application sera accessible sur: `http://localhost:5173`

### Option 2: Docker Compose (avec l'écosystème complet)

Si vous utilisez tout l'écosystème Morse, incluant le backend :

1. **Clonez le repository principal**

   ```bash

   git clone https://github.com/Hydevs-Corp/Morse-Back.git

   cd Morse-Back

   ```

2. **Lancez l'ensemble des services**

   ```bash

   docker-compose up -d

   ```

3. **Accédez aux services**

   - Frontend: `http://localhost:85`

   - Backend: `http://localhost:3001`

### Option 3: Installation locale (développement)

1. **Clonez le repository et naviguez dans le dossier**

   ```bash

   git clone https://github.com/Hydevs-Corp/Morse-Front.git

   cd Morse-Front

   ```

2. **Installez les dépendances**

   ```bash

   npm install

   ```

3. **Démarrez le serveur de développement**

   ```bash

   npm run dev

   ```

4. **Ouvrez votre navigateur**

   - L'application sera accessible sur: `http://localhost:5173`

---

Pour plus d'informations sur le backend, consultez le [README de Morse-Back](https://github.com/Hydevs-Corp/Morse-Back).

## 🛠️ Scripts disponibles

```bash

# Développement avec hot reload

npm run dev



# Build de production

npm run build



# Prévisualisation du build

npm run preview



# Linting du code

npm run lint



# Formatage du code

npm run format

```

## 🔧 Configuration

### Configuration Nginx (Production)

Le projet inclut une configuration Nginx optimisée (`nginx.conf`) avec:

- Gestion du routage SPA

- Cache des assets statiques

- Compression et optimisations

## 📁 Structure du projet

```

morse-front/

├── src/

│   ├── components/          # Composants réutilisables

│   │   ├── auth/           # Authentification

│   │   ├── conversations/  # Chat et conversations

│   │   ├── morse/          # Composants Morse

│   │   └── ...

│   ├── pages/              # Pages principales

│   ├── providers/          # Context providers

│   ├── graphql/            # Requêtes GraphQL

│   ├── hook/               # Hooks personnalisés

│   ├── layout/             # Composants de layout

│   └── assets/             # Ressources statiques

├── public/                 # Fichiers publics

├── Dockerfile              # Configuration Docker

├── nginx.conf              # Configuration Nginx

└── package.json           # Dépendances et scripts

```

## 📝 Notes de développement

### Hot Reload

Le serveur de développement Vite supporte le hot reload pour une expérience de développement optimale.

### TypeScript

Le projet utilise TypeScript avec une configuration stricte pour une meilleure qualité de code.

### Linting et Formatage

- ESLint pour la détection d'erreurs

- Prettier pour le formatage automatique

- Configuration des hooks React

### Build de production

Le build génère des fichiers optimisés dans le dossier `dist/` avec:

- Minification du code

- Optimisation des assets

- Tree shaking

## 🐛 Dépannage

### Erreurs de dépendances

Si vous rencontrez des erreurs lors de l'installation:

```bash

npm install --legacy-peer-deps

```

### Port déjà utilisé

Si le port 5173 est occupé, Vite choisira automatiquement le port suivant disponible.

### Problèmes de WebSocket

Vérifiez que le backend GraphQL est démarré et accessible pour les subscriptions en temps réel.

## 📄 Licence

Ce projet est développé dans un cadre éducatif.

## 👥 Auteurs

- **Sébastien Branly**

- **Guillaume Maugin**

- **Louis Réville**

---

_Développé avec ❤️ pour le projet Morse - Une nouvelle façon de communiquer_
