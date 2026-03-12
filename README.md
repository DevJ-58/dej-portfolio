# 🚀 Portfolio DevJ — Guide d'installation complet

## Structure du projet

```
portfolio-devj/
├── index.html                 ← Portfolio principal (dynamique)
├── admin/
│   ├── index.html             ← Page de connexion admin
│   ├── dashboard.html         ← Tableau de bord admin
│   ├── config.php             ← ⚠️ Configuration à modifier
│   ├── database.sql           ← Script SQL à importer
│   ├── api/
│   │   └── index.php          ← API REST complète
│   └── uploads/               ← Images uploadées
└── dev_fred/
    ├── api-loader.js          ← ⚠️ URL API à modifier
    ├── script.js
    └── style.css
```

---

## ÉTAPE 1 — Installation locale (WAMP)

### 1.1 Copier le projet dans WAMP

Copie tout le dossier `portfolio-devj` dans :
```
C:\wamp64\www\portfolio-devj\
```

### 1.2 Créer la base de données

1. Ouvre **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Clique sur **"Nouvelle base de données"**
3. Nom: `portfolio_devj` → Interclassement: `utf8mb4_unicode_ci` → **Créer**
4. Clique sur **"Importer"** → Choisir le fichier → sélectionne `admin/database.sql` → **Exécuter**

### 1.3 Configurer la connexion

Ouvre `admin/config.php` et modifie :
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_devj');
define('DB_USER', 'root');        // ton utilisateur WAMP
define('DB_PASS', '');            // ton mot de passe WAMP (vide par défaut)
```

### 1.4 Tester en local

- Portfolio : `http://localhost/portfolio-devj/`
- Admin : `http://localhost/portfolio-devj/admin/`
- Login par défaut : `frejus@devj.com` / `password`

> ⚠️ **IMPORTANT** : Change le mot de passe immédiatement dans l'admin → Sécurité

---

## ÉTAPE 2 — Déploiement sur Railway.app (gratuit)

### 2.1 Créer un compte Railway

1. Va sur **[railway.app](https://railway.app)**
2. Clique **"Login"** → **"Login with GitHub"**
3. Autorise l'accès à Railway

### 2.2 Déployer la base de données MySQL

1. Dashboard Railway → **"New Project"**
2. Clique **"Database"** → **"Add MySQL"**
3. Une fois créé, clique sur la DB → onglet **"Connect"**
4. Copie les infos de connexion (Host, Port, User, Password, Database)

### 2.3 Importer la base de données sur Railway

Utilise un outil comme **TablePlus** (gratuit) ou **MySQL Workbench** :
- Connecte-toi avec les infos Railway
- Importe le fichier `admin/database.sql`

### 2.4 Déployer le code PHP

1. Dans ton projet Railway → **"New Service"** → **"GitHub Repo"**
2. Connecte ton GitHub, sélectionne le repo
3. Railway détecte PHP automatiquement
4. Une fois déployé, tu obtiens une URL comme `https://portfolio-xxx.up.railway.app`

### 2.5 Mettre à jour les configs

**Dans `admin/config.php`** :
```php
define('DB_HOST', 'ton-host.railway.internal');
define('DB_NAME', 'railway');
define('DB_USER', 'root');
define('DB_PASS', 'ton-mot-de-passe-railway');
define('ALLOWED_ORIGIN', 'https://ton-portfolio.netlify.app');
```

**Dans `dev_fred/api-loader.js`** :
```js
// Remplace cette ligne :
'https://TON-URL-RAILWAY.up.railway.app/admin/api/index.php'
// Par ton URL Railway réelle
```

---

## ÉTAPE 3 — Déployer le portfolio sur Netlify

1. Va sur **[netlify.com](https://netlify.com)** → connecte-toi
2. Glisse-dépose le dossier du portfolio (sans le dossier `admin/`) dans Netlify
3. OU connecte ton repo GitHub
4. Ton portfolio est en ligne !

---

## Identifiants par défaut

| Champ | Valeur |
|-------|--------|
| Email | `frejus@devj.com` |
| Mot de passe | `password` |

> ⚠️ **Change le mot de passe** immédiatement via Admin → Sécurité !

---

## Sections gérables depuis l'admin

| Section | Ce que tu peux modifier |
|---------|------------------------|
| 🎭 Hero | Nom, titre, titres animés, description, stats, photo, réseaux |
| 👤 À Propos | Textes, localisation, disponibilité, photo |
| ⚡ Compétences | Ajouter/modifier/supprimer, niveaux, catégories |
| 💼 Projets | CRUD complet avec images, liens, technologies |
| 💰 Services | Tarifs, fonctionnalités, mise en avant |
| ❓ FAQ | Questions/réponses |
| 📞 Contact | Email, WhatsApp, réseaux sociaux |
| 🎨 Thème | Couleurs primaire/secondaire/accent/fond |
| 📥 Messages | Voir les messages du formulaire de contact |
| 🔐 Sécurité | Changer le mot de passe admin |

---

## En cas de problème

- **Erreur connexion DB** : Vérifie que WAMP est démarré (icône verte)
- **Page blanche PHP** : Vérifie les logs WAMP → `C:\wamp64\logs\php_error.log`
- **Les données ne s'affichent pas** : Vérifie la console du navigateur (F12)
- **CORS error** : Mets à jour `ALLOWED_ORIGIN` dans `config.php`
