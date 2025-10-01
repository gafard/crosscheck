# 🔧 GUIDE DE DÉPANNAGE - CMS CrossCheck

## 🚨 PROBLÈMES COURANTS ET SOLUTIONS

### **1. LE CMS NE S'OUVRE PAS**

#### **Problème :** Double-clic sur le fichier ne fonctionne pas
#### **Solutions :**
- **Clic droit** → "Ouvrir avec" → Choisir votre navigateur
- **Glisser** le fichier dans une fenêtre de navigateur
- **Ouvrir le navigateur** → Fichier → Ouvrir → Sélectionner `cms-articles.html`

---

### **2. LES ONGLETS NE CHANGENT PAS**

#### **Problème :** Cliquer sur "Modifier" ou "Statistiques" ne fait rien
#### **Solutions :**
1. **Ouvrir la console** (F12) pour voir les erreurs
2. **Tester la version simplifiée** : `cms-test-simple.html`
3. **Vérifier JavaScript** : S'assurer que JavaScript est activé

#### **Test rapide :**
```javascript
// Dans la console (F12), taper :
showTab('edit')
// Si ça fonctionne, le problème vient des clics
```

---

### **3. LE FORMULAIRE NE FONCTIONNE PAS**

#### **Problème :** Impossible de créer un article
#### **Solutions :**
1. **Vérifier les champs obligatoires** (marqués d'un *)
2. **Tester avec des données simples** :
   - Titre : "Test Article"
   - Catégorie : "Apologétique"
   - Description : "Test description"
   - Contenu : "Test content"

#### **Test de validation :**
```javascript
// Dans la console (F12), taper :
document.getElementById('title').value = 'Test'
document.getElementById('category').value = 'apologetique'
// Puis essayer de soumettre
```

---

### **4. LES FICHIERS NE SE TÉLÉCHARGENT PAS**

#### **Problème :** Aucun téléchargement après création
#### **Solutions :**
1. **Vérifier les pop-ups** : Autoriser les téléchargements
2. **Vérifier le dossier Téléchargements**
3. **Tester avec un navigateur différent**

#### **Test manuel :**
```javascript
// Dans la console (F12), taper :
downloadFile('test.html', '<h1>Test</h1>')
// Un fichier test.html devrait se télécharger
```

---

### **5. ERREURS JAVASCRIPT**

#### **Problème :** Erreurs dans la console
#### **Solutions :**
1. **Ouvrir la console** (F12)
2. **Copier les erreurs** et les signaler
3. **Tester la version simplifiée** : `cms-test-simple.html`

#### **Erreurs courantes :**
- `showTab is not defined` → Problème de chargement du script
- `Cannot read property` → Problème de sélecteur DOM
- `localStorage is not defined` → Mode privé/incognito

---

## 🧪 TESTS DE DIAGNOSTIC

### **Test 1 : Vérification de base**
```javascript
// Dans la console (F12), taper :
console.log('CMS chargé:', typeof showTab)
// Doit afficher : "CMS chargé: function"
```

### **Test 2 : Test des onglets**
```javascript
// Dans la console (F12), taper :
showTab('edit')
// L'onglet "Modifier" doit s'activer
```

### **Test 3 : Test du formulaire**
```javascript
// Dans la console (F12), taper :
document.getElementById('title').value = 'Test'
console.log('Titre:', document.getElementById('title').value)
// Doit afficher : "Titre: Test"
```

### **Test 4 : Test de téléchargement**
```javascript
// Dans la console (F12), taper :
downloadFile('test.txt', 'Hello World')
// Un fichier test.txt doit se télécharger
```

---

## 📋 CHECKLIST DE DÉPANNAGE

### **Avant de signaler un problème :**

- [ ] **JavaScript activé** dans le navigateur
- [ ] **Pop-ups autorisés** pour les téléchargements
- [ ] **Console ouverte** (F12) pour voir les erreurs
- [ ] **Version simplifiée testée** (`cms-test-simple.html`)
- [ ] **Navigateur différent testé** (Chrome, Firefox, Safari)
- [ ] **Mode privé/incognito testé**

### **Informations à fournir :**

1. **Navigateur utilisé** (Chrome, Firefox, Safari, etc.)
2. **Version du navigateur**
3. **Système d'exploitation** (Windows, Mac, Linux)
4. **Messages d'erreur** de la console (F12)
5. **Étapes exactes** pour reproduire le problème

---

## 🆘 SOLUTIONS D'URGENCE

### **Si rien ne fonctionne :**

1. **Utiliser la version simplifiée** : `cms-test-simple.html`
2. **Créer les articles manuellement** avec le template
3. **Utiliser un autre navigateur**
4. **Désactiver les extensions** du navigateur

### **Alternative manuelle :**

Si le CMS ne fonctionne pas, vous pouvez :
1. **Copier** `article-template-detaille.html`
2. **Modifier** le contenu manuellement
3. **Sauvegarder** avec un nouveau nom
4. **Ajouter** le code d'intégration dans `articles.html`

---

## 📞 SUPPORT

### **En cas de problème persistant :**

1. **Tester** la version simplifiée
2. **Vérifier** la console (F12)
3. **Documenter** les erreurs
4. **Signaler** le problème avec les détails

### **Fichiers de test disponibles :**

- `cms-articles.html` - Version complète
- `cms-test-simple.html` - Version simplifiée
- `test-onglets.html` - Test des onglets uniquement
- `article-template-detaille.html` - Template manuel

---

*Guide de dépannage - Janvier 2025*
