# 🔧 Debug CMS - Guide de Résolution des Problèmes

## ✅ Corrections Appliquées

### Problème Principal
Le CMS ne chargeait pas les articles car `loadRealArticles()` est une fonction **async** mais était appelée **sans await**.

### Corrections Effectuées
1. ✅ Ajout de `await` devant `loadRealArticles()` dans l'initialisation
2. ✅ Amélioration de la gestion des erreurs avec des logs détaillés
3. ✅ Vérification que les articles sont chargés avant d'afficher dans l'onglet "Gérer"

## 🚀 Comment Tester le CMS

### Étape 1: Lancer le Serveur
```bash
cd /Users/gafardgnane/Downloads/crosscheck-site
./lancer-cms.sh
```

### Étape 2: Ouvrir le CMS
Ouvrez votre navigateur et allez sur:
```
http://localhost:8080/cms.html
```

### Étape 3: Vérifier la Console
Appuyez sur `F12` pour ouvrir les outils de développement et regardez la console. Vous devriez voir:

```
🔄 Chargement des articles depuis articles-reels-extraits.json...
✅ Fichier JSON chargé: [...]
✅ Articles disponibles: 27
📊 Articles chargés: 27
📊 Détails: [...]
```

### Étape 4: Tester les Onglets
1. **Tableau de bord**: Devrait afficher "27 Articles disponibles"
2. **Parcourir articles**: Devrait montrer tous les articles avec images
3. **Créer article**: Devrait afficher le formulaire avec éditeur riche
4. **Gérer CMS**: Devrait lister tous les articles
5. **Export/Import**: Devrait fonctionner

## 🐛 Problèmes Courants et Solutions

### Problème 1: "Articles non trouvés"
**Symptôme**: Message d'erreur lors du chargement

**Solution**: Vérifiez que le serveur est lancé et que le fichier existe:
```bash
ls -la articles-reels-extraits.json
```

### Problème 2: Onglets qui ne se chargent pas
**Symptôme**: Les articles ne s'affichent pas dans "Parcourir" ou "Gérer"

**Solution**: Ouvrez la console (F12) et vérifiez les erreurs. Les logs détaillés vous diront où ça bloque.

### Problème 3: Éditeur Quill ne charge pas
**Symptôme**: La zone de texte riche est vide

**Solution**: Vérifiez votre connexion internet (Quill.js charge depuis un CDN). Si pas de connexion, lancez en mode offline.

## 📊 Tests de Validation

### Test 1: Chargement Initial
- [ ] Page CMS s'affiche correctement
- [ ] Sidebar avec 5 onglets visible
- [ ] Tableau de bord affiche les statistiques
- [ ] Console ne montre aucune erreur rouge

### Test 2: Chargement Articles
- [ ] Onglet "Parcourir" affiche les 27 articles
- [ ] Images s'affichent correctement
- [ ] Filtres par catégorie fonctionnent
- [ ] Recherche fonctionne

### Test 3: Création d'Article
- [ ] Formulaire complet accessible
- [ ] Éditeur riche (Quill) fonctionne
- [ ] Prévisualisation en temps réel
- [ ] Sauvegarde dans localStorage

### Test 4: Gestion CMS
- [ ] Liste tous les articles
- [ ] Boutons "Modifier" et "Supprimer" fonctionnent
- [ ] Import depuis le site fonctionne

### Test 5: Export/Import
- [ ] Export JSON fonctionne
- [ ] Import JSON fonctionne
- [ ] Données sauvegardées correctement

## 🔍 Debug Avancé

### Logs à Surveiller
Dans la console, vous devriez voir:
```
🔄 Chargement des articles depuis articles-reels-extraits.json...
✅ Fichier JSON chargé: Array(27) [...]
✅ Articles disponibles: 27
📊 Articles chargés: 27
```

### Vérifications Manuelles
1. **Fichier JSON**: Le fichier existe et est valide
   ```bash
   cat articles-reels-extraits.json | head -20
   ```

2. **Serveur actif**: Le serveur tourne sur le port 8080
   ```bash
   lsof -i :8080
   ```

3. **Permissions**: Les fichiers sont lisibles
   ```bash
   ls -la *.json *.html
   ```

## 📝 Structure Attendue

### Fichier JSON
```json
[
  {
    "id": 123456,
    "title": "Titre Article",
    "category": "apologetique",
    "description": "...",
    "content": "...",
    "image": "URL",
    "date": "Par Rédaction",
    "originalFile": "article-xxx.html"
  }
]
```

### Variables Globales
- `availableArticles`: Tableau des articles du site
- `quill`: Instance de l'éditeur Quill
- `currentEditId`: ID de l'article en cours d'édition

## 🎯 Prochaines Étapes

1. ✅ Vérifier que le CMS charge correctement
2. ✅ Tester toutes les fonctionnalités
3. ⏳ Compteur les articles qui ont "Contenu non trouvé"
4. ⏳ Compléter les articles manquants
5. ⏳ Optimiser les performances

---

**Version**: 2025-01-15
**Auteur**: Assistant AI
**Statut**: ✅ Corrections appliquées

