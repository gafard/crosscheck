// Script d'import des articles existants vers le CMS
// Ce script extrait le contenu de tous les articles HTML existants

const fs = require('fs');
const path = require('path');

// Liste des articles à importer (sans les templates)
const articlesToImport = [
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

// Fonction pour extraire le contenu d'un article
function extractArticleContent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extraire le titre
        const titleMatch = content.match(/<title>(.*?) - CrossCheck<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'Titre non trouvé';
        
        // Extraire la catégorie (basée sur le nom du fichier)
        let category = 'apologetique'; // par défaut
        if (filePath.includes('science') || filePath.includes('big-bang') || filePath.includes('dna') || filePath.includes('evolution') || filePath.includes('fine-tuning')) {
            category = 'science';
        } else if (filePath.includes('archeologie') || filePath.includes('jericho') || filePath.includes('mesha') || filePath.includes('catacombes')) {
            category = 'archeologie';
        } else if (filePath.includes('histoire') || filePath.includes('togo') || filePath.includes('missions') || filePath.includes('croisades')) {
            category = 'histoire';
        }
        
        // Extraire la description (première phrase du contenu)
        const contentMatch = content.match(/<div class="article-content">(.*?)<\/div>/s);
        let description = 'Description extraite du contenu';
        if (contentMatch) {
            const textContent = contentMatch[1].replace(/<[^>]*>/g, '').trim();
            description = textContent.substring(0, 150) + '...';
        }
        
        // Extraire le contenu complet
        let fullContent = '';
        if (contentMatch) {
            fullContent = contentMatch[1].replace(/<br><br>/g, '\n\n').replace(/<[^>]*>/g, '').trim();
        }
        
        // Extraire l'image
        const imageMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*class="article-image"/);
        const image = imageMatch ? imageMatch[1] : 'https://via.placeholder.com/800x400?text=Article+CrossCheck';
        
        // Extraire la date
        const dateMatch = content.match(/<span>(\d{1,2}\/\d{1,2}\/\d{4})<\/span>/);
        const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('fr-FR');
        
        return {
            title: title,
            category: category,
            description: description,
            content: fullContent,
            image: image,
            date: date,
            originalFile: path.basename(filePath),
            id: Date.now() + Math.random()
        };
    } catch (error) {
        console.error(`Erreur lors de l'extraction de ${filePath}:`, error.message);
        return null;
    }
}

// Fonction pour générer le JSON d'import
function generateImportData() {
    const importedArticles = [];
    
    console.log('🔄 Import des articles existants...');
    
    articlesToImport.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            const article = extractArticleContent(filePath);
            if (article) {
                importedArticles.push(article);
                console.log(`✅ ${fileName} → ${article.title}`);
            }
        } else {
            console.log(`❌ ${fileName} non trouvé`);
        }
    });
    
    return importedArticles;
}

// Générer les données d'import
const importedArticles = generateImportData();

// Sauvegarder dans un fichier JSON
const importData = {
    articles: importedArticles,
    importDate: new Date().toISOString(),
    totalArticles: importedArticles.length
};

fs.writeFileSync('imported-articles.json', JSON.stringify(importData, null, 2));

console.log(`\n🎉 Import terminé !`);
console.log(`📊 ${importedArticles.length} articles importés`);
console.log(`💾 Données sauvegardées dans imported-articles.json`);

// Générer le code JavaScript pour le CMS
const jsCode = `
// Articles importés automatiquement
const importedArticles = ${JSON.stringify(importedArticles, null, 2)};

// Ajouter les articles importés au localStorage
function importExistingArticles() {
    const existingArticles = JSON.parse(localStorage.getItem('cms-articles') || '[]');
    const allArticles = [...existingArticles, ...importedArticles];
    localStorage.setItem('cms-articles', JSON.stringify(allArticles));
    console.log('Articles importés avec succès !');
    return allArticles;
}

// Exécuter l'import
importExistingArticles();
`;

fs.writeFileSync('import-articles-cms.js', jsCode);

console.log(`📄 Code JavaScript généré dans import-articles-cms.js`);
console.log(`\n📋 INSTRUCTIONS:`);
console.log(`1. Ouvrir cms-articles.html`);
console.log(`2. Ouvrir la console (F12)`);
console.log(`3. Copier-coller le contenu de import-articles-cms.js`);
console.log(`4. Tous vos articles seront importés dans le CMS !`);
