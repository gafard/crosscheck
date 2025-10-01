#!/bin/bash

echo "=== LANCEMENT DU SERVEUR WEB LOCAL ==="
echo ""

echo "🌐 Démarrage du serveur web local..."
echo "   • Port: 8000"
echo "   • URL: http://localhost:8000"
echo ""

echo "📋 INSTRUCTIONS:"
echo "   1. Le serveur va démarrer"
echo "   2. Ouvrez votre navigateur"
echo "   3. Allez sur http://localhost:8000"
echo "   4. Ouvrez cms-vrais-articles.html"
echo "   5. Cliquez 'Charger les articles'"
echo ""

echo "⚠️  Pour arrêter le serveur: Ctrl+C"
echo ""

# Vérifier si Python 3 est disponible
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 détecté"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python détecté"
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python non trouvé"
    echo "   Installez Python pour utiliser ce script"
    exit 1
fi
