# 🎥 Guide d'Intégration TikTok - CrossCheck

## 📋 Vue d'ensemble

Ce guide vous explique comment intégrer des vidéos TikTok du compte [@thegodproof](https://www.tiktok.com/@thegodproof) dans votre site CrossCheck.

## 🚀 Méthodes d'intégration

### 1. Intégration Vidéo par Vidéo (Recommandée)

#### Étapes :
1. **Accéder à la vidéo TikTok**
   - Allez sur https://www.tiktok.com/@thegodproof
   - Sélectionnez la vidéo à intégrer

2. **Obtenir le code d'intégration**
   - Cliquez sur le bouton "Partager" (flèche)
   - Sélectionnez "Intégrer" ou "Embed"
   - Copiez le code HTML fourni

3. **Intégrer dans videos.html**
   - Ouvrez `videos.html`
   - Trouvez la section `.tiktok-placeholder`
   - Remplacez le contenu par le code TikTok

#### Exemple de code TikTok :
```html
<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@thegodproof/video/7123456789" data-video-id="7123456789">
  <section>
    <a target="_blank" title="@thegodproof" href="https://www.tiktok.com/@thegodproof">@thegodproof</a>
    <p>Titre de votre vidéo</p>
    <a target="_blank" title="♬ son original" href="https://www.tiktok.com/music/son-original-123">♬ son original</a>
  </section>
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>
```

### 2. Widget de Flux Automatique

#### Option A : EmbedSocial
1. Allez sur [EmbedSocial TikTok Widget](https://embedsocial.com/tiktok-widget/)
2. Connectez votre compte TikTok @thegodproof
3. Personnalisez l'apparence
4. Copiez le code généré
5. Intégrez dans `videos.html`

#### Option B : Flockler
1. Visitez [Flockler](https://flockler.com/)
2. Créez un flux TikTok
3. Configurez pour @thegodproof
4. Obtenez le code d'intégration

### 3. Via le CMS CrossCheck

1. **Accéder au CMS**
   ```bash
   ./lancer-cms.sh
   ```

2. **Créer une catégorie "Vidéos"**
   - Ouvrez le CMS
   - Ajoutez une nouvelle catégorie
   - Nom : "Vidéos TikTok"

3. **Ajouter des vidéos**
   - Créez de nouveaux articles
   - Type : "Vidéo"
   - Contenu : Code d'intégration TikTok

## 🛠️ Utilisation du Script d'Aide

Le fichier `integrer-tiktok.js` contient un script pour faciliter l'intégration :

```javascript
// 1. Modifiez le tableau 'videos' avec vos vraies URLs TikTok
// 2. Ajoutez les codes d'intégration
// 3. Générez le HTML avec generateVideosGrid()
```

## 📱 Structure de la Page Vidéos

La page `videos.html` contient :

- **Header** : Navigation avec lien actif "Vidéos"
- **Hero Section** : Introduction aux vidéos TikTok
- **Videos Grid** : Grille responsive des vidéos
- **Instructions** : Guide pour les utilisateurs
- **Footer** : Liens vers les réseaux sociaux

## 🎨 Personnalisation

### Modifier l'apparence des vidéos :
```css
.video-card {
    /* Personnalisez ici */
}

.tiktok-placeholder {
    /* Style des placeholders */
}
```

### Ajouter plus de vidéos :
1. Dupliquez une section `.video-card`
2. Modifiez le contenu
3. Ajoutez le code TikTok

## 🔧 Dépannage

### Problème : Les vidéos ne s'affichent pas
**Solution :**
- Vérifiez que le script TikTok est chargé
- Assurez-vous que les URLs sont correctes
- Testez sur un serveur local (pas en fichier local)

### Problème : Mise en page cassée
**Solution :**
- Vérifiez la structure HTML
- Assurez-vous que les classes CSS sont correctes
- Testez sur différents navigateurs

### Problème : Vidéos lentes à charger
**Solution :**
- Utilisez le lazy loading
- Limitez le nombre de vidéos par page
- Considérez un système de pagination

## 📊 Bonnes Pratiques

1. **Performance**
   - Limitez à 6-9 vidéos par page
   - Utilisez des placeholders pendant le chargement
   - Implémentez le lazy loading

2. **SEO**
   - Ajoutez des descriptions détaillées
   - Utilisez des titres descriptifs
   - Incluez des mots-clés pertinents

3. **Accessibilité**
   - Ajoutez des textes alternatifs
   - Assurez-vous que la navigation au clavier fonctionne
   - Testez avec des lecteurs d'écran

4. **Responsive Design**
   - Testez sur mobile et tablette
   - Ajustez les tailles selon l'écran
   - Optimisez pour le touch

## 🚀 Déploiement

1. **Test local**
   ```bash
   python3 -m http.server 8080
   # Visitez http://localhost:8080/videos.html
   ```

2. **Validation**
   - Testez tous les liens TikTok
   - Vérifiez la responsive
   - Testez les performances

3. **Mise en ligne**
   - Uploadez tous les fichiers
   - Testez en production
   - Vérifiez les analytics

## 📈 Suivi et Analytics

- Utilisez Google Analytics pour suivre les vues
- Surveillez l'engagement sur TikTok
- Analysez quelles vidéos performent le mieux

## 🔄 Maintenance

- **Hebdomadaire** : Ajoutez de nouvelles vidéos
- **Mensuel** : Vérifiez les liens cassés
- **Trimestriel** : Optimisez les performances

---

## 📞 Support

Pour toute question sur l'intégration TikTok :
1. Consultez ce guide
2. Vérifiez la documentation TikTok
3. Testez avec le script `integrer-tiktok.js`

**Bonne intégration ! 🎉**
