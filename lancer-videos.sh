#!/bin/bash

# Script pour lancer et tester la page vidéos TikTok
# CrossCheck - Page Vidéos

echo "🎥 Lancement de la page Vidéos TikTok - CrossCheck"
echo "=================================================="

# Vérifier si le serveur HTTP est déjà en cours
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Serveur HTTP déjà actif sur le port 8080"
else
    echo "🚀 Démarrage du serveur HTTP local..."
    python3 -m http.server 8080 &
    SERVER_PID=$!
    echo "📡 Serveur démarré (PID: $SERVER_PID)"
    sleep 2
fi

echo ""
echo "🌐 Pages disponibles :"
echo "   📺 Page Vidéos : http://localhost:8080/videos.html"
echo "   🏠 Accueil : http://localhost:8080/index.html"
echo "   📚 Articles : http://localhost:8080/articles.html"
echo "   ⚙️  CMS : http://localhost:8080/cms.html"

echo ""
echo "📋 Guide d'intégration TikTok :"
echo "   📖 Guide complet : GUIDE-TIKTOK.md"
echo "   🛠️  Script d'aide : integrer-tiktok.js"

echo ""
echo "🎯 Pour intégrer vos vidéos TikTok :"
echo "   1. Allez sur https://www.tiktok.com/@thegodproof"
echo "   2. Choisissez une vidéo → Partager → Intégrer"
echo "   3. Copiez le code dans videos.html"

echo ""
echo "🔧 Commandes utiles :"
echo "   • Arrêter le serveur : Ctrl+C"
echo "   • Voir les logs : tail -f access.log"
echo "   • Tester responsive : F12 → Mode mobile"

# Ouvrir automatiquement dans le navigateur (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "🌐 Ouverture automatique dans le navigateur..."
    sleep 1
    open "http://localhost:8080/videos.html"
fi

echo ""
echo "✨ Page Vidéos prête ! Testez l'intégration TikTok."
echo "📱 N'oubliez pas de remplacer les placeholders par vos vraies vidéos !"
