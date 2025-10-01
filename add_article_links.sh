#!/bin/bash

# Remplacer les cartes d'articles par des liens cliquables
sed -i '' 's/<div class="article-card" data-category="science">/<a href="article-dna.html" class="article-card" data-category="science" style="text-decoration: none; color: inherit;">/g' articles.html
sed -i '' 's/<div class="article-card" data-category="apologetique">/<a href="article-resurrection-christ.html" class="article-card" data-category="apologetique" style="text-decoration: none; color: inherit;">/g' articles.html
sed -i '' 's/<div class="article-card" data-category="archeologie">/<a href="article-archeologie-biblique.html" class="article-card" data-category="archeologie" style="text-decoration: none; color: inherit;">/g' articles.html
sed -i '' 's/<div class="article-card" data-category="histoire">/<a href="article-catacombes.html" class="article-card" data-category="histoire" style="text-decoration: none; color: inherit;">/g' articles.html

# Remplacer les balises de fermeture
sed -i '' 's/<\/div>/<\/a>/g' articles.html

echo "✅ Liens ajoutés vers les articles"
