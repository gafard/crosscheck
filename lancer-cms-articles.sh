#!/bin/bash

echo "========================================"
echo "    CMS ARTICLES CROSSCHECK"
echo "========================================"
echo ""
echo "Démarrage du gestionnaire d'articles..."
echo ""

# Vérifier si le fichier CMS existe
if [ ! -f "cms-articles.html" ]; then
    echo "ERREUR: Le fichier cms-articles.html n'a pas été trouvé !"
    echo "Assurez-vous que ce fichier est dans le même dossier."
    exit 1
fi

# Ouvrir le CMS dans le navigateur par défaut
echo "Ouverture du CMS dans votre navigateur..."

# Détecter le système d'exploitation et ouvrir le navigateur
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "cms-articles.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "cms-articles.html"
else
    echo "Système d'exploitation non reconnu. Ouvrez manuellement cms-articles.html dans votre navigateur."
fi

echo ""
echo "Le CMS Articles CrossCheck est maintenant ouvert dans votre navigateur."
echo ""
echo "INSTRUCTIONS :"
echo "- Remplissez le formulaire pour créer un nouvel article"
echo "- Les fichiers HTML seront téléchargés automatiquement"
echo "- Placez les fichiers dans le dossier de votre site web"
echo ""
echo "Pour fermer cette fenêtre, appuyez sur Entrée..."
read
