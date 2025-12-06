// CMS - Content Management System pour CrossCheck
// Charge et affiche les articles depuis le fichier JSON

// Convertir le Markdown en HTML (pour les liens)
function markdownToHtml(text) {
  if (!text) return '';
  
  // Échapper le HTML pour éviter les injections
  let html = escapeHtml(text);
  
  // Convertir les liens Markdown [texte](url) en liens HTML
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  html = html.replace(linkPattern, (match, text, url) => {
    // Nettoyer l'URL (enlever les guillemets si présents)
    const cleanUrl = url.trim().replace(/^["']|["']$/g, '');
    // Vérifier que l'URL est valide
    if (cleanUrl && (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('/') || cleanUrl.startsWith('#'))) {
      return `<a href="${escapeHtml(cleanUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
    }
    return match; // Si l'URL n'est pas valide, retourner le texte original
  });
  
  return html;
}

// Échapper le HTML pour éviter les injections
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

class CMS {
  constructor() {
    this.articles = {
      apologetique: [],
      science: [],
      histoire: [],
      archeologie: []
    };
  }

  // Charger les articles depuis le fichier JSON ou les données intégrées
  async loadArticles() {
    try {
      // Essayer d'abord de charger depuis le JSON (si serveur disponible)
      if (window.location.protocol !== 'file:') {
        try {
          const response = await fetch('data/articles.json');
          if (response.ok) {
            const data = await response.json();
            this.articles = data;
            return data;
          }
        } catch (e) {
          console.log('Chargement depuis JSON échoué, utilisation des données intégrées');
        }
      }

      // Si on est en mode file:// ou si le fetch a échoué, utiliser les données intégrées
      if (typeof ARTICLES_DATA !== 'undefined') {
        this.articles = ARTICLES_DATA;
        return ARTICLES_DATA;
      } else {
        throw new Error('Données d\'articles non disponibles. Vérifiez que js/articles-data.js est chargé.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      this.showErrorMessage('Erreur lors du chargement des articles. Vérifiez que js/articles-data.js est chargé.');
      return null;
    }
  }

  // Afficher un message d'erreur
  showErrorMessage(message) {
    const containers = document.querySelectorAll('.article-list, .articles-grid');
    containers.forEach(container => {
      if (container && container.children.length === 0) {
        container.innerHTML = `
          <div style="padding: 2rem; background: #fee; border-radius: 0.5rem; color: #c33; text-align: center;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">⚠️ ${message}</p>
            <p style="font-size: 0.9rem; color: #666;">
              Le CMS nécessite un serveur web local pour fonctionner.<br/>
              Consultez <strong>README.md</strong> pour les instructions.
            </p>
          </div>
        `;
      }
    });
  }

  // Rendre un article en HTML (format liste complète)
  renderArticleFull(article, type = 'apologetique') {
    const categoryMap = {
      'apologetique': 'Apologétique',
      'science': 'Science & Foi',
      'histoire': 'Histoire',
      'archeologie': 'Archéologie'
    };

    const categoryLabel = categoryMap[article.category] || article.category || categoryMap[type] || type;
    // Convertir le Markdown en HTML pour chaque paragraphe
    const paragraphs = article.content.map(p => `<p>${markdownToHtml(p)}</p>`).join('');
    
    // Normaliser le chemin de l'image
    let imagePath = article.image || '';
    if (imagePath) {
      // Si c'est une URL complète (http/https), la garder telle quelle
      if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
        // Chemin relatif : encoder les espaces et caractères spéciaux dans chaque segment
        const pathParts = imagePath.split('/');
        imagePath = pathParts.map(part => {
          // Encoder chaque partie du chemin pour gérer les espaces et caractères spéciaux
          return encodeURIComponent(part);
        }).join('/');
      }
    }
    // Créer l'élément image avec gestion d'erreur améliorée
    const imageHtml = imagePath ? `<img src="${imagePath}" alt="${escapeHtml(article.title)}" class="article-image" loading="lazy" onerror="console.error('Image non trouvée:', '${imagePath}'); this.style.display='none'; if(this.nextElementSibling && this.nextElementSibling.classList && this.nextElementSibling.classList.contains('image-credits')) { this.nextElementSibling.style.display='none'; }" />` : '';
    const imageCreditsHtml = (imagePath && article.imageCredits) ? `<p class="image-credits">${escapeHtml(article.imageCredits)}</p>` : '';

    // Pour les articles complets, pas de lien "Lire la suite" car tout est déjà affiché
    // Seulement pour les ressources avec URL externe
    const linkHtml = article.url ? `<a href="${article.url}" target="_blank" class="external-link">Accéder à la ressource →</a>` : '';

    const authorHtml = article.author ? `<div class="author">Par ${escapeHtml(article.author)}</div>` : '';
    
    // Boutons de partage social
    const currentUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(article.title);
    const shareText = encodeURIComponent(article.excerpt || article.title);
    const shareButtons = `
      <div class="share-buttons" aria-label="Partager cet article">
        <span class="share-label">Partager :</span>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook" class="share-btn share-facebook">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" aria-label="Partager sur Twitter" class="share-btn share-twitter">Twitter</a>
        <a href="https://www.linkedin.com/shareArticle?url=${currentUrl}&title=${shareTitle}" target="_blank" rel="noopener noreferrer" aria-label="Partager sur LinkedIn" class="share-btn share-linkedin">LinkedIn</a>
        <button onclick="navigator.share({title: '${escapeHtml(article.title)}', text: '${escapeHtml(shareText)}', url: '${window.location.href}'})" class="share-btn share-native" aria-label="Partager via l'appareil" style="display: none;">Partager</button>
      </div>
    `;
    
    return `
      <article class="article-item" data-category="${article.category || type}">
        ${imageHtml}
        ${imageCreditsHtml}
        <h3>${article.title}</h3>
        <div class="date">Publié le ${article.date} • ${categoryLabel}</div>
        ${authorHtml}
        ${shareButtons}
        ${paragraphs}
        ${linkHtml}
      </article>
    `;
  }

  // Rendre un article en HTML (format card pour page d'accueil)
  renderArticleCard(article, type = 'apologetique') {
    const linkUrls = {
      'apologetique': 'apologetique.html',
      'science': 'science.html',
      'histoire': 'histoire.html',
      'archeologie': 'archeologie.html'
    };
    const linkUrl = linkUrls[type] || 'articles.html';
    
    // Normaliser le chemin de l'image
    let imagePath = article.image || '';
    if (imagePath) {
      // Si c'est une URL complète (http/https), la garder telle quelle
      if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
        // Chemin relatif : encoder les espaces et caractères spéciaux dans chaque segment
        const pathParts = imagePath.split('/');
        imagePath = pathParts.map(part => {
          // Encoder chaque partie du chemin pour gérer les espaces et caractères spéciaux
          return encodeURIComponent(part);
        }).join('/');
      }
    }
    // Créer l'élément image avec gestion d'erreur améliorée
    const imageHtml = imagePath ? `<div class="article-image" style="background-image: url('${imagePath}');"></div>` : '';
    
    const categoryMap = {
      'apologetique': 'Apologétique',
      'science': 'Science & Foi',
      'histoire': 'Histoire',
      'archeologie': 'Archéologie'
    };
    const categoryLabel = categoryMap[article.category] || article.category || categoryMap[type] || type;
    
    const authorHtml = article.author ? `<span class="article-author">${escapeHtml(article.author)}</span>` : '';
    
    return `
      <a href="${linkUrl}" class="article-card">
        ${imageHtml}
        <div class="article-content">
          <div class="article-category">${categoryLabel}</div>
          <h3 class="article-title">${article.title}</h3>
          <p class="article-excerpt">${article.excerpt}</p>
          <div class="article-meta">
            ${authorHtml}
            <span class="article-date">${article.date}</span>
          </div>
        </div>
      </a>
    `;
  }

  // Afficher les articles sur une page
  async displayArticles(containerSelector, type = 'apologetique', limit = null) {
    const data = await this.loadArticles();
    if (!data) {
      console.error('Impossible de charger les articles');
      return;
    }

    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error(`Conteneur non trouvé: ${containerSelector}`);
      return;
    }

    let articles = data[type] || [];
    if (articles.length === 0) {
      container.innerHTML = `
        <p style="padding: 2rem; text-align: center; color: var(--secondary);">
          Aucun article disponible pour le moment.
        </p>
      `;
      return;
    }

    // Trier les articles par date (plus récent en premier)
    articles = articles.sort((a, b) => {
      try {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateB - dateA; // Plus récent en premier
        }
      } catch (e) {
        // Si la date ne peut pas être parsée, garder l'ordre original
      }
      // Si les dates ne sont pas valides, comparer les chaînes
      return (b.date || '').localeCompare(a.date || '');
    });

    const articlesToShow = limit ? articles.slice(0, limit) : articles;
    container.innerHTML = articlesToShow
      .map(article => this.renderArticleFull(article, type))
      .join('');
  }

  // Afficher les articles en format card (pour page d'accueil)
  async displayArticleCards(containerSelector, type = 'apologetique', limit = 3) {
    const data = await this.loadArticles();
    if (!data) {
      console.error('Impossible de charger les articles');
      return;
    }

    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error(`Conteneur non trouvé: ${containerSelector}`);
      return;
    }

    const articles = (data[type] || []).filter(a => a.featured);
    if (articles.length === 0) {
      container.innerHTML = `
        <p style="padding: 2rem; text-align: center; color: var(--secondary);">
          Aucun article en vedette disponible.
        </p>
      `;
      return;
    }

    const articlesToShow = articles.slice(0, limit);
    container.innerHTML = articlesToShow
      .map(article => this.renderArticleCard(article, type))
      .join('');
  }

  // Filtrer les articles par catégorie
  filterByCategory(category) {
    const articles = document.querySelectorAll('.article-item');
    articles.forEach(article => {
      const articleCategory = article.getAttribute('data-category');
      if (category === 'all' || articleCategory === category) {
        article.style.display = '';
      } else {
        article.style.display = 'none';
      }
    });
  }
}

// Initialiser le CMS
const cms = new CMS();

// Fonction pour charger les articles au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  const pathname = window.location.pathname;
  
  // Page apologetique.html
  if (pathname.includes('apologetique') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'apologetique');
  }

  // Page science.html
  if (pathname.includes('science') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'science');
  }

  // Page histoire.html
  if (pathname.includes('histoire') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'histoire');
  }

  // Page archeologie.html
  if (pathname.includes('archeologie') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'archeologie');
  }

  // Page articles.html - afficher tous les articles
  if (pathname.includes('articles') && document.querySelector('.articles-grid')) {
    const container = document.querySelector('.articles-grid');
    if (container) {
      Promise.all([
        cms.loadArticles()
      ]).then(([data]) => {
        if (data) {
          const allArticles = [
            ...(data.apologetique || []).map(a => ({...a, category: 'apologetique'})),
            ...(data.science || []).map(a => ({...a, category: 'science'})),
            ...(data.histoire || []).map(a => ({...a, category: 'histoire'})),
            ...(data.archeologie || []).map(a => ({...a, category: 'archeologie'}))
          ];
          
          // Trier par date
          allArticles.sort((a, b) => {
            try {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                return dateB - dateA;
              }
            } catch (e) {}
            return (b.date || '').localeCompare(a.date || '');
          });
          
          container.innerHTML = allArticles
            .map(article => cms.renderArticleCard(article, article.category))
            .join('');
        }
      });
    }
  }

  // Page d'accueil - articles en vedette
  if (pathname.includes('index') && document.querySelector('.articles-grid')) {
    cms.loadArticles().then(data => {
      if (data) {
        const featuredArticles = [
          ...(data.apologetique || []).filter(a => a.featured).slice(0, 1),
          ...(data.science || []).filter(a => a.featured).slice(0, 1),
          ...(data.histoire || []).filter(a => a.featured).slice(0, 1),
          ...(data.archeologie || []).filter(a => a.featured).slice(0, 1)
        ];
        
        const container = document.querySelector('.articles-grid');
        if (container && featuredArticles.length > 0) {
          container.innerHTML = featuredArticles
            .map(article => cms.renderArticleCard(article, article.category || 'apologetique'))
            .join('');
        }
      }
    });
  }

  // Gestion des filtres de catégories
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      categoryButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      cms.filterByCategory(category);
    });
  });
});

// Exporter pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CMS;
}

