// Script pour régénérer articles-data.js depuis articles.json
// Usage: node regenerer-articles-data.js

const fs = require('fs');
const path = require('path');

const articlesJsonPath = path.join(__dirname, 'data', 'articles.json');
const articlesDataJsPath = path.join(__dirname, 'js', 'articles-data.js');

try {
  // Lire le fichier JSON
  const jsonContent = fs.readFileSync(articlesJsonPath, 'utf8');
  const articlesData = JSON.parse(jsonContent);
  
  // Générer le contenu JavaScript
  const jsContent = `// Données des articles intégrées directement dans le JavaScript
// Cela permet au CMS de fonctionner même sans serveur local (file://)
// Généré automatiquement depuis data/articles.json

const ARTICLES_DATA = ${JSON.stringify(articlesData, null, 2)};
`;
  
  // Écrire le fichier JavaScript
  fs.writeFileSync(articlesDataJsPath, jsContent, 'utf8');
  
  // Afficher les statistiques
  const total = Object.values(articlesData).reduce((sum, arr) => sum + arr.length, 0);
  console.log('✅ articles-data.js régénéré avec succès !');
  console.log('');
  console.log('📊 Statistiques:');
  console.log(`   Total d'articles: ${total}`);
  Object.keys(articlesData).forEach(genre => {
    if (articlesData[genre].length > 0) {
      console.log(`   - ${genre}: ${articlesData[genre].length} article(s)`);
    }
  });
  
} catch (error) {
  console.error('❌ Erreur lors de la régénération:', error.message);
  process.exit(1);
}

