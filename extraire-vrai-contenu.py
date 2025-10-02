#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import json
from bs4 import BeautifulSoup

# Liste de tous les fichiers d'articles
article_files = [
    'article-african-apologetics.html',
    'article-apologetique-afrique.html',
    'article-apologetique-togo.html',
    'article-archeologie-afrique.html',
    'article-archeologie-biblique.html',
    'article-big-bang.html',
    'article-catacombes.html',
    'article-conscience.html',
    'article-croisades.html',
    'article-dialogue-interreligieux.html',
    'article-dna.html',
    'article-evolution-creation.html',
    'article-exode-animisme-paralleles.html',
    'article-fine-tuning.html',
    'article-gospel-reliability.html',
    'article-jericho.html',
    'article-mesha.html',
    'article-missions-afrique.html',
    'article-missions-catholiques.html',
    'article-pentecotisme-afrique.html',
    'article-problem-evil.html',
    'article-resurrection-christ.html',
    'article-science-foi.html',
    'article-science-prouve-dieu.html',
    'article-sites-togo.html',
    'article-thomas-aquinas.html',
    'article-togo-histoire.html'
]

def extract_article_content(file_path):
    """Extrait le contenu réel d'un article HTML"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extraire le titre
        title_element = soup.find('h1', class_='article-title')
        title = title_element.get_text().strip() if title_element else 'Titre non trouvé'
        
        # Extraire la catégorie
        category_element = soup.find('div', class_='article-category')
        category_text = category_element.get_text().strip() if category_element else ''
        
        # Déterminer la catégorie
        category = 'apologetique'  # par défaut
        if category_text:
            category_lower = category_text.lower()
            if 'science' in category_lower or 'foi' in category_lower:
                category = 'science'
            elif 'histoire' in category_lower:
                category = 'histoire'
            elif 'archéologie' in category_lower or 'archeologie' in category_lower:
                category = 'archeologie'
        
        # Extraire le contenu complet
        content_section = soup.find('section', class_='article-content')
        if content_section:
            # Supprimer les balises HTML et extraire le texte
            content_text = content_section.get_text()
            # Nettoyer le texte
            content_text = re.sub(r'\s+', ' ', content_text).strip()
            # Créer une description (premiers 200 caractères)
            description = content_text[:200] + '...' if len(content_text) > 200 else content_text
        else:
            content_text = 'Contenu non trouvé'
            description = 'Description non trouvée'
        
        # Extraire l'image
        img_element = soup.find('img')
        image_url = img_element.get('src') if img_element else 'https://via.placeholder.com/800x400?text=Article+CrossCheck'
        
        # Extraire la date
        date_element = soup.find('span')
        date = date_element.get_text().strip() if date_element else 'Par Rédaction'
        
        # Icône basée sur la catégorie
        icons = {
            'apologetique': '🛡️',
            'science': '🔬',
            'histoire': '📚',
            'archeologie': '🏛️'
        }
        
        return {
            'id': hash(file_path) % 1000000,  # ID basé sur le nom du fichier
            'title': title,
            'category': category,
            'description': description,
            'content': content_text,
            'image': image_url,
            'date': date,
            'originalFile': os.path.basename(file_path),
            'icon': icons.get(category, '📄')
        }
        
    except Exception as e:
        print(f"Erreur lors de l'extraction de {file_path}: {e}")
        return None

def main():
    """Fonction principale"""
    print("=== EXTRACTION DU VRAI CONTENU DES ARTICLES ===")
    print()
    
    extracted_articles = []
    
    for file_name in article_files:
        if os.path.exists(file_name):
            print(f"📄 Extraction de {file_name}...")
            article = extract_article_content(file_name)
            if article:
                extracted_articles.append(article)
                print(f"   ✅ {article['title']}")
            else:
                print(f"   ❌ Erreur d'extraction")
        else:
            print(f"   ❌ Fichier {file_name} non trouvé")
    
    # Sauvegarder les articles extraits
    output_file = 'articles-vrai-contenu.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_articles, f, ensure_ascii=False, indent=2)
    
    print()
    print(f"🎉 {len(extracted_articles)} articles extraits avec succès !")
    print(f"📁 Fichier de sortie: {output_file}")
    
    # Afficher un résumé
    print()
    print("📊 RÉSUMÉ PAR CATÉGORIE:")
    categories = {}
    for article in extracted_articles:
        cat = article['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    for cat, count in categories.items():
        print(f"   • {cat}: {count} articles")

if __name__ == "__main__":
    main()
