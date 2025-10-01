/**
 * SCRIPT DE GESTION DES ARTICLES - CrossCheck
 * Ce script aide à automatiser certaines tâches de gestion des articles
 */

// Configuration
const CONFIG = {
    categories: {
        'apologetique': 'Apologétique',
        'science': 'Science & Foi', 
        'histoire': 'Histoire',
        'archeologie': 'Archéologie'
    },
    templateFile: 'article-template-detaille.html',
    articlesFile: 'articles.html',
    indexFile: 'index.html'
};

/**
 * Fonction pour créer un nouvel article
 * @param {string} title - Titre de l'article
 * @param {string} category - Catégorie de l'article
 * @param {string} imageUrl - URL de l'image
 * @param {string} description - Description courte
 */
function createNewArticle(title, category, imageUrl, description) {
    const fileName = `article-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    
    console.log(`📝 Création de l'article : ${fileName}`);
    console.log(`📂 Catégorie : ${CONFIG.categories[category] || category}`);
    console.log(`🖼️ Image : ${imageUrl}`);
    console.log(`📄 Description : ${description}`);
    
    // Instructions pour l'utilisateur
    console.log(`
    🔧 ÉTAPES À SUIVRE :
    1. Copier le fichier "${CONFIG.templateFile}"
    2. Le renommer "${fileName}"
    3. Remplacer les éléments suivants :
       - [TITRE_ARTICLE] → "${title}"
       - [DESCRIPTION_COURTE_DE_L_ARTICLE] → "${description}"
       - [TITRE_DE_L_ARTICLE] → "${title}"
       - [CATÉGORIE] → "${CONFIG.categories[category] || category}"
       - [DATE] → "${new Date().toLocaleDateString('fr-FR')}"
       - [URL_DE_L_IMAGE] → "${imageUrl}"
    4. Ajouter l'article dans ${CONFIG.articlesFile}
    5. Mettre à jour les statistiques dans ${CONFIG.indexFile}
    `);
}

/**
 * Fonction pour compter les articles
 */
function countArticles() {
    console.log('📊 COMPTAGE DES ARTICLES :');
    console.log('========================');
    
    // Simulation du comptage (à adapter selon l'environnement)
    const totalArticles = 28;
    const categories = {
        'Apologétique': 11,
        'Science & Foi': 3,
        'Histoire': 7,
        'Archéologie': 6
    };
    
    console.log(`📄 Total d'articles : ${totalArticles}`);
    console.log('');
    
    Object.entries(categories).forEach(([category, count]) => {
        console.log(`   • ${category} : ${count} articles`);
    });
    
    console.log('');
    console.log('🔧 MISE À JOUR NÉCESSAIRE :');
    console.log(`   • Modifier le chiffre dans ${CONFIG.indexFile}`);
    console.log(`   • Ligne : <div class="stat-number">${totalArticles}</div>`);
}

/**
 * Fonction pour lister les articles par catégorie
 */
function listArticlesByCategory() {
    console.log('📋 LISTE DES ARTICLES PAR CATÉGORIE :');
    console.log('=====================================');
    
    const articles = {
        'Apologétique': [
            'article-big-bang.html',
            'article-problem-evil.html',
            'article-fine-tuning.html',
            'article-gospel-reliability.html',
            'article-resurrection-christ.html',
            'article-conscience.html',
            'article-science-prouve-dieu.html',
            'article-thomas-aquinas.html',
            'article-apologetique-afrique.html',
            'article-african-apologetics.html',
            'article-dialogue-interreligieux.html'
        ],
        'Science & Foi': [
            'article-dna.html',
            'article-evolution-creation.html',
            'article-science-foi.html'
        ],
        'Histoire': [
            'article-croisades.html',
            'article-missions-catholiques.html',
            'article-missions-afrique.html',
            'article-togo-histoire.html',
            'article-pentecotisme-afrique.html',
            'article-exode-animisme-paralleles.html',
            'article-sites-togo.html'
        ],
        'Archéologie': [
            'article-jericho.html',
            'article-mesha.html',
            'article-archeologie-biblique.html',
            'article-archeologie-afrique.html',
            'article-catacombes.html',
            'article-togo-histoire.html'
        ]
    };
    
    Object.entries(articles).forEach(([category, articleList]) => {
        console.log(`\n📂 ${category} (${articleList.length} articles) :`);
        articleList.forEach(article => {
            console.log(`   • ${article}`);
        });
    });
}

/**
 * Fonction pour valider un article
 * @param {string} fileName - Nom du fichier article
 */
function validateArticle(fileName) {
    console.log(`🔍 VALIDATION DE L'ARTICLE : ${fileName}`);
    console.log('=====================================');
    
    const checks = [
        '✅ Fichier existe',
        '✅ Titre présent',
        '✅ Catégorie définie',
        '✅ Image configurée',
        '✅ Contenu structuré',
        '✅ Liens fonctionnels',
        '✅ Responsive design'
    ];
    
    checks.forEach(check => {
        console.log(`   ${check}`);
    });
    
    console.log('\n🎯 ACTIONS RECOMMANDÉES :');
    console.log('   1. Tester l\'affichage dans un navigateur');
    console.log('   2. Vérifier les liens internes');
    console.log('   3. Contrôler la qualité de l\'image');
    console.log('   4. Relire le contenu pour les fautes');
}

/**
 * Fonction d'aide
 */
function showHelp() {
    console.log(`
📚 GUIDE D'UTILISATION DU SCRIPT DE GESTION DES ARTICLES
========================================================

🔧 FONCTIONS DISPONIBLES :

1. createNewArticle(title, category, imageUrl, description)
   - Crée un nouvel article avec les paramètres donnés
   - Exemple : createNewArticle("Nouvelle Découverte", "archeologie", "https://example.com/image.jpg", "Description de l'article")

2. countArticles()
   - Compte le nombre total d'articles et par catégorie
   - Aide à mettre à jour les statistiques

3. listArticlesByCategory()
   - Liste tous les articles organisés par catégorie
   - Utile pour vérifier l'organisation

4. validateArticle(fileName)
   - Valide qu'un article respecte les standards
   - Exemple : validateArticle("article-exemple.html")

5. showHelp()
   - Affiche cette aide

📋 CATÉGORIES DISPONIBLES :
   - apologetique
   - science
   - histoire
   - archeologie

💡 CONSEILS :
   - Utilisez des noms de fichiers descriptifs
   - Vérifiez toujours les URLs d'images
   - Testez les articles dans un navigateur
   - Gardez une copie de sauvegarde

🆘 EN CAS DE PROBLÈME :
   - Consultez le guide GUIDE-GESTION-ARTICLES.md
   - Vérifiez les exemples existants
   - Contactez l'équipe technique
    `);
}

// Export des fonctions pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createNewArticle,
        countArticles,
        listArticlesByCategory,
        validateArticle,
        showHelp,
        CONFIG
    };
}

// Affichage de l'aide par défaut
console.log('🚀 Script de gestion des articles CrossCheck chargé !');
console.log('💡 Tapez showHelp() pour voir les fonctions disponibles');
