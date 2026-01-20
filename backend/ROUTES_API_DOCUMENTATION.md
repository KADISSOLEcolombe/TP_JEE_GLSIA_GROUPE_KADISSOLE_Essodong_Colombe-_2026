# 📚 DOCUMENTATION DES ROUTES API - BACKEND BANCAIRE

## Configuration générale
- **URL de base** : `http://localhost:8080`
- **Format des réponses** : JSON
- **CORS** : Activé pour tous les domaines (*)
- **Type d'authentification** : JWT Token (Bearer Token)

---

## 📋 TABLE DES MATIÈRES
1. [Authentification Admin](#authentification-admin)
2. [Authentification Client](#authentification-client)
3. [Gestion des Clients](#gestion-des-clients)
4. [Gestion des Comptes](#gestion-des-comptes)
5. [Opérations Bancaires](#opérations-bancaires)
6. [Structure des Erreurs](#structure-des-erreurs)

---

## 🔐 AUTHENTIFICATION ADMIN

### 1. Login Admin
**Endpoint:** `POST /api/auth/admin/login`

**Authentification requise:** NON

**Données d'entrée (JSON):**
```json
{
  "email": "admin@bank.com",
  "password": "admin123"
}
```

**Contraintes:**
- `email` : Doit être un email valide (obligatoire)
- `password` : Minimum 6 caractères (obligatoire)

**Exemple de réponse (Succès - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Authentification admin réussie",
  "email": "admin@bank.com"
}
```

**Exemple de réponse (Erreur - 401):**
```json
{
  "status": 401,
  "message": "Email ou mot de passe incorrect",
  "timestamp": "2026-01-20T10:30:45.123456"
}
```

**Codes HTTP possibles:**
- `200` : Authentification réussie
- `401` : Identifiants invalides
- `500` : Erreur serveur

---

### 2. Créer un nouvel Admin
**Endpoint:** `POST /api/auth/admin/register`

**Authentification requise:** NON

**Données d'entrée (JSON):**
```json
{
  "email": "nouveladmin@bank.com",
  "password": "SecurePassword123"
}
```

**Contraintes:**
- `email` : Doit être valide et unique (obligatoire)
- `password` : Minimum 6 caractères (obligatoire)

**Exemple de réponse (Succès - 201):**
```json
{
  "id": 1,
  "email": "nouveladmin@bank.com"
}
```

**Exemple de réponse (Erreur - 400):**
```json
{
  "status": 400,
  "message": "Un admin avec cet email existe déjà",
  "timestamp": "2026-01-20T10:30:45.123456"
}
```

**Codes HTTP possibles:**
- `201` : Admin créé avec succès
- `400` : Email déjà existant
- `500` : Erreur serveur

---

## 👥 AUTHENTIFICATION CLIENT

### 3. Login Client
**Endpoint:** `POST /api/auth/client/login`

**Authentification requise:** NON

**Données d'entrée (JSON):**
```json
{
  "email": "client@example.com",
  "password": "motdepasse123"
}
```

**Contraintes:**
- `email` : Doit être un email valide (obligatoire)
- `password` : Minimum 6 caractères (obligatoire)

**Exemple de réponse (Succès - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Authentification client réussie",
  "email": "client@example.com"
}
```

**Exemple de réponse (Erreur - 401):**
```json
{
  "status": 401,
  "message": "Email ou mot de passe incorrect",
  "timestamp": "2026-01-20T10:30:45.123456"
}
```

**Codes HTTP possibles:**
- `200` : Authentification réussie
- `401` : Identifiants invalides
- `500` : Erreur serveur

---

## 👤 GESTION DES CLIENTS

### 4. Récupérer tous les Clients
**Endpoint:** `GET /api/clients`

**Authentification requise:** OUI (JWT Token en Bearer)

**En-tête (Header):**
```
Authorization: Bearer <token_jwt>
```

**Paramètres:** Aucun

**Exemple de réponse (Succès - 200):**
```json
[
  {
    "id": 1,
    "nom": "Essodong",
    "prenom": "Colombe",
    "email": "colombe@example.com",
    "telephone": "+221771234567",
    "adresse": "123 Rue de la Paix, Dakar",
    "dateNaissance": "1990-05-15",
    "sexe": "F",
    "nationalité": "Sénégalaise",
    "password": "motdepasse"
  },
  ...
]
```

---

### 5. Récupérer un Client par ID
**Endpoint:** `GET /api/clients/{id}`

**Authentification requise:** OUI (JWT Token)

**Paramètres (Path):**
- `id` : ID du client (entier)

**Exemple de réponse (Succès - 200):**
```json
{
  "id": 1,
  "nom": "Essodong",
  "prenom": "Colombe",
  "email": "colombe@example.com",
  "telephone": "+221771234567",
  "adresse": "123 Rue de la Paix, Dakar",
  "dateNaissance": "1990-05-15",
  "sexe": "F",
  "nationalité": "Sénégalaise",
  "password": "motdepasse"
}
```

**Exemple de réponse (Erreur - 404):**
```json
{
  "message": "Client non trouvé"
}
```

**Codes HTTP possibles:**
- `200` : Client trouvé
- `404` : Client non trouvé
- `401` : Non authentifié

---

### 6. Créer un nouveau Client
**Endpoint:** `POST /api/clients`

**Authentification requise:** NON

**Données d'entrée (JSON):**
```json
{
  "nom": "Essodong",
  "prenom": "Colombe",
  "email": "colombe@example.com",
  "telephone": "+221771234567",
  "adresse": "123 Rue de la Paix, Dakar",
  "dateNaissance": "1990-05-15",
  "sexe": "F",
  "nationalité": "Sénégalaise",
  "password": "SecurePassword123"
}
```

**Contraintes:**
- `nom` : 2-100 caractères (obligatoire)
- `prenom` : 2-100 caractères (obligatoire)
- `email` : Format email valide (obligatoire)
- `telephone` : 9-15 chiffres (obligatoire)
- `adresse` : 5-255 caractères (obligatoire)
- `dateNaissance` : Format YYYY-MM-DD (obligatoire)
- `sexe` : 'M' ou 'F' (obligatoire)
- `nationalité` : Texte libre (obligatoire)
- `password` : Minimum 6 caractères (obligatoire)

**Exemple de réponse (Succès - 201):**
```json
{
  "id": 5,
  "nom": "Essodong",
  "prenom": "Colombe",
  "email": "colombe@example.com",
  "telephone": "+221771234567",
  "adresse": "123 Rue de la Paix, Dakar",
  "dateNaissance": "1990-05-15",
  "sexe": "F",
  "nationalité": "Sénégalaise",
  "password": "SecurePassword123"
}
```

**Codes HTTP possibles:**
- `201` : Client créé avec succès
- `400` : Données invalides
- `500` : Erreur serveur

---

### 7. Mettre à jour un Client
**Endpoint:** `PUT /api/clients/{id}`

**Authentification requise:** OUI (JWT Token)

**Paramètres (Path):**
- `id` : ID du client (entier)

**Données d'entrée (JSON) - Tous les champs sont optionnels:**
```json
{
  "nom": "Essodong",
  "prenom": "Colombe",
  "email": "colombe.updated@example.com",
  "telephone": "+221771234568",
  "adresse": "456 Avenue nouvelle, Dakar",
  "dateNaissance": "1990-05-15",
  "sexe": "F",
  "nationalité": "Sénégalaise"
}
```

**Exemple de réponse (Succès - 200):**
```json
{
  "id": 1,
  "nom": "Essodong",
  "prenom": "Colombe",
  "email": "colombe.updated@example.com",
  "telephone": "+221771234568",
  "adresse": "456 Avenue nouvelle, Dakar",
  "dateNaissance": "1990-05-15",
  "sexe": "F",
  "nationalité": "Sénégalaise",
  "password": "SecurePassword123"
}
```

**Codes HTTP possibles:**
- `200` : Client mis à jour
- `404` : Client non trouvé
- `400` : Données invalides
- `401` : Non authentifié

---

### 8. Supprimer un Client
**Endpoint:** `DELETE /api/clients/{id}`

**Authentification requise:** OUI (JWT Token)

**Paramètres (Path):**
- `id` : ID du client (entier)

**Réponse (Succès - 204):**
```
Pas de contenu
```

**Codes HTTP possibles:**
- `204` : Client supprimé
- `404` : Client non trouvé
- `401` : Non authentifié

---

## 🏦 GESTION DES COMPTES

### 9. Récupérer tous les Comptes
**Endpoint:** `GET /api/comptes`

**Authentification requise:** NON

**Paramètres:** Aucun

**Exemple de réponse (Succès - 200):**
```json
[
  {
    "numero": "FR7612345678901234567890",
    "type": "COURANT",
    "dateCreation": "2025-10-15",
    "solde": 5000.00,
    "client": {
      "id": 1,
      "nom": "Essodong",
      "prenom": "Colombe"
    }
  },
  {
    "numero": "FR7612345678901234567891",
    "type": "EPARGNE",
    "dateCreation": "2025-11-20",
    "solde": 15000.00,
    "client": {
      "id": 1,
      "nom": "Essodong",
      "prenom": "Colombe"
    }
  }
]
```

---

### 10. Récupérer un Compte par Numéro
**Endpoint:** `GET /api/comptes/{numero}`

**Authentification requise:** NON

**Paramètres (Path):**
- `numero` : Numéro du compte IBAN (string)

**Exemple de réponse (Succès - 200):**
```json
{
  "numero": "FR7612345678901234567890",
  "type": "COURANT",
  "dateCreation": "2025-10-15",
  "solde": 5000.00,
  "client": {
    "id": 1,
    "nom": "Essodong",
    "prenom": "Colombe"
  }
}
```

**Codes HTTP possibles:**
- `200` : Compte trouvé
- `404` : Compte non trouvé

---

### 11. Créer un Compte pour un Client
**Endpoint:** `POST /api/comptes/client/{clientId}`

**Authentification requise:** OUI (JWT Token)

**Paramètres (Path):**
- `clientId` : ID du client (entier)

**Paramètres (Query):**
- `type` : Type de compte - `COURANT` ou `EPARGNE` (obligatoire)

**Exemple de requête:**
```
POST /api/comptes/client/1?type=COURANT
```

**Exemple de réponse (Succès - 201):**
```json
{
  "numero": "FR7612345678901234567892",
  "type": "COURANT",
  "dateCreation": "2026-01-20",
  "solde": 0.00,
  "client": {
    "id": 1,
    "nom": "Essodong",
    "prenom": "Colombe"
  }
}
```

**Codes HTTP possibles:**
- `201` : Compte créé
- `404` : Client non trouvé
- `401` : Non authentifié

---

### 12. Mettre à jour un Compte
**Endpoint:** `PUT /api/comptes/{numero}`

**Authentification requise:** OUI (JWT Token)

**Paramètres (Path):**
- `numero` : Numéro du compte (string)

**Données d'entrée (JSON):**
```json
{
  "type": "EPARGNE",
  "solde": 10000.00
}
```

**Contraintes:**
- `solde` : Doit être >= 0

**Exemple de réponse (Succès - 200):**
```json
{
  "numero": "FR7612345678901234567890",
  "type": "EPARGNE",
  "dateCreation": "2025-10-15",
  "solde": 10000.00,
  "client": {
    "id": 1,
    "nom": "Essodong",
    "prenom": "Colombe"
  }
}
```

**Codes HTTP possibles:**
- `200` : Compte mis à jour
- `404` : Compte non trouvé
- `401` : Non authentifié

---

### 13. Supprimer un Compte
**Endpoint:** `DELETE /api/comptes/{numero}`

**Authentification requise:** OUI (JWT Token)

**Paramètres (Path):**
- `numero` : Numéro du compte (string)

**Réponse (Succès - 204):**
```
Pas de contenu
```

**Codes HTTP possibles:**
- `204` : Compte supprimé
- `404` : Compte non trouvé
- `401` : Non authentifié

---

## 💳 OPÉRATIONS BANCAIRES

### 14. Effectuer un Versement (Dépôt)
**Endpoint:** `POST /api/bank/versement`

**Authentification requise:** NON

**Paramètres (Query):**
- `compteNumero` : Numéro du compte destinataire (string, obligatoire)
- `montant` : Montant à déposer (double, obligatoire)

**Contraintes:**
- `montant` : 0.01 à 50000.00 euros

**Exemple de requête:**
```
POST /api/bank/versement?compteNumero=FR7612345678901234567890&montant=500.00
```

**Exemple de réponse (Succès - 200):**
```json
{
  "id": 1,
  "type": "VERSEMENT",
  "montant": 500.00,
  "dateTransaction": "2026-01-20T10:30:45.123456",
  "compteSource": null,
  "compteDestination": {
    "numero": "FR7612345678901234567890",
    "type": "COURANT",
    "solde": 5500.00
  },
  "description": "Versement effectué"
}
```

**Codes HTTP possibles:**
- `200` : Versement effectué
- `400` : Données invalides
- `404` : Compte non trouvé
- `500` : Erreur serveur

---

### 15. Effectuer un Retrait
**Endpoint:** `POST /api/bank/retrait`

**Authentification requise:** NON

**Paramètres (Query):**
- `compteNumero` : Numéro du compte source (string, obligatoire)
- `montant` : Montant à retirer (double, obligatoire)

**Contraintes:**
- `montant` : 0.01 à 50000.00 euros
- Le solde du compte doit être suffisant

**Exemple de requête:**
```
POST /api/bank/retrait?compteNumero=FR7612345678901234567890&montant=200.00
```

**Exemple de réponse (Succès - 200):**
```json
{
  "id": 2,
  "type": "RETRAIT",
  "montant": 200.00,
  "dateTransaction": "2026-01-20T10:35:22.654321",
  "compteSource": {
    "numero": "FR7612345678901234567890",
    "type": "COURANT",
    "solde": 5300.00
  },
  "compteDestination": null,
  "description": "Retrait effectué"
}
```

**Exemple de réponse (Erreur - Solde insuffisant):**
```json
{
  "status": 400,
  "message": "Solde insuffisant pour effectuer le retrait",
  "timestamp": "2026-01-20T10:35:22.654321"
}
```

**Codes HTTP possibles:**
- `200` : Retrait effectué
- `400` : Solde insuffisant ou données invalides
- `404` : Compte non trouvé
- `500` : Erreur serveur

---

### 16. Effectuer un Virement
**Endpoint:** `POST /api/bank/virement`

**Authentification requise:** NON

**Paramètres (Query):**
- `sourceNumero` : Numéro du compte source (string, obligatoire)
- `destNumero` : Numéro du compte destinataire (string, obligatoire)
- `montant` : Montant à virer (double, obligatoire)

**Contraintes:**
- `montant` : 0.01 à 50000.00 euros
- Le solde du compte source doit être suffisant
- Les deux comptes doivent exister et être différents

**Exemple de requête:**
```
POST /api/bank/virement?sourceNumero=FR7612345678901234567890&destNumero=FR7612345678901234567891&montant=1000.00
```

**Exemple de réponse (Succès - 200):**
```json
{
  "id": 3,
  "type": "VIREMENT",
  "montant": 1000.00,
  "dateTransaction": "2026-01-20T11:00:15.987654",
  "compteSource": {
    "numero": "FR7612345678901234567890",
    "type": "COURANT",
    "solde": 4300.00
  },
  "compteDestination": {
    "numero": "FR7612345678901234567891",
    "type": "EPARGNE",
    "solde": 16000.00
  },
  "description": "Virement effectué"
}
```

**Codes HTTP possibles:**
- `200` : Virement effectué
- `400` : Solde insuffisant ou données invalides
- `404` : Compte(s) non trouvé(s)
- `500` : Erreur serveur

---

### 17. Récupérer l'Historique des Transactions
**Endpoint:** `GET /api/bank/transactions/{compteNumero}`

**Authentification requise:** NON

**Paramètres (Path):**
- `compteNumero` : Numéro du compte (string)

**Exemple de réponse (Succès - 200):**
```json
[
  {
    "id": 1,
    "type": "VERSEMENT",
    "montant": 500.00,
    "dateTransaction": "2026-01-20T10:30:45",
    "compteSource": null,
    "compteDestination": "FR7612345678901234567890",
    "description": "Versement effectué"
  },
  {
    "id": 3,
    "type": "VIREMENT",
    "montant": 1000.00,
    "dateTransaction": "2026-01-20T11:00:15",
    "compteSource": "FR7612345678901234567890",
    "compteDestination": "FR7612345678901234567891",
    "description": "Virement effectué"
  }
]
```

---

### 18. Récupérer les Transactions sur une Période
**Endpoint:** `GET /api/bank/transactions/{compteNumero}/periode`

**Authentification requise:** NON

**Paramètres (Path):**
- `compteNumero` : Numéro du compte (string)

**Paramètres (Query):**
- `debut` : Date de début au format YYYY-MM-DD (obligatoire)
- `fin` : Date de fin au format YYYY-MM-DD (obligatoire)

**Exemple de requête:**
```
GET /api/bank/transactions/FR7612345678901234567890/periode?debut=2026-01-01&fin=2026-01-31
```

**Exemple de réponse (Succès - 200):**
```json
[
  {
    "id": 1,
    "type": "VERSEMENT",
    "montant": 500.00,
    "dateTransaction": "2026-01-20T10:30:45",
    "compteSource": null,
    "compteDestination": "FR7612345678901234567890",
    "description": "Versement effectué"
  }
]
```

---

### 19. Générer le Relevé de Compte (Complet)
**Endpoint:** `GET /api/bank/releve/{compteNumero}`

**Authentification requise:** NON

**Paramètres (Path):**
- `compteNumero` : Numéro du compte (string)

**Exemple de réponse (Succès - 200):**
```json
{
  "numeroCompte": "FR7612345678901234567890",
  "typeCompte": "COURANT",
  "clientNom": "Essodong",
  "clientPrenom": "Colombe",
  "dateGeneration": "20/01/2026 11:30:00",
  "soldeActuel": 4300.00,
  "totalDepots": 500.00,
  "totalRetraits": 200.00,
  "totalVirementsEnvoyes": 1000.00,
  "totalVirementsRecus": 0.00,
  "transactions": [
    {
      "id": 1,
      "type": "VERSEMENT",
      "montant": 500.00,
      "dateTransaction": "20/01/2026 10:30:45",
      "compteSource": null,
      "compteDestination": "FR7612345678901234567890",
      "description": "Versement effectué"
    },
    {
      "id": 2,
      "type": "RETRAIT",
      "montant": 200.00,
      "dateTransaction": "20/01/2026 10:35:22",
      "compteSource": "FR7612345678901234567890",
      "compteDestination": null,
      "description": "Retrait effectué"
    },
    {
      "id": 3,
      "type": "VIREMENT",
      "montant": 1000.00,
      "dateTransaction": "20/01/2026 11:00:15",
      "compteSource": "FR7612345678901234567890",
      "compteDestination": "FR7612345678901234567891",
      "description": "Virement effectué"
    }
  ]
}
```

---

### 20. Générer le Relevé de Compte (Période)
**Endpoint:** `GET /api/bank/releve/{compteNumero}/periode`

**Authentification requise:** NON

**Paramètres (Path):**
- `compteNumero` : Numéro du compte (string)

**Paramètres (Query):**
- `debut` : Date de début au format YYYY-MM-DD (obligatoire)
- `fin` : Date de fin au format YYYY-MM-DD (obligatoire)

**Exemple de requête:**
```
GET /api/bank/releve/FR7612345678901234567890/periode?debut=2026-01-01&fin=2026-01-31
```

**Exemple de réponse (Succès - 200):**
```json
{
  "numeroCompte": "FR7612345678901234567890",
  "typeCompte": "COURANT",
  "clientNom": "Essodong",
  "clientPrenom": "Colombe",
  "dateGeneration": "20/01/2026 11:35:00",
  "soldeActuel": 4300.00,
  "totalDepots": 500.00,
  "totalRetraits": 200.00,
  "totalVirementsEnvoyes": 1000.00,
  "totalVirementsRecus": 0.00,
  "transactions": [
    {
      "id": 1,
      "type": "VERSEMENT",
      "montant": 500.00,
      "dateTransaction": "20/01/2026 10:30:45",
      "compteSource": null,
      "compteDestination": "FR7612345678901234567890",
      "description": "Versement effectué"
    }
  ]
}
```

---

## ⚠️ STRUCTURE DES ERREURS

### Format Standard des Erreurs

**Structure générale:**
```json
{
  "status": <code_http>,
  "message": "<description_erreur>",
  "timestamp": "<date_heure_iso>"
}
```

### Erreurs Courantes

#### 400 - Requête invalide
```json
{
  "status": 400,
  "message": "Données invalides ou contraintes de validation non respectées",
  "timestamp": "2026-01-20T11:30:45.123456"
}
```

#### 401 - Non authentifié
```json
{
  "status": 401,
  "message": "Token JWT manquant ou invalide",
  "timestamp": "2026-01-20T11:30:45.123456"
}
```

#### 404 - Ressource non trouvée
```json
{
  "status": 404,
  "message": "La ressource demandée n'existe pas",
  "timestamp": "2026-01-20T11:30:45.123456"
}
```

#### 500 - Erreur serveur
```json
{
  "status": 500,
  "message": "Erreur interne du serveur",
  "timestamp": "2026-01-20T11:30:45.123456"
}
```

---

## 🔑 UTILISATION DU JWT TOKEN

### Obtenir un token
1. Appelez l'endpoint de login (Admin ou Client)
2. Récupérez le `token` de la réponse

### Utiliser le token
Ajoutez le header suivant à toutes les requêtes qui nécessitent une authentification:

```
Authorization: Bearer <votre_token_jwt>
```

**Exemple avec curl:**
```bash
curl -X GET http://localhost:8080/api/clients \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemple avec JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:8080/api/clients', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
```

**Exemple avec JavaScript/Axios:**
```javascript
axios.get('http://localhost:8080/api/clients', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

---

## 📝 NOTES IMPORTANTES

1. **CORS activé** : L'API accepte les requêtes de tous les domaines
2. **Les IBAN** : Générés automatiquement au format `FR<digits>`
3. **Solde**: Ne peut jamais être négatif
4. **Montants**: Montant minimum 0.01€, maximum 50000€
5. **Dates**: Format ISO pour les entrées (YYYY-MM-DD), format formaté pour les sorties
6. **Tokens JWT**: Valides pour une période définie, à renouveler après expiration
7. **Types de comptes**: `COURANT` ou `EPARGNE`
8. **Types de transactions**: `VERSEMENT`, `RETRAIT`, `VIREMENT`

---

**Dernière mise à jour:** 20 janvier 2026
**Version API:** 1.0
