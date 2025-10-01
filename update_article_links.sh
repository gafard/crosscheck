#!/bin/bash

# Script pour mettre à jour les liens des articles connexes

echo "=== MISE À JOUR DES LIENS DES ARTICLES CONNEXES ==="
echo ""

# Fonction pour mettre à jour un article
update_article() {
    local article="$1"
    local link1="$2"
    local title1="$3"
    local excerpt1="$4"
    local link2="$5"
    local title2="$6"
    local excerpt2="$7"
    local link3="$8"
    local title3="$9"
    local excerpt3="${10}"
    
    if [ -f "$article" ]; then
        echo "🔄 Mise à jour des liens pour $article"
        
        # Créer le nouveau contenu des articles connexes
        cat > temp_related.html << EOF
                    <a href="$link1" class="related-card" style="text-decoration: none; color: inherit;">
                        <div class="related-image" style="background-image: url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')"></div>
                        <h3 class="related-card-title">$title1</h3>
                        <p class="related-card-excerpt">$excerpt1</p>
                    </a>

                    <a href="$link2" class="related-card" style="text-decoration: none; color: inherit;">
                        <div class="related-image" style="background-image: url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')"></div>
                        <h3 class="related-card-title">$title2</h3>
                        <p class="related-card-excerpt">$excerpt2</p>
                    </a>

                    <a href="$link3" class="related-card" style="text-decoration: none; color: inherit;">
                        <div class="related-image" style="background-image: url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')"></div>
                        <h3 class="related-card-title">$title3</h3>
                        <p class="related-card-excerpt">$excerpt3</p>
                    </a>
EOF
        
        # Remplacer le contenu entre les balises related-grid
        sed -i '' '/<div class="related-grid">/,/<\/div>/c\
                <div class="related-grid">\
'"$(cat temp_related.html)"'\
                </div>' "$article"
        
        rm temp_related.html
        echo "✅ Liens mis à jour pour $article"
    fi
}

# Mettre à jour les articles
update_article "article-fine-tuning.html" \
    "article-big-bang.html" "Le Big Bang et l'Existence de Dieu" "Comment la théorie du Big Bang confirme l'existence d'un Créateur intelligent." \
    "article-dna.html" "L'ADN et le Design Intelligent" "Comment l'information complexe de l'ADN pointe vers un Designer intelligent." \
    "article-science-foi.html" "Science et Foi : Un Dialogue Fructueux" "L'harmonie entre la science et la foi chrétienne."

update_article "article-evolution-creation.html" \
    "article-dna.html" "L'ADN et le Design Intelligent" "Comment l'information complexe de l'ADN pointe vers un Designer intelligent." \
    "article-big-bang.html" "Le Big Bang et l'Existence de Dieu" "Comment la théorie du Big Bang confirme l'existence d'un Créateur intelligent." \
    "article-science-foi.html" "Science et Foi : Un Dialogue Fructueux" "L'harmonie entre la science et la foi chrétienne."

update_article "article-problem-evil.html" \
    "article-conscience.html" "Le Mystère de la Conscience" "Comment la conscience humaine suggère une dimension spirituelle de l'être humain." \
    "article-resurrection-christ.html" "La Résurrection du Christ" "Examen des preuves historiques de la résurrection de Jésus-Christ." \
    "article-thomas-aquinas.html" "Thomas d'Aquin et la Raison" "L'utilisation de la raison dans l'apologétique chrétienne."

update_article "article-gospel-reliability.html" \
    "article-resurrection-christ.html" "La Résurrection du Christ" "Examen des preuves historiques de la résurrection de Jésus-Christ." \
    "article-archeologie-biblique.html" "Découvertes Archéologiques Bibliques" "Comment les découvertes archéologiques confirment l'historicité biblique." \
    "article-thomas-aquinas.html" "Thomas d'Aquin et la Raison" "L'utilisation de la raison dans l'apologétique chrétienne."

echo ""
echo "🎉 Mise à jour des liens terminée !"
