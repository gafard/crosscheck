#!/usr/bin/env python3
"""
Script pour extraire le contenu complet des articles HTML et mettre à jour le fichier JSON
"""

import json
import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

def extract_article_content(html_file):
    """Extraire le contenu d'un article HTML"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extraire le titre
        title_element = soup.find('h1', class_='article-title')
        if not title_element:
            title_element = soup.find('title')
            title = title_element.get_text().replace(' - CrossCheck', '').strip() if title_element else "Titre non trouvé"
        else:
            title = title_element.get_text().strip()
        
        # Extraire la catégorie
        category_element = soup.find('div', class_='article-category')
        category = 'apologetique'  # valeur par défaut
        
        if category_element:
            cat_text = category_element.get_text().lower()
            if 'science' in cat_text or 'foi' in cat_text:
                category = 'science'
            elif 'histoire' in cat_text:
                category = 'histoire'
            elif 'archéologie' in cat_text or 'archeologie' in cat_text:
                category = 'archeologie'
        else:
            # Détection par nom de fichier
            filename = os.path.basename(html_file).lower()
            if any(word in filename for word in ['science', 'big-bang', 'dna', 'evolution', 'fine-tuning', 'conscience']):
                category = 'science'
            elif any(word in filename for word in ['archeologie', 'jericho', 'mesha', 'catacombes']):
                category = 'archeologie'
            elif any(word in filename for word in ['histoire', 'togo', 'missions', 'croisades', 'pentecotisme']):
                category = 'histoire'
        
        # Extraire le contenu principal
        content_element = soup.find('article', class_='article-content')
        if not content_element:
            content_element = soup.find('div', class_='article-content')
        
        if content_element:
            # Nettoyer le contenu HTML et extraire le texte
            # Garder les paragraphes et titres
            content_text = ""
            for element in content_element.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'li']):
                text = element.get_text().strip()
                if text:
                    if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                        content_text += f"\n\n{text}\n\n"
                    elif element.name == 'blockquote':
                        content_text += f"\n\n\"{text}\"\n\n"
                    else:
                        content_text += f"{text} "
            
            content_text = re.sub(r'\s+', ' ', content_text.strip())
        else:
            content_text = "Contenu non trouvé"
        
        # Créer une description à partir du contenu
        description = content_text[:300].strip()
        if len(content_text) > 300:
            description += "..."
        
        # Extraire l'image
        image_element = soup.find('div', class_='article-image')
        image_url = "https://via.placeholder.com/800x400?text=Article+CrossCheck"
        if image_element and image_element.get('style'):
            style = image_element.get('style')
            url_match = re.search(r'url\(["\']?([^"\']+)["\']?\)', style)
            if url_match:
                image_url = url_match.group(1)
        
        # Déterminer l'icône par catégorie
        icons = {
            'apologetique': '🛡️',
            'science': '🔬',
            'histoire': '📚',
            'archeologie': '🏛️'
        }
        
        return {
            'title': title,
            'category': category,
            'description': description,
            'content': content_text,
            'image': image_url,
            'icon': icons.get(category, '📄')
        }
        
    except Exception as e:
        print(f"Erreur lors de l'extraction de {html_file}: {e}")
        return None

def main():
    """Fonction principale"""
    # Charger le fichier JSON existant
    json_file = 'articles-reels-extraits.json'
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            articles = json.load(f)
    except FileNotFoundError:
        print(f"Fichier {json_file} non trouvé")
        return
    
    # Traiter chaque article
    updated_count = 0
    
    for article in articles:
        original_file = article.get('originalFile')
        if not original_file:
            continue
        
        # Vérifier si le fichier HTML existe
        if not os.path.exists(original_file):
            print(f"Fichier {original_file} non trouvé")
            continue
        
        # Vérifier si l'article a déjà du contenu réel
        if (article.get('content') and 
            article['content'] != '{{ARTICLE_CONTENT}}' and 
            len(article['content']) > 100):
            print(f"Article {original_file} déjà traité")
            continue
        
        print(f"Extraction du contenu de {original_file}...")
        
        # Extraire le contenu
        extracted = extract_article_content(original_file)
        if extracted:
            # Mettre à jour l'article
            article.update(extracted)
            article['date'] = 'Par Rédaction'  # Garder le format original
            updated_count += 1
            print(f"✅ {original_file} mis à jour")
        else:
            print(f"❌ Échec de l'extraction pour {original_file}")
    
    # Sauvegarder le fichier JSON mis à jour
    if updated_count > 0:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        
        print(f"\n🎉 {updated_count} articles mis à jour dans {json_file}")
    else:
        print("\n📝 Aucun article à mettre à jour")

if __name__ == "__main__":
    main()
