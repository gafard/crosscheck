# 📱 Guide de Test Mobile - CrossCheck

## 🎯 Tests à effectuer dans le simulateur iOS

### 1. 🏠 Page d'Accueil (index.html)
- [ ] **Menu hamburger** (☰) s'ouvre et se ferme
- [ ] **Animation hamburger** : ☰ → X → ☰
- [ ] **Menu contextuel Articles** visible et cliquable
- [ ] **Recherche mobile** : clic sur 🔍 ouvre la barre
- [ ] **Auto-focus** : clavier apparaît automatiquement
- [ ] **Fermeture recherche** : Escape ou clic extérieur

### 2. 📚 Page Articles (articles.html)
- [ ] **Menu hamburger** (☰) s'ouvre et se ferme
- [ ] **Navigation** vers autres pages fonctionne
- [ ] **Recherche mobile** : clic sur 🔍 ouvre la barre
- [ ] **Recherche fonctionnelle** : trouve et affiche les résultats
- [ ] **Onglets** : navigation entre catégories

### 3. 📖 Page Ressources (ressources.html)
- [ ] **Menu hamburger** (☰) s'ouvre et se ferme
- [ ] **Navigation** vers autres pages fonctionne
- [ ] **Recherche mobile** : clic sur 🔍 ouvre la barre
- [ ] **Cartes interactives** : cliquables et réactives

### 4. ℹ️ Page À propos (apropos.html)
- [ ] **Menu hamburger** (☰) s'ouvre et se ferme
- [ ] **Navigation** vers autres pages fonctionne
- [ ] **Recherche mobile** : clic sur 🔍 ouvre la barre
- [ ] **Formulaire contact** : fonctionnel

## 🔧 Tests techniques

### Navigation mobile
- [ ] **Fermeture automatique** : cliquer sur un lien ferme le menu
- [ ] **Animation fluide** : transitions douces
- [ ] **Z-index correct** : menu au-dessus du contenu
- [ ] **Backdrop blur** : effet de flou en arrière-plan

### Recherche mobile
- [ ] **Position fixe** : barre reste en haut lors du scroll
- [ ] **Largeur responsive** : s'adapte à la taille d'écran
- [ ] **Focus automatique** : curseur dans le champ
- [ ] **Redirection** : vers articles.html avec query

### Menu contextuel Articles (page d'accueil)
- [ ] **Affichage mobile** : visible dans le menu hamburger
- [ ] **Liens fonctionnels** : redirection vers articles.html#categorie
- [ ] **Style adapté** : padding et taille appropriés
- [ ] **Effet hover** : animation au survol/tap

## 🎮 Interactions tactiles

### Gestes à tester
- [ ] **Tap** : tous les boutons réagissent
- [ ] **Scroll** : fluide sur toutes les pages
- [ ] **Pinch zoom** : fonctionne si nécessaire
- [ ] **Rotation** : portrait ↔ paysage

### Feedback visuel
- [ ] **Active states** : boutons réagissent au tap
- [ ] **Hover effects** : animations sur les cartes
- [ ] **Loading states** : si applicable

## 📐 Tests de taille d'écran

### Dans le simulateur, testez :
- [ ] **iPhone 16 Pro** (390×844)
- [ ] **iPhone 16 Pro Max** (428×926)
- [ ] **iPad Air** (820×1180)
- [ ] **Rotation** : portrait et paysage

### Points de rupture CSS
- [ ] **768px et moins** : menu hamburger actif
- [ ] **769px et plus** : menu desktop actif
- [ ] **480px et moins** : ajustements supplémentaires

## 🐛 Problèmes potentiels à surveiller

### Menu hamburger
- ❌ Menu ne s'ouvre pas
- ❌ Animation hamburger cassée
- ❌ Menu ne se ferme pas automatiquement
- ❌ Z-index incorrect (menu derrière le contenu)

### Recherche mobile
- ❌ Barre ne s'ouvre pas au clic
- ❌ Pas de focus automatique
- ❌ Ne se ferme pas avec Escape
- ❌ Position incorrecte

### Navigation
- ❌ Liens ne fonctionnent pas
- ❌ Redirections incorrectes
- ❌ Menu contextuel invisible

## ✅ Checklist finale

Une fois tous les tests effectués :
- [ ] Toutes les pages ont un menu hamburger fonctionnel
- [ ] Toutes les pages ont une recherche mobile fonctionnelle
- [ ] Le menu contextuel Articles fonctionne sur mobile
- [ ] Les animations sont fluides
- [ ] Aucun élément n'est coupé ou mal positionné
- [ ] La navigation entre pages fonctionne parfaitement

## 🚀 Commandes utiles

```bash
# Relancer le simulateur iOS
./ios-quick.sh

# Ou version complète
./lancer-simulateur-ios.sh

# Recharger la page dans Safari iOS
Cmd+R dans le simulateur
```

---

**🎯 Objectif : Tous les tests doivent être ✅ pour valider la version mobile !**
