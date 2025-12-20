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
      editorial: [],
      reportage: [],
      interview: [],
      enquete: [],
      analyse: [],
      billet: []
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

  // Rendre un article en HTML (format liste complète - Style Nouvel Obs)
  renderArticleFull(article, type = 'editorial') {
    const categoryMap = {
      'editorial': 'Éditorial',
      'reportage': 'Reportage',
      'interview': 'Interview',
      'enquete': 'Enquête',
      'analyse': 'Analyse',
      'billet': 'Billet'
    };

    const categoryLabel = categoryMap[article.genre] || categoryMap[article.category] || article.genre || article.category || categoryMap[type] || type;
    
    // Convertir le Markdown en HTML pour chaque paragraphe
    const paragraphs = article.content.map(p => `<p>${markdownToHtml(p)}</p>`).join('');
    
    // Calculer le temps de lecture approximatif (250 mots par minute)
    const wordCount = (article.excerpt || '').split(/\s+/).length + 
                     paragraphs.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 250));
    
    // Normaliser le chemin de l'image
    let imagePath = article.image || '';
    if (imagePath) {
      if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
        const pathParts = imagePath.split('/');
        imagePath = pathParts.map(part => encodeURIComponent(part)).join('/');
      }
    }
    
    // Image principale
    const imageHtml = imagePath ? `
      <div class="article-featured-image">
        <img src="${imagePath}" alt="${escapeHtml(article.title)}" loading="lazy" 
             onerror="this.style.display='none';" />
        ${article.imageCredits ? `<p class="article-image-credits">${escapeHtml(article.imageCredits)}</p>` : ''}
      </div>
    ` : '';
    
    // Auteur et date
    const authorHtml = article.author ? `<span class="article-author">Par <strong>${escapeHtml(article.author)}</strong></span>` : '';
    const dateHtml = article.date ? `<span class="article-date">Publié le ${article.date}</span>` : '';
    
    // Résumé/lead
    const excerptHtml = article.excerpt ? `<div class="article-lead">${markdownToHtml(article.excerpt)}</div>` : '';
    
    // Boutons d'interaction
    const currentUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(article.title);
    const shareText = encodeURIComponent(article.excerpt || article.title);
    
    return `
      <article class="article-full-nouvelobs" data-category="${article.genre || article.category || type}">
        <div class="article-category-tags">
          <span class="article-category">${categoryLabel}</span>
          <span class="article-badge">Info « CrossCheck »</span>
        </div>
        
        <h1 class="article-title-nouvelobs">${escapeHtml(article.title)}</h1>
        
        ${excerptHtml}
        
        <div class="article-meta-nouvelobs">
          ${authorHtml}
          ${dateHtml}
          <span class="article-reading-time">Lecture: ${readingTime} min.</span>
        </div>
        
        ${imageHtml}
        
        <div class="article-actions-nouvelobs">
          <button class="action-btn comment-btn" aria-label="Commenter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Commenter
          </button>
          <button class="action-btn share-btn-icon" aria-label="Partager" onclick="navigator.share({title: '${escapeHtml(article.title)}', text: '${escapeHtml(shareText)}', url: '${window.location.href}'})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
        
        <div class="article-content-nouvelobs">
          ${paragraphs}
        </div>
        
        <div class="article-share-nouvelobs">
          <span class="share-label">Partager :</span>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" target="_blank" rel="noopener noreferrer" class="share-link">Facebook</a>
          <a href="https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" class="share-link">Twitter</a>
          <a href="https://www.linkedin.com/shareArticle?url=${currentUrl}&title=${shareTitle}" target="_blank" rel="noopener noreferrer" class="share-link">LinkedIn</a>
        </div>
      </article>
    `;
  }

  // Rendre un article en HTML (format card pour page d'accueil)
  renderArticleCard(article, type = 'editorial') {
    const linkUrls = {
      'editorial': 'editorial.html',
      'reportage': 'reportage.html',
      'interview': 'interview.html',
      'enquete': 'enquete.html',
      'analyse': 'analyse.html',
      'billet': 'billet.html'
    };
    const genre = article.genre || article.category || type;
    const linkUrl = linkUrls[genre] || 'articles.html';
    
    // Normaliser le chemin de l'image
    let imagePath = article.image || '';
    if (imagePath) {
      // Si c'est une URL complète (http/https), la garder telle quelle
      if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
        // Corriger le chemin : Images avec majuscule
        if (imagePath.startsWith('images/')) {
          imagePath = 'Images/' + imagePath.replace('images/', '');
        }
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
      'editorial': 'Éditorial',
      'reportage': 'Reportage',
      'interview': 'Interview',
      'enquete': 'Enquête',
      'analyse': 'Analyse',
      'billet': 'Billet'
    };
    // genre est déjà déclaré ligne 206, on réutilise la variable
    const categoryLabel = categoryMap[genre] || genre;
    
    const authorHtml = article.author ? `<span class="article-author"><strong>${escapeHtml(article.author)}</strong></span>` : '';
    
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
  async displayArticles(containerSelector, type = 'editorial', limit = null) {
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
  async displayArticleCards(containerSelector, type = 'editorial', limit = 3) {
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
  
  // Page editorial.html
  if (pathname.includes('editorial') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'editorial');
  }

  // Page reportage.html
  if (pathname.includes('reportage') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'reportage');
  }

  // Page interview.html
  if (pathname.includes('interview') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'interview');
  }

  // Page enquete.html
  if (pathname.includes('enquete') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'enquete');
  }

  // Page analyse.html
  if (pathname.includes('analyse') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'analyse');
  }

  // Page billet.html
  if (pathname.includes('billet') && document.querySelector('.article-list, .articles-grid')) {
    cms.displayArticles('.article-list, .articles-grid', 'billet');
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
            ...(data.editorial || []).map(a => ({...a, genre: 'editorial'})),
            ...(data.reportage || []).map(a => ({...a, genre: 'reportage'})),
            ...(data.interview || []).map(a => ({...a, genre: 'interview'})),
            ...(data.enquete || []).map(a => ({...a, genre: 'enquete'})),
            ...(data.analyse || []).map(a => ({...a, genre: 'analyse'})),
            ...(data.billet || []).map(a => ({...a, genre: 'billet'}))
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
            .map(article => cms.renderArticleCard(article, article.genre || article.category))
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
          ...(data.editorial || []).filter(a => a.featured).slice(0, 1),
          ...(data.reportage || []).filter(a => a.featured).slice(0, 1),
          ...(data.interview || []).filter(a => a.featured).slice(0, 1),
          ...(data.enquete || []).filter(a => a.featured).slice(0, 1),
          ...(data.analyse || []).filter(a => a.featured).slice(0, 1),
          ...(data.billet || []).filter(a => a.featured).slice(0, 1)
        ];
        
        const container = document.querySelector('.articles-grid');
        if (container && featuredArticles.length > 0) {
          container.innerHTML = featuredArticles
            .map(article => cms.renderArticleCard(article, article.genre || article.category || 'editorial'))
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


          ...(data.editorial || []).filter(a => a.featured).slice(0, 1),
          ...(data.reportage || []).filter(a => a.featured).slice(0, 1),
          ...(data.interview || []).filter(a => a.featured).slice(0, 1),
          ...(data.enquete || []).filter(a => a.featured).slice(0, 1),
          ...(data.analyse || []).filter(a => a.featured).slice(0, 1),
          ...(data.billet || []).filter(a => a.featured).slice(0, 1)
        ];
        
        const container = document.querySelector('.articles-grid');
        if (container && featuredArticles.length > 0) {
          container.innerHTML = featuredArticles
            .map(article => cms.renderArticleCard(article, article.genre || article.category || 'editorial'))
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


          ...(data.editorial || []).filter(a => a.featured).slice(0, 1),
          ...(data.reportage || []).filter(a => a.featured).slice(0, 1),
          ...(data.interview || []).filter(a => a.featured).slice(0, 1),
          ...(data.enquete || []).filter(a => a.featured).slice(0, 1),
          ...(data.analyse || []).filter(a => a.featured).slice(0, 1),
          ...(data.billet || []).filter(a => a.featured).slice(0, 1)
        ];
        
        const container = document.querySelector('.articles-grid');
        if (container && featuredArticles.length > 0) {
          container.innerHTML = featuredArticles
            .map(article => cms.renderArticleCard(article, article.genre || article.category || 'editorial'))
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

