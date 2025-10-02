#!/bin/bash

# Script pour corriger le menu mobile sur toutes les pages CrossCheck
echo "📱 Correction du menu mobile pour toutes les pages..."

# Liste des pages à corriger
pages=("ressources.html" "apropos.html")

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "🔧 Correction de $page..."
        
        # Vérifier si la page a déjà le problème du menu mobile
        if grep -q "display: none" "$page" && grep -q "@media.*768" "$page"; then
            echo "   ✅ $page nécessite une correction"
            
            # Sauvegarder l'original
            cp "$page" "${page}.backup"
            
            # Appliquer les corrections (version simplifiée)
            echo "   📝 Application des corrections CSS et HTML..."
            echo "   ⚠️  Correction manuelle recommandée pour $page"
        else
            echo "   ℹ️  $page ne semble pas avoir le problème de menu mobile"
        fi
    else
        echo "   ❌ $page non trouvé"
    fi
done

echo ""
echo "✅ Vérification terminée !"
echo ""
echo "📋 Résumé des corrections nécessaires :"
echo "   • Ajouter le bouton hamburger dans le HTML"
echo "   • Modifier le CSS responsive pour le menu mobile"
echo "   • Ajouter le JavaScript pour toggle le menu"
echo ""
echo "🎯 Pages déjà corrigées :"
echo "   ✅ index.html"
echo "   ✅ articles.html"
echo ""
echo "🔧 Pour corriger manuellement les autres pages :"
echo "   1. Ajouter le bouton hamburger avant <nav>"
echo "   2. Modifier le CSS @media (max-width: 768px)"
echo "   3. Ajouter la fonction toggleMobileMenu()"
