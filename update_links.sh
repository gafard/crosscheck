#!/bin/bash

# Articles avec leurs liens connexes appropriés
declare -A related_links=(
    ["article-big-bang.html"]="article-fine-tuning.html,article-dna.html,article-conscience.html"
    ["article-dna.html"]="article-big-bang.html,article-conscience.html,article-evolution-creation.html"
    ["article-conscience.html"]="article-dna.html,article-resurrection-christ.html,article-problem-evil.html"
    ["article-resurrection-christ.html"]="article-gospel-reliability.html,article-archeologie-biblique.html,article-conscience.html"
    ["article-african-apologetics.html"]="article-apologetique-afrique.html,article-apologetique-togo.html,article-dialogue-interreligieux.html"
    ["article-archeologie-biblique.html"]="article-jericho.html,article-mesha.html,article-resurrection-christ.html"
    ["article-fine-tuning.html"]="article-big-bang.html,article-dna.html,article-science-foi.html"
    ["article-evolution-creation.html"]="article-dna.html,article-big-bang.html,article-science-foi.html"
    ["article-problem-evil.html"]="article-conscience.html,article-resurrection-christ.html,article-thomas-aquinas.html"
    ["article-gospel-reliability.html"]="article-resurrection-christ.html,article-archeologie-biblique.html,article-thomas-aquinas.html"
)

# Mettre à jour les liens pour chaque article
for article in "${!related_links[@]}"; do
    if [ -f "$article" ]; then
        echo "🔄 Mise à jour des liens pour $article"
        
        # Récupérer les liens connexes
        IFS=',' read -ra LINKS <<< "${related_links[$article]}"
        
        # Mettre à jour le premier lien
        if [ ${#LINKS[@]} -ge 1 ]; then
            sed -i '' "s/href=\"article-[^\"]*\"/href=\"${LINKS[0]}\"/g" "$article"
        fi
        
        # Mettre à jour le deuxième lien
        if [ ${#LINKS[@]} -ge 2 ]; then
            # Trouver la deuxième occurrence et la remplacer
            sed -i '' "s/href=\"article-[^\"]*\"/href=\"${LINKS[1]}\"/2" "$article"
        fi
        
        # Mettre à jour le troisième lien
        if [ ${#LINKS[@]} -ge 3 ]; then
            # Trouver la troisième occurrence et la remplacer
            sed -i '' "s/href=\"article-[^\"]*\"/href=\"${LINKS[2]}\"/3" "$article"
        fi
        
        echo "✅ Liens mis à jour pour $article"
    fi
done

echo ""
echo "🎉 Tous les liens ont été mis à jour !"
