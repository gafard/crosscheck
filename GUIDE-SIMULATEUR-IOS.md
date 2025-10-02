# 📱 Guide du Simulateur iOS pour CrossCheck

## 🚀 Lancement rapide

### Option 1 : Script complet
```bash
./lancer-simulateur-ios.sh
```

### Option 2 : Script rapide
```bash
./ios-quick.sh
```

## 📱 Appareils disponibles

Vos simulateurs iOS installés :
- **iPhone 16 Pro** ⭐ (recommandé)
- **iPhone 16 Pro Max** (grand écran)
- **iPhone 16** (standard)
- **iPhone 16 Plus** (grand écran)
- **iPad Pro 11-inch (M4)** (tablette)
- **iPad Pro 13-inch (M4)** (grande tablette)

## 🧪 Tests à effectuer

### 1. Navigation mobile
- ✅ **Menu hamburger** (☰) - doit s'animer et s'ouvrir
- ✅ **Fermeture automatique** - cliquer sur un lien ferme le menu
- ✅ **Animation fluide** - transition douce

### 2. Recherche mobile
- ✅ **Icône de recherche** (🔍) - cliquer pour ouvrir
- ✅ **Barre pleine largeur** - doit occuper tout l'écran
- ✅ **Auto-focus** - clavier apparaît automatiquement
- ✅ **Fermeture** - Escape ou clic extérieur

### 3. Navigation entre pages
- ✅ **Accueil** → **Articles** → **Ressources** → **À propos**
- ✅ **Liens du menu contextuel** Articles (Apologétique, Science, etc.)
- ✅ **Recherche fonctionnelle** sur la page Articles

### 4. Tests tactiles
- ✅ **Scroll fluide** sur toutes les pages
- ✅ **Boutons réactifs** au toucher
- ✅ **Liens cliquables** facilement
- ✅ **Rotation d'écran** (portrait ↔ paysage)

## 🔧 Commandes utiles dans le simulateur

### Raccourcis clavier
- **Cmd+R** : Recharger la page
- **Cmd+Shift+H** : Retour à l'écran d'accueil
- **Cmd+Shift+R** : Rotation de l'écran
- **Cmd+Q** : Fermer le simulateur

### Menu Device
- **Rotate Left/Right** : Rotation manuelle
- **Shake Gesture** : Secouer l'appareil
- **Touch ID** : Simuler Touch ID
- **Face ID** : Simuler Face ID

## 🌐 URLs à tester

```
🏠 Accueil     : http://localhost:8080/index.html
📚 Articles    : http://localhost:8080/articles.html
📖 Ressources  : http://localhost:8080/ressources.html
ℹ️  À propos   : http://localhost:8080/apropos.html
🎛️  CMS        : http://localhost:8080/cms.html
📱 Test Mobile : http://localhost:8080/test-mobile.html
```

## 🐛 Dépannage

### Le simulateur ne s'ouvre pas
```bash
# Vérifier les simulateurs disponibles
xcrun simctl list devices

# Redémarrer les services Xcode
sudo xcode-select --reset
```

### Safari ne charge pas la page
1. Vérifier que le serveur HTTP est actif : `http://localhost:8080`
2. Redémarrer le serveur : `python3 -m http.server 8080`
3. Recharger Safari dans le simulateur : **Cmd+R**

### Changer d'appareil
1. Dans Simulator : **Device** → **Manage Devices**
2. Ou modifier le script : `DEVICE_NAME="iPhone 16 Plus"`

## 💡 Conseils d'utilisation

### Pour les tests mobiles
- Utilisez **iPhone 16 Pro** pour les tests standard
- Utilisez **iPhone 16 Pro Max** pour les grands écrans
- Utilisez **iPad Pro** pour les tests tablette

### Pour le développement
- Gardez le simulateur ouvert pendant le développement
- Utilisez **Cmd+R** pour recharger après chaque modification
- Testez en portrait ET paysage

### Performance
- Fermez les autres apps pour de meilleures performances
- Un seul simulateur à la fois recommandé

## 🎯 Checklist de validation

- [ ] Menu hamburger fonctionne
- [ ] Recherche mobile fonctionne
- [ ] Navigation entre pages fluide
- [ ] Liens du menu contextuel Articles
- [ ] Recherche trouve et affiche les résultats
- [ ] Rotation d'écran sans problème
- [ ] Performance fluide
- [ ] Design responsive correct

---

**🎉 Votre site CrossCheck est maintenant testable dans un vrai environnement iOS !**
