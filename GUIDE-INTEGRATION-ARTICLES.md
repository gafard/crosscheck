# 🔗 GUIDE D'INTÉGRATION DES ARTICLES - CrossCheck

## 🎯 COMMENT INTÉGRER UN ARTICLE CRÉÉ AVEC LE CMS

### 📥 **FICHIERS TÉLÉCHARGÉS AUTOMATIQUEMENT**

Quand vous créez un article avec le CMS, **2 fichiers** sont téléchargés :

1. **`article-[nom].html`** - Le fichier de l'article complet
2. **`integration-articles.html`** - Le code à ajouter dans articles.html

---

## 🔧 **ÉTAPES D'INTÉGRATION**

### **Étape 1 : Copier le fichier article**
1. **Copiez** le fichier `article-[nom].html` dans le dossier de votre site
2. **Vérifiez** que le fichier est bien dans le bon dossier

### **Étape 2 : Intégrer dans articles.html**
1. **Ouvrez** le fichier `articles.html`
2. **Ouvrez** le fichier `integration-articles.html` (téléchargé automatiquement)
3. **Copiez** tout le code HTML du fichier integration
4. **Trouvez** la section correspondant à la catégorie de votre article
5. **Ajoutez** le code dans la section `<div class="articles-grid">`

### **Étape 3 : Mettre à jour les statistiques**
1. **Ouvrez** le fichier `index.html`
2. **Trouvez** la section statistiques
3. **Modifiez** le nombre d'articles si nécessaire

---

## 📋 **EXEMPLE CONCRET**

### **Fichier téléchargé : `article-nouvelle-decouverte.html`**
### **Code d'intégration : `integration-articles.html`**

```html
<!-- Code à ajouter dans articles.html -->
<!-- Section: Archéologie -->

<a href="article-nouvelle-decouverte.html" class="article-card">
    <div class="article-image" style="background-image: url('https://example.com/image.jpg')"></div>
    <div class="article-content">
        <div class="article-category">Archéologie</div>
        <h3 class="article-title">Nouvelle Découverte</h3>
        <p class="article-description">Description de l'article...</p>
        <div class="article-meta">
            <span class="article-date">15/01/2025</span>
            <span class="article-author">Rédaction</span>
        </div>
    </div>
</a>
```

### **Où l'ajouter dans articles.html :**

```html
<!-- Dans la section Archéologie -->
<div class="tab-content" id="archeologie">
    <div class="articles-grid">
        <!-- Articles existants... -->
        
        <!-- NOUVEL ARTICLE À AJOUTER ICI -->
        <a href="article-nouvelle-decouverte.html" class="article-card">
            <div class="article-image" style="background-image: url('https://example.com/image.jpg')"></div>
            <div class="article-content">
                <div class="article-category">Archéologie</div>
                <h3 class="article-title">Nouvelle Découverte</h3>
                <p class="article-description">Description de l'article...</p>
                <div class="article-meta">
                    <span class="article-date">15/01/2025</span>
                    <span class="article-author">Rédaction</span>
                </div>
            </div>
        </a>
        <!-- FIN NOUVEL ARTICLE -->
    </div>
</div>
```

---

## ✏️ **MODIFICATION D'ARTICLES EXISTANTS**

### **Option 1 : Modification directe**
1. **Ouvrez** le fichier de l'article (ex: `article-big-bang.html`)
2. **Modifiez** le contenu entre les balises `<article class="article-content">`
3. **Sauvegardez** le fichier

### **Option 2 : Régénération avec le CMS**
1. **Créez** un nouvel article avec le contenu modifié
2. **Remplacez** l'ancien fichier par le nouveau
3. **Mettez à jour** les liens si nécessaire

---

## 🗑️ **SUPPRESSION D'ARTICLES**

### **Étape 1 : Supprimer le fichier**
1. **Supprimez** le fichier de l'article (ex: `article-[nom].html`)

### **Étape 2 : Retirer de articles.html**
1. **Ouvrez** `articles.html`
2. **Trouvez** l'article dans la liste
3. **Supprimez** tout le bloc `<a href="article-[nom].html" class="article-card">...</a>`
4. **Sauvegardez** le fichier

### **Étape 3 : Mettre à jour les statistiques**
1. **Modifiez** le nombre d'articles dans `index.html`

---

## 🔍 **VÉRIFICATION DE L'INTÉGRATION**

### **Checklist de vérification :**
- [ ] Fichier article copié dans le bon dossier
- [ ] Code ajouté dans articles.html
- [ ] Lien fonctionne (testez en cliquant)
- [ ] Image s'affiche correctement
- [ ] Catégorie correcte
- [ ] Statistiques mises à jour

### **Test de fonctionnement :**
1. **Ouvrez** `articles.html` dans un navigateur
2. **Vérifiez** que l'article apparaît dans la bonne catégorie
3. **Cliquez** sur l'article pour vérifier qu'il s'ouvre
4. **Vérifiez** que l'image s'affiche
5. **Testez** le bouton "Retour aux Articles"

---

## ⚠️ **PROBLÈMES COURANTS ET SOLUTIONS**

### **L'article ne s'affiche pas**
- ✅ Vérifiez que le fichier est dans le bon dossier
- ✅ Vérifiez que le code est dans la bonne section
- ✅ Vérifiez la syntaxe HTML

### **L'image ne s'affiche pas**
- ✅ Vérifiez que l'URL de l'image est correcte
- ✅ Testez l'URL dans un navigateur
- ✅ Utilisez un autre service d'images

### **Le lien ne fonctionne pas**
- ✅ Vérifiez le nom du fichier
- ✅ Vérifiez que le fichier existe
- ✅ Vérifiez le chemin dans le lien

### **L'article n'apparaît pas dans la bonne catégorie**
- ✅ Vérifiez que le code est dans la bonne section
- ✅ Vérifiez la catégorie dans le code

---

## 🎯 **AVANTAGES DE CETTE MÉTHODE**

✅ **Automatique** : Le CMS génère tout le code nécessaire
✅ **Sans erreur** : Code HTML propre et valide
✅ **Guidé** : Instructions claires à chaque étape
✅ **Flexible** : Possibilité de modifier manuellement
✅ **Sûr** : Pas de risque de casser le site

---

## 📞 **SUPPORT**

### **En cas de problème :**
1. Consultez ce guide
2. Vérifiez les exemples existants
3. Testez étape par étape
4. Contactez l'équipe technique si nécessaire

### **Pour des modifications avancées :**
- Modifications du design → Développeur
- Nouvelles fonctionnalités → Développeur
- Corrections de bugs → Développeur

---

*Dernière mise à jour : Janvier 2025*
