// Script pour extraire le VRAI contenu des articles HTML
const fs = require('fs');
const path = require('path');

// Liste de tous les fichiers d'articles
const articleFiles = [
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
];

function extractArticleContent(html, fileName) {
    try {
        // Extraire le titre
        const titleMatch = html.match(/<h1 class="article-title">([^<]+)<\/h1>/);
        const title = titleMatch ? titleMatch[1].trim() : 'Titre non trouvé';

        // Extraire la catégorie
        const categoryMatch = html.match(/<div class="article-category">([^<]+)<\/div>/);
        let category = 'apologetique';
        if (categoryMatch) {
            const categoryText = categoryMatch[1].toLowerCase();
            if (categoryText.includes('science') || categoryText.includes('foi')) {
                category = 'science';
            } else if (categoryText.includes('histoire')) {
                category = 'histoire';
            } else if (categoryText.includes('archéologie') || categoryText.includes('archeologie')) {
                category = 'archeologie';
            }
        }

        // Extraire le contenu complet
        const contentMatch = html.match(/<section class="article-content">([\s\S]*?)<\/section>/);
        let content = 'Contenu non trouvé';
        let description = 'Description non trouvée';
        
        if (contentMatch) {
            // Nettoyer le HTML et extraire le texte
            const contentHtml = contentMatch[1];
            const textContent = contentHtml
                .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
                .replace(/\s+/g, ' ') // Normaliser les espaces
                .trim();
            
            content = textContent;
            description = textContent.substring(0, 200).trim() + '...';
        }

        // Extraire l'image
        const imageMatch = html.match(/<img[^>]+src="([^"]+)"[^>]*>/);
        const image = imageMatch ? imageMatch[1] : 'https://via.placeholder.com/800x400?text=Article+CrossCheck';

        // Extraire la date
        const dateMatch = html.match(/<span>([^<]+)<\/span>/);
        const date = dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString('fr-FR');

        // Icône basée sur la catégorie
        const icons = {
            'apologetique': '🛡️',
            'science': '🔬',
            'histoire': '📚',
            'archeologie': '🏛️'
        };

        return {
            id: Date.now() + Math.random(),
            title: title,
            category: category,
            description: description,
            content: content,
            image: image,
            date: date,
            originalFile: fileName,
            icon: icons[category] || '📄'
        };
    } catch (error) {
        console.error(`Erreur lors de l'extraction de ${fileName}:`, error);
        return null;
    }
}

// Extraire le contenu de tous les articles
const extractedArticles = [];

articleFiles.forEach(fileName => {
    try {
        const filePath = path.join(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf8');
            const article = extractArticleContent(html, fileName);
            if (article) {
                extractedArticles.push(article);
                console.log(`✅ ${fileName} - ${article.title}`);
            } else {
                console.log(`❌ ${fileName} - Erreur d'extraction`);
            }
        } else {
            console.log(`❌ ${fileName} - Fichier non trouvé`);
        }
    } catch (error) {
        console.log(`❌ ${fileName} - Erreur: ${error.message}`);
    }
});

// Sauvegarder les articles extraits
const outputFile = path.join(__dirname, 'articles-reels-extraits.json');
fs.writeFileSync(outputFile, JSON.stringify(extractedArticles, null, 2));

console.log(`\n🎉 ${extractedArticles.length} articles extraits et sauvegardés dans articles-reels-extraits.json`);
console.log(`📁 Fichier de sortie: ${outputFile}`);
