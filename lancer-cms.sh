#!/bin/bash

# Script de lancement du CMS CrossCheck
# Usage: ./lancer-cms.sh

echo "🚀 Lancement du CMS CrossCheck..."
echo ""

# Vérifier si Python3 est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Démarrer le serveur web
echo "📡 Démarrage du serveur web local sur le port 8080..."
echo "🌐 CMS accessible à : http://localhost:8080/cms.html"
echo ""
echo "💡 Conseils :"
echo "   - Utilisez Ctrl+C pour arrêter le serveur"
echo "   - Le CMS charge automatiquement vos 27 articles"
echo "   - Toutes vos données sont sauvegardées localement"
echo ""
echo "📊 Démarrage en cours..."

# Lancer le serveur Python
python3 -m http.server 8080
