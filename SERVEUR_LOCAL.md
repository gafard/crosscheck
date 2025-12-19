# 🚀 Comment démarrer un serveur local pour CrossCheck

## ⚠️ Problème CORS avec file://

Quand vous ouvrez le site directement avec `file://`, le navigateur bloque certaines fonctionnalités pour des raisons de sécurité (politique CORS). C'est pourquoi le CMS ne fonctionne pas correctement.

## ✅ Solution : Utiliser un serveur local

### Option 1 : Python (Recommandé - Simple et rapide)

```bash
# Ouvrir un terminal dans le dossier du projet
cd /Users/gafardgnane/Downloads/crosscheck-site

# Démarrer le serveur
python3 -m http.server 8000
```

Puis ouvrez dans votre navigateur :
```
http://localhost:8000/admin/index.html
```

### Option 2 : Node.js (si vous avez Node.js installé)

```bash
# Installer http-server globalement (une seule fois)
npm install -g http-server

# Puis dans le dossier du projet
cd /Users/gafardgnane/Downloads/crosscheck-site
http-server -p 8000
```

Ou avec npx (sans installation) :
```bash
cd /Users/gafardgnane/Downloads/crosscheck-site
npx http-server -p 8000
```

### Option 3 : PHP (si vous avez PHP installé)

```bash
cd /Users/gafardgnane/Downloads/crosscheck-site
php -S localhost:8000
```

### Option 4 : VS Code Live Server

Si vous utilisez VS Code :
1. Installez l'extension "Live Server"
2. Clic droit sur `admin/index.html`
3. Sélectionnez "Open with Live Server"

## 📝 Notes importantes

- Le serveur doit être démarré dans le dossier **racine** du projet (`crosscheck-site`)
- Utilisez le port **8000** (ou un autre port disponible)
- Gardez le terminal ouvert pendant que vous utilisez le CMS
- Pour arrêter le serveur, appuyez sur `Ctrl+C` dans le terminal

## 🔍 Vérification

Une fois le serveur démarré, vous devriez voir :
- ✅ Pas d'erreurs CORS dans la console
- ✅ Le CMS charge les articles correctement
- ✅ Toutes les fonctionnalités fonctionnent

