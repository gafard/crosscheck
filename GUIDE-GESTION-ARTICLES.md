# 📚 GUIDE DE GESTION DES ARTICLES - CrossCheck

## 🎯 OBJECTIF
Ce guide permet à toute personne de gérer les articles du site CrossCheck sans connaissances techniques avancées.

---

## 📋 CRÉATION D'UN NOUVEL ARTICLE

### Étape 1 : Copier le template
1. Ouvrir le fichier `article-template.html`
2. Faire "Copier" (Ctrl+C)
3. Faire "Coller" (Ctrl+V) dans le même dossier
4. Renommer le nouveau fichier : `article-[nom-article].html`
   - Exemple : `article-nouvelle-decouverte.html`

### Étape 2 : Modifier le contenu
1. Ouvrir le nouveau fichier avec un éditeur de texte
2. Remplacer les éléments suivants :

```html
<!-- À MODIFIER -->
<title>Nouvelle Découverte - CrossCheck</title>
<meta name="description" content="Description de l'article">

<!-- Dans le contenu -->
<h1>Nouvelle Découverte</h1>
<div class="article-meta">
    <span class="article-category">Apologétique</span>
    <span class="article-date">15 Janvier 2025</span>
    <span class="article-author">Rédaction</span>
</div>

<div class="article-image" style="background-image: url('URL_DE_L_IMAGE')"></div>

<div class="article-content">
    <p>Votre contenu ici...</p>
</div>
```

### Étape 3 : Ajouter l'image
**Option A - URL d'image (recommandé) :**
- Utiliser des services comme Imgur, PostImage, ou Unsplash
- Copier l'URL de l'image
- Remplacer `URL_DE_L_IMAGE` par cette URL

**Option B - Image locale :**
- Télécharger l'image dans le dossier du site
- Utiliser le nom du fichier : `url('nom-image.jpg')`

### Étape 4 : Ajouter à la page Articles
1. Ouvrir `articles.html`
2. Trouver la section correspondante (Apologétique, Science, etc.)
3. Ajouter le nouvel article :

```html
<a href="article-nouvelle-decouverte.html" class="article-card">
    <div class="article-image" style="background-image: url('URL_IMAGE')"></div>
    <div class="article-content">
        <div class="article-category">Apologétique</div>
        <h3 class="article-title">Nouvelle Découverte</h3>
        <p class="article-description">Description courte de l'article...</p>
        <div class="article-meta">
            <span class="article-date">15 Janvier 2025</span>
            <span class="article-author">Rédaction</span>
        </div>
    </div>
</a>
```

---

## 📝 MODIFICATION D'UN ARTICLE EXISTANT

### Étape 1 : Localiser l'article
1. Trouver le fichier `article-[nom].html`
2. L'ouvrir avec un éditeur de texte

### Étape 2 : Modifier le contenu
1. Modifier le titre dans `<h1>`
2. Modifier la description dans `<meta name="description">`
3. Modifier le contenu dans `<div class="article-content">`
4. Sauvegarder le fichier (Ctrl+S)

### Étape 3 : Mettre à jour la page Articles (si nécessaire)
1. Ouvrir `articles.html`
2. Trouver l'article dans la liste
3. Modifier le titre, description, ou image
4. Sauvegarder

---

## 🗑️ SUPPRESSION D'UN ARTICLE

### Étape 1 : Supprimer le fichier
1. Supprimer le fichier `article-[nom].html`

### Étape 2 : Retirer de la page Articles
1. Ouvrir `articles.html`
2. Trouver l'article dans la liste
3. Supprimer tout le bloc `<a href="article-[nom].html" class="article-card">...</a>`
4. Sauvegarder

### Étape 3 : Supprimer l'image (si locale)
1. Supprimer le fichier image du dossier

---

## 🖼️ GESTION DES IMAGES

### Types d'images supportés
- **JPG/JPEG** : Photos et images complexes
- **PNG** : Images avec transparence
- **WebP** : Format moderne (recommandé)

### Tailles recommandées
- **Image d'article** : 800x400 pixels minimum
- **Image de carte** : 400x250 pixels
- **Format** : Paysage (largeur > hauteur)

### Services d'hébergement d'images
1. **PostImage** (postimg.cc) - Gratuit, simple
2. **Imgur** (imgur.com) - Populaire, fiable
3. **Unsplash** (unsplash.com) - Images libres de droits

---

## 📊 MISE À JOUR DES STATISTIQUES

### Compter les articles
1. Compter tous les fichiers `article-*.html`
2. Mettre à jour dans `index.html` :

```html
<div class="stat-number">28</div> <!-- Nouveau nombre -->
<div class="stat-label">Articles documentés</div>
```

### Vérifier les catégories
- **Apologétique** : Articles sur la défense de la foi
- **Science & Foi** : Articles sur la science et la religion
- **Histoire** : Articles historiques
- **Archéologie** : Découvertes archéologiques

---

## 🔧 OUTILS RECOMMANDÉS

### Éditeurs de texte
- **Notepad++** (Windows) - Gratuit, colorisation syntaxe
- **VS Code** (Tous systèmes) - Gratuit, très puissant
- **Sublime Text** - Payant, très rapide

### Gestion d'images
- **Canva** - Création d'images simples
- **GIMP** - Édition d'images gratuite
- **Photoshop** - Professionnel

### Test du site
- **Navigateur web** - Pour voir le résultat
- **Serveur local** - Pour tester avant publication

---

## ⚠️ RÈGLES IMPORTANTES

### Nommage des fichiers
- **Format** : `article-[nom-descriptif].html`
- **Caractères** : Lettres, chiffres, tirets uniquement
- **Exemples** :
  - ✅ `article-decouverte-jericho.html`
  - ❌ `article découverte jéricho.html`
  - ❌ `article_decouverte_jericho.html`

### Structure du contenu
- **Titre** : Court et descriptif
- **Description** : 150-160 caractères maximum
- **Contenu** : Structuré avec des paragraphes
- **Images** : URLs valides et accessibles

### Sauvegarde
- **Toujours** faire une copie de sauvegarde avant modification
- **Tester** les modifications dans un navigateur
- **Vérifier** que tous les liens fonctionnent

---

## 🆘 EN CAS DE PROBLÈME

### Problèmes courants
1. **Image ne s'affiche pas** : Vérifier l'URL
2. **Article ne s'affiche pas** : Vérifier le nom du fichier
3. **Lien cassé** : Vérifier le chemin dans articles.html
4. **Formatage bizarre** : Vérifier les balises HTML

### Solution d'urgence
1. Restaurer la version de sauvegarde
2. Contacter le développeur si nécessaire
3. Documenter le problème pour éviter qu'il se reproduise

---

## 📞 CONTACT ET SUPPORT

Pour toute question ou problème :
1. Consulter ce guide en premier
2. Vérifier les exemples existants
3. Contacter l'équipe technique si nécessaire

---

*Dernière mise à jour : Janvier 2025*
