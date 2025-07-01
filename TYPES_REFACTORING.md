# Types Refactoring Documentation

## Vue d'ensemble

Ce document explique la refactorisation des types effectuée pour éliminer les doublons et améliorer la maintenabilité du code.

## Structure des types refactorisée

### 1. Types centralisés (`src/scripts/types/`)

- **`types.ts`** : Contient tous les types de données centraux
- **`index.ts`** : Point d'entrée pour l'export des types

### 2. Fragments GraphQL (`src/graphql/fragments/`)

- **`fragments.ts`** : Fragments GraphQL réutilisables qui correspondent aux types centraux

### 3. Types de providers (`src/providers/`)

- **`auth.types.ts`** : Types spécifiques à l'authentification
- **`settings.types.ts`** : Types spécifiques aux paramètres
- **`useSettings.tsx`** : Hook séparé pour éviter les problèmes de Fast Refresh

## Types principaux

### Entités core

```typescript
- User : Représente un utilisateur
- Message : Représente un message
- Conversation : Représente une conversation
```

### Types d'authentification

```typescript
- AuthModel : User avec token optionnel
- AuthPayload : Réponse d'authentification avec token et user
```

### Types de réponses GraphQL

```typescript
-GetUsersResponse -
    GetConversationResponse -
    GetMyConversationsResponse -
    SendMessageResponse -
    UpdateMessageResponse -
    DeleteMessageResponse -
    SigninResponse -
    SignupResponse -
    GetMeResponse;
```

## Améliorations apportées

### 1. Élimination des doublons

- ❌ **Avant** : `QueryResult` interface locale dans `FriendList.tsx`
- ✅ **Après** : Utilisation de `GetUsersResponse` centralisé

- ❌ **Avant** : `MessageProps` interface locale dans `Message.tsx`
- ✅ **Après** : Type `MessageProps` centralisé dans `types.ts`

- ❌ **Avant** : Types Settings dupliqués dans `SettingsProviders.tsx`
- ✅ **Après** : Types Settings centralisés avec fichier dédié

### 2. Fragments GraphQL réutilisables

- `USER_FRAGMENT` : Fragment pour les données utilisateur
- `MESSAGE_FRAGMENT` : Fragment pour les messages
- `CONVERSATION_FRAGMENT` : Fragment pour les conversations complètes
- `CONVERSATION_MINIMAL_FRAGMENT` : Fragment pour les conversations sans messages

### 3. Cohérence des imports

- Import centralisé via `src/scripts/types/index.ts`
- Separation des hooks pour éviter les problèmes React Fast Refresh
- Types de providers dans des fichiers dédiés

### 4. Types GraphQL typés

- Toutes les requêtes utilisent maintenant des fragments typés
- Les réponses GraphQL ont des types dédiés
- Cohérence entre les fragments GraphQL et les types TypeScript

## Usage recommandé

### Import des types

```typescript
// Import centralisé
import type { User, Message, Conversation } from '../scripts/types';

// Import spécifique pour les providers
import type { AuthContextType } from '../providers/auth.types';
import type { SettingsContextType } from '../providers/settings.types';
```

### Utilisation des fragments GraphQL

```typescript
import { USER_FRAGMENT } from '../graphql/fragments/fragments';

const MY_QUERY = gql`
    query MyQuery {
        users {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;
```

## Benefits

1. **Maintenabilité** : Un seul endroit pour modifier les types
2. **Consistance** : Types GraphQL et TypeScript alignés
3. **DRY** : Élimination des définitions dupliquées
4. **Type Safety** : Meilleure sécurité des types dans toute l'application
5. **Performance** : Fragments GraphQL réutilisables optimisent les requêtes
6. **Developer Experience** : Imports simplifiés et autocomplétion améliorée

## Migration checklist

- ✅ Types centralisés dans `types.ts`
- ✅ Fragments GraphQL créés
- ✅ Queries/Mutations mises à jour pour utiliser les fragments
- ✅ Interfaces locales supprimées et remplacées par les types centraux
- ✅ Providers refactorisés avec types séparés
- ✅ Hook useSettings extrait pour résoudre Fast Refresh
- ✅ Compilation vérifiée et fonctionnelle
