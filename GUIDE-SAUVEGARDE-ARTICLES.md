# Guide de Sauvegarde des Articles - CrossCheck

## Problème : L'article n'apparaît pas sur le site

Si vous avez créé un article via le CMS mais qu'il n'apparaît pas sur le site, voici comment résoudre le problème.

## Solution 1 : Sauvegarde automatique (Recommandé)

1. **Ouvrez le CMS** : `admin/index.html` dans votre navigateur
2. **Vérifiez que votre article apparaît** dans la liste des articles
3. **Sélectionnez les dossiers** :
   - Cliquez sur le bouton **"Sélectionner les dossiers"**
   - Sélectionnez le dossier `data/` de votre projet
   - Sélectionnez le dossier `js/` de votre projet
4. **Créez ou modifiez un article**
5. **Cliquez sur "Publier"** - Les fichiers seront sauvegardés automatiquement

## Solution 2 : Sauvegarde manuelle (Si l'API n'est pas supportée)

1. **Ouvrez le CMS** : `admin/index.html`
2. **Créez ou modifiez votre article**
3. **Cliquez sur "Publier"**
4. **Les fichiers seront téléchargés** :
   - `articles.json` → Remplacez `data/articles.json`
   - `articles-data.js` → Remplacez `js/articles-data.js`
5. **Rechargez la page** du site

## Solution 3 : Régénérer articles-data.js depuis articles.json

Si `data/articles.json` contient vos articles mais que `js/articles-data.js` est vide :

```bash
cd "/Users/gafardgnane/Downloads/crosscheck-site"
node regenerer-articles-data.js
```

## Vérification

Pour vérifier que vos articles sont bien sauvegardés :

1. Ouvrez `data/articles.json` - Il doit contenir vos articles
2. Ouvrez `js/articles-data.js` - Il doit contenir `const ARTICLES_DATA = {...}`
3. Rechargez la page d'accueil du site

## Notes importantes

- ⚠️ Les articles sont sauvegardés dans **deux fichiers** :
  - `data/articles.json` (pour le serveur)
  - `js/articles-data.js` (pour le mode file://)
- ✅ Les deux fichiers doivent être synchronisés
- 🔄 Après chaque modification, rechargez la page du site

