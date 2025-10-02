#!/bin/bash

# Script pour lancer CrossCheck dans le simulateur iOS de Xcode
echo "📱 Lancement du simulateur iOS pour CrossCheck..."
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="http://localhost:8080/index.html"
DEVICE_NAME="iPhone 15"  # Vous pouvez changer ici
DEVICE_OS="iOS 17.0"     # Version iOS

echo -e "${BLUE}🔧 Configuration :${NC}"
echo "   📱 Appareil : $DEVICE_NAME"
echo "   🌐 URL : $SITE_URL"
echo ""

# Vérifier si le serveur HTTP est actif
echo -e "${YELLOW}🌐 Vérification du serveur local...${NC}"
if curl -s --connect-timeout 3 http://localhost:8080/ > /dev/null; then
    echo -e "${GREEN}✅ Serveur HTTP actif sur le port 8080${NC}"
else
    echo -e "${RED}❌ Serveur HTTP non accessible${NC}"
    echo -e "${YELLOW}🚀 Démarrage du serveur HTTP...${NC}"
    python3 -m http.server 8080 &
    SERVER_PID=$!
    echo "   📡 Serveur démarré (PID: $SERVER_PID)"
    sleep 3
fi

# Lister les simulateurs disponibles
echo -e "${YELLOW}📱 Recherche des simulateurs disponibles...${NC}"
AVAILABLE_DEVICES=$(xcrun simctl list devices available | grep -E "iPhone|iPad" | head -10)
echo "$AVAILABLE_DEVICES"
echo ""

# Trouver l'ID du simulateur iPhone
echo -e "${YELLOW}🔍 Recherche du simulateur $DEVICE_NAME...${NC}"
DEVICE_ID=$(xcrun simctl list devices | grep "$DEVICE_NAME" | grep "Booted\|Shutdown" | head -1 | grep -o '[A-F0-9-]\{36\}')

if [ -z "$DEVICE_ID" ]; then
    echo -e "${YELLOW}⚠️  $DEVICE_NAME non trouvé, recherche d'un iPhone disponible...${NC}"
    DEVICE_ID=$(xcrun simctl list devices | grep -E "iPhone.*\(" | head -1 | grep -o '[A-F0-9-]\{36\}')
    DEVICE_NAME=$(xcrun simctl list devices | grep "$DEVICE_ID" | sed 's/.*iPhone/iPhone/' | sed 's/ (.*//')
fi

if [ -z "$DEVICE_ID" ]; then
    echo -e "${RED}❌ Aucun simulateur iPhone trouvé${NC}"
    echo -e "${YELLOW}💡 Solutions :${NC}"
    echo "   1. Ouvrez Xcode → Window → Devices and Simulators"
    echo "   2. Ajoutez un simulateur iPhone"
    echo "   3. Ou utilisez le simulateur web : http://localhost:8080/test-mobile.html"
    exit 1
fi

echo -e "${GREEN}✅ Simulateur trouvé : $DEVICE_NAME ($DEVICE_ID)${NC}"

# Démarrer le simulateur
echo -e "${YELLOW}🚀 Démarrage du simulateur...${NC}"
xcrun simctl boot "$DEVICE_ID" 2>/dev/null || echo "   (Simulateur déjà démarré)"

# Ouvrir l'app Simulator
echo -e "${YELLOW}📱 Ouverture de l'application Simulator...${NC}"
open -a Simulator

# Attendre que le simulateur soit prêt
echo -e "${YELLOW}⏳ Attente du démarrage complet...${NC}"
sleep 5

# Ouvrir Safari dans le simulateur
echo -e "${YELLOW}🌐 Ouverture de Safari dans le simulateur...${NC}"
xcrun simctl openurl "$DEVICE_ID" "$SITE_URL"

echo ""
echo -e "${GREEN}🎉 CrossCheck lancé dans le simulateur iOS !${NC}"
echo ""
echo -e "${BLUE}📱 Simulateur actif :${NC}"
echo "   📱 Appareil : $DEVICE_NAME"
echo "   🌐 URL : $SITE_URL"
echo ""
echo -e "${BLUE}🧪 Tests à effectuer :${NC}"
echo "   🍔 Menu hamburger (☰) - doit s'ouvrir en glissant"
echo "   🔍 Recherche mobile - cliquez sur l'icône"
echo "   📱 Navigation tactile - testez les liens"
echo "   🔄 Rotation d'écran - testez portrait/paysage"
echo ""
echo -e "${BLUE}🔧 Commandes utiles :${NC}"
echo "   • Fermer le simulateur : Cmd+Q dans Simulator"
echo "   • Changer d'appareil : Device → Manage Devices"
echo "   • Recharger la page : Cmd+R dans Safari"
echo ""
echo -e "${YELLOW}💡 Pages à tester :${NC}"
echo "   🏠 Accueil : http://localhost:8080/index.html"
echo "   📚 Articles : http://localhost:8080/articles.html"
echo "   📖 Ressources : http://localhost:8080/ressources.html"
echo "   ℹ️  À propos : http://localhost:8080/apropos.html"
echo ""
echo -e "${GREEN}✨ Votre site CrossCheck est maintenant dans un vrai simulateur iOS !${NC}"
