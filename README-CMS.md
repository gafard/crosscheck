# 🎯 CrossCheck CMS - Version Moderne

## 📋 Vue d'ensemble

Le **CrossCheck CMS** est un système de gestion de contenu moderne et intuitif spécialement conçu pour gérer les articles du site CrossCheck. Il permet de créer, importer, modifier et exporter des articles avec une interface utilisateur élégante et des fonctionnalités avancées.

## ✨ Fonctionnalités principales

### 🎨 Interface moderne
- Design épuré avec animations fluides
- Mode sombre/clair intégré
- Navigation latérale intuitive
- Responsive design pour tous les appareils

### 📊 Tableau de bord
- Statistiques en temps réel
- Activité récente
- Actions rapides
- Vue d'ensemble du système

### 🔍 Gestion des articles
- **Parcours intelligent** : Chargement automatique des 27 articles du site
- **Recherche avancée** : Recherche en temps réel dans titres et descriptions
- **Filtres par catégorie** : Apologétique, Science & Foi, Histoire, Archéologie
- **Import sélectif** : Importation d'articles existants dans le CMS

### ✍️ Création d'articles
- Formulaire moderne avec validation
- Aperçu en temps réel pendant la rédaction
- Mode plein écran pour l'aperçu
- Catégorisation automatique

### ⚙️ Gestion CMS
- Modification en place des articles
- Suppression avec confirmation
- Gestion unifiée des articles créés et importés

### 📤 Export/Import
- Export complet des données (JSON)
- Export articles uniquement
- Import avec validation des données
- Génération de code HTML pour intégration
- Création automatique de sitemap

## 🚀 Installation et utilisation

### Prérequis
- Serveur web local (Python, Node.js, Apache, etc.)
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

### Démarrage rapide

1. **Lancer le serveur web local** :
   ```bash
   # Avec Python
   python3 -m http.server 8080
   
   # Ou avec Node.js
   npx http-server -p 8080
   ```

2. **Accéder au CMS** :
   Ouvrir `http://localhost:8080/cms-moderne-v2.html` dans votre navigateur

3. **Première utilisation** :
   - Le CMS charge automatiquement vos 27 articles existants
   - Explorez le tableau de bord pour voir les statistiques
   - Utilisez l'onglet "Parcourir" pour importer des articles
   - Créez de nouveaux articles avec l'onglet "Créer"

## 📁 Structure des fichiers

```
crosscheck-site/
├── cms-moderne-v2.html          # CMS principal (NOUVEAU)
├── articles-reels-extraits.json # Base de données des articles
├── extraire-contenu-complet.py  # Script d'extraction
├── article-*.html               # Articles du site (27 fichiers)
└── README-CMS.md               # Cette documentation
```

## 🎯 Guide d'utilisation

### 1. Tableau de bord
- **Statistiques** : Nombre d'articles CMS, importés, disponibles
- **Activité récente** : Derniers articles créés/importés
- **Actions rapides** : Boutons pour créer, parcourir, exporter

### 2. Parcourir les articles
- **Chargement automatique** : Les 27 articles du site sont chargés automatiquement
- **Recherche** : Tapez dans la barre de recherche pour filtrer
- **Filtres** : Cliquez sur les catégories pour filtrer
- **Sélection** : Cliquez sur un article pour le sélectionner
- **Import** : Bouton "Importer dans le CMS" pour ajouter l'article

### 3. Créer un article
- **Formulaire** : Remplissez titre, catégorie, description, contenu
- **Aperçu temps réel** : Voir l'article pendant que vous l'écrivez
- **Validation** : Tous les champs obligatoires sont vérifiés
- **Sauvegarde** : L'article est sauvegardé localement

### 4. Gérer le CMS
- **Liste des articles** : Tous vos articles CMS
- **Modification** : Bouton "Modifier" pour éditer un article
- **Suppression** : Bouton "Supprimer" avec confirmation

### 5. Export/Import
- **Export complet** : Sauvegarde de toutes les données
- **Export articles** : Articles uniquement
- **Import** : Restauration depuis une sauvegarde
- **Génération HTML** : Code pour intégrer dans le site
- **Sitemap** : Génération automatique du sitemap XML

## 🔧 Fonctionnalités avancées

### Thème sombre/clair
- Bouton en haut à droite de l'interface
- Préférence sauvegardée automatiquement

### Recherche intelligente
- Recherche dans les titres et descriptions
- Résultats en temps réel
- Compatible avec les filtres de catégorie

### Aperçu temps réel
- Mise à jour automatique pendant la saisie
- Mode plein écran disponible
- Formatage automatique du contenu

### Gestion des images
- Images automatiques par catégorie (Unsplash)
- Support des URLs d'images personnalisées
- Fallback intelligent en cas d'erreur

## 📊 Données et stockage

### Stockage local
- Les articles CMS sont stockés dans `localStorage`
- Pas de serveur backend requis
- Sauvegarde automatique

### Format des données
```json
{
  "id": 1234567890,
  "title": "Titre de l'article",
  "category": "apologetique|science|histoire|archeologie",
  "description": "Description courte",
  "content": "Contenu complet",
  "image": "URL de l'image",
  "date": "02/10/2025",
  "isImported": true,
  "originalFile": "article-exemple.html"
}
```

### Catégories disponibles
- **Apologétique** 🛡️ : Défense de la foi chrétienne
- **Science & Foi** 🔬 : Harmonie entre science et religion
- **Histoire** 📚 : Histoire du christianisme
- **Archéologie** 🏛️ : Découvertes archéologiques bibliques

## 🛠️ Maintenance

### Mise à jour des articles
Pour mettre à jour les articles du site dans le CMS :

1. **Extraction automatique** :
   ```bash
   python3 extraire-contenu-complet.py
   ```

2. **Rechargement dans le CMS** :
   - Bouton "Recharger les articles du site" dans l'onglet Parcourir
   - Ou rafraîchir la page

### Sauvegarde des données
- **Export régulier** : Utilisez la fonction d'export pour sauvegarder
- **Fichiers générés** : `crosscheck-cms-backup-YYYY-MM-DD.json`
- **Restauration** : Fonction d'import pour restaurer

### Résolution de problèmes

#### Articles non chargés
- Vérifiez que le serveur web est actif
- Vérifiez que `articles-reels-extraits.json` est accessible
- Consultez la console du navigateur pour les erreurs

#### Aperçu non fonctionnel
- Vérifiez que JavaScript est activé
- Rafraîchissez la page
- Videz le cache du navigateur

#### Données perdues
- Utilisez la fonction d'import pour restaurer une sauvegarde
- Les données sont dans `localStorage` du navigateur

## 🎉 Nouveautés de cette version

### Par rapport aux versions précédentes :
- ✅ **Vrais articles** : Chargement des 27 articles réels du site
- ✅ **Interface moderne** : Design complètement repensé
- ✅ **Performance** : Chargement et interactions plus rapides
- ✅ **Fonctionnalités** : Export/import, recherche, filtres avancés
- ✅ **Responsive** : Parfaitement adapté mobile/tablette
- ✅ **Accessibilité** : Navigation clavier, tooltips, indicateurs

### Améliorations techniques :
- Chargement asynchrone des articles
- Gestion d'erreurs robuste
- Validation des données
- Animations CSS3 optimisées
- Code modulaire et maintenable

## 📞 Support

Pour toute question ou problème :
1. Consultez cette documentation
2. Vérifiez la console du navigateur pour les erreurs
3. Testez avec un serveur web local
4. Sauvegardez régulièrement vos données

---

**CrossCheck CMS v2.0** - Système de gestion de contenu moderne pour CrossCheck
