# CompetitorWatch - Frontend

Application Next.js pour la visualisation et la gestion des articles de veille concurrentielle.

## 🚀 Fonctionnalités

- **Dashboard d'articles** - Visualisation des articles des concurrents
- **Recherche en temps réel** - Filtrage par titre, résumé et source
- **Authentification** - Système de login/register avec JWT
- **Panel Admin** - Gestion des mots-clés et utilisateurs
- **Responsive** - Interface adaptée mobile et desktop

## 📋 Prérequis

- Node.js 18+
- Accès à une base PostgreSQL (voir repo backend-infra)

## 🛠️ Installation locale

```bash
# Cloner le repo
git clone <votre-repo-frontend>
cd frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
nano .env.local

# Démarrer en développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 🌍 Variables d'environnement

### Développement local (.env.local)

```bash
# Base de données (pointer vers votre VM backend)
DATABASE_URL=postgresql://n8n:password@localhost:5432/n8n

# Auth (générer avec: openssl rand -base64 32)
NEXTAUTH_SECRET=votre-cle-secrete-aleatoire
NEXTAUTH_URL=http://localhost:3000
```

### Production (Vercel)

Configurer dans les paramètres Vercel:

```bash
DATABASE_URL=postgresql://n8n:password@votre-ip-vm:5432/n8n
NEXTAUTH_SECRET=votre-cle-secrete-production
NEXTAUTH_URL=https://votre-app.vercel.app
```

## 🚢 Déploiement sur Vercel

### Via l'interface Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer votre repo GitHub
4. **Configuration:**
   - Framework Preset: Next.js
   - Root Directory: `./` (ou laisser vide)
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Variables d'environnement:**
   - `DATABASE_URL`: URL de connexion PostgreSQL
   - `NEXTAUTH_SECRET`: Clé secrète (générer avec `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: URL de votre app Vercel

6. Cliquer sur "Deploy"

### Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Déployer en production
vercel --prod
```

## 🔑 Compte par défaut

Après initialisation de la base de données:

- **Email:** test@example.com
- **Mot de passe:** test123
- **Rôle:** Admin

## 📁 Structure du projet

```
frontend/
├── app/
│   ├── admin/              # Pages admin
│   │   ├── keywords/       # Gestion des mots-clés
│   │   └── users/          # Gestion des utilisateurs
│   ├── api/                # API Routes
│   │   ├── auth/           # Authentification
│   │   ├── articles/       # Articles
│   │   ├── keywords/       # Mots-clés
│   │   └── users/          # Utilisateurs
│   ├── components/         # Composants React
│   ├── login/              # Page de connexion
│   ├── register/           # Page d'inscription
│   └── page.tsx            # Page d'accueil
├── lib/
│   └── db.ts               # Connexion PostgreSQL
└── public/                 # Assets statiques
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## 🎨 Technologies utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **PostgreSQL** - Base de données
- **Jose** - JWT pour l'authentification
- **bcryptjs** - Hashage des mots de passe

## 🔒 Sécurité

### Authentification

- JWT stocké dans un cookie httpOnly
- Mots de passe hashés avec bcrypt (10 rounds)
- Protection CSRF via SameSite cookies

### Rôles

- **user** - Accès en lecture aux articles
- **admin** - Gestion complète (mots-clés, utilisateurs)

### API

- Toutes les routes admin vérifient le rôle
- Validation des entrées utilisateur
- Protection contre les injections SQL (requêtes paramétrées)

## 📊 Base de données

### Tables utilisées

- **app_users** - Utilisateurs
- **articles** - Articles des concurrents
- **search_keywords** - Mots-clés de scraping

Voir le repo `backend-infra` pour la structure complète.

## 🐛 Dépannage

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est accessible
psql -h votre-ip-vm -U n8n -d n8n -p 5432

# Vérifier DATABASE_URL dans .env.local
cat .env.local

# Vérifier les logs Vercel
vercel logs
```

### Erreur d'authentification

```bash
# Vérifier NEXTAUTH_SECRET
# Doit être identique entre les déploiements

# Régénérer si nécessaire
openssl rand -base64 32
```

### Build échoue sur Vercel

```bash
# Tester le build localement
npm run build

# Vérifier les logs Vercel
# Souvent lié aux variables d'environnement manquantes
```

## 🔄 Mises à jour

```bash
# Pull les derniers changements
git pull

# Installer les nouvelles dépendances
npm install

# Tester localement
npm run dev

# Commit et push
git add .
git commit -m "Update"
git push

# Vercel déploie automatiquement!
```

## 📝 Développement

### Ajouter une nouvelle page

```typescript
// app/nouvelle-page/page.tsx
export default function NouvellePage() {
  return <div>Contenu</div>;
}
```

### Ajouter une API route

```typescript
// app/api/nouvelle-route/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello' });
}
```

### Ajouter un composant

```typescript
// app/components/MonComposant.tsx
export default function MonComposant() {
  return <div>Mon composant</div>;
}
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

## 📞 Support

- Issues GitHub
- Documentation Next.js: https://nextjs.org/docs
- Documentation Vercel: https://vercel.com/docs
