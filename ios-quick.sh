#!/bin/bash

# Script rapide pour lancer CrossCheck dans le simulateur iOS
echo "📱 Lancement rapide iOS..."

# Démarrer le serveur si nécessaire
if ! curl -s --connect-timeout 2 http://localhost:8080/ > /dev/null; then
    echo "🚀 Démarrage du serveur..."
    python3 -m http.server 8080 &
    sleep 2
fi

# Trouver et démarrer le premier iPhone disponible
DEVICE_ID=$(xcrun simctl list devices | grep -E "iPhone.*\(" | head -1 | grep -o '[A-F0-9-]\{36\}')

if [ ! -z "$DEVICE_ID" ]; then
    echo "📱 Démarrage du simulateur..."
    xcrun simctl boot "$DEVICE_ID" 2>/dev/null
    open -a Simulator
    sleep 3
    xcrun simctl openurl "$DEVICE_ID" "http://localhost:8080/index.html"
    echo "✅ CrossCheck ouvert dans le simulateur iOS !"
else
    echo "❌ Aucun simulateur iPhone trouvé"
    echo "💡 Utilisez : ./lancer-simulateur-ios.sh pour plus d'options"
fi
