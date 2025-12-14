// Script d'administration professionnel pour CrossCheck
// Gestion complète des articles avec support des catégories

let articlesData = {
  editorial: [],
  reportage: [],
  interview: [],
  enquete: [],
  analyse: [],
  billet: []
};

let editingId = null;
let allArticles = [];
let quillEditor = null;

// Variables pour stocker les handles de dossiers (File System Access API)
let dataFolderHandle = null;
let jsFolderHandle = null;
let imagesFolderHandle = null;

// Initialiser l'éditeur Quill
function initQuillEditor() {
  // Si déjà initialisé, on ne recommence pas
  if (quillEditor) return;
  
  const editorContainer = document.getElementById('article-content-editor');
  if (!editorContainer) {
    console.warn('Conteneur Quill (#article-content-editor) non trouvé');
    return;
  }
  
  if (typeof Quill === 'undefined') {
    console.error("Quill.js n'est pas chargé (script CDN manquant ou ordre incorrect).");
    return;
  }
  
  try {
    quillEditor = new Quill(editorContainer, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['blockquote', 'code-block'],
          ['clean']
        ]
      },
      placeholder: 'Rédigez votre article ici...'
    });
    console.log('✅ Quill initialisé');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Quill:', error);
  }
}

// Convertir le HTML de Quill en tableau de paragraphes
function quillHtmlToContent(html) {
  if (!html || html === '<p><br></p>' || html.trim() === '') return [];

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const elements = [];
  const nodes = tempDiv.childNodes;

  nodes.forEach(node => {
    if (node.nodeType === 1) { // Element node
      // Inclure les images/iframes/videos directement
      if (node.tagName === 'IMG' || node.tagName === 'IFRAME' || node.tagName === 'VIDEO') {
        elements.push(node.outerHTML);
      }
      // Ou si l'élément contient une image/iframe/video (ex: <p><img...></p>)
      else if (node.querySelector && (node.querySelector('img') || node.querySelector('iframe') || node.querySelector('video'))) {
        elements.push(node.outerHTML);
      }
      // Ou si l'élément a du texte
      else if (node.textContent && node.textContent.trim()) {
        elements.push(node.outerHTML);
      }
    }
  });

  return elements.length > 0 ? elements : [html];
}

// Labels des genres
const genreLabels = {
  'editorial': 'Éditorial',
  'reportage': 'Reportage',
  'interview': 'Interview',
  'enquete': 'Enquête',
  'analyse': 'Analyse',
  'billet': 'Billet'
};

// Formater une date au format français
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Charger les articles avec migration automatique
async function loadArticles() {
  try {
    // Essayer de charger depuis le JSON
    if (window.location.protocol !== 'file:') {
      try {
        const response = await fetch('../data/articles.json');
        if (response.ok) {
          const data = await response.json();
          // Migrer les anciens types vers les nouveaux genres
          articlesData = migrateData(data);
          displayArticles();
          updateStats();
          return;
        }
      } catch (e) {
        console.log('Chargement depuis JSON échoué, utilisation des données intégrées', e);
      }
    }

    // Utiliser les données intégrées
    if (typeof ARTICLES_DATA !== 'undefined') {
      articlesData = migrateData(ARTICLES_DATA);
      displayArticles();
      updateStats();
    } else {
      // Attendre que le script soit chargé
      let attempts = 0;
      const maxAttempts = 20;
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof ARTICLES_DATA !== 'undefined') {
          clearInterval(checkInterval);
          articlesData = migrateData(ARTICLES_DATA);
          displayArticles();
          updateStats();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          showError('Données d\'articles non disponibles. Vérifiez que js/articles-data.js est chargé.');
        }
      }, 100);
    }
  } catch (error) {
    console.error('Erreur:', error);
    showError('Erreur lors du chargement des articles: ' + error.message);
  }
}

// Migrer les anciennes données vers les nouveaux genres
function migrateData(data) {
  const newData = {
    editorial: [],
    reportage: [],
    interview: [],
    enquete: [],
    analyse: [],
    billet: []
  };

  // Si les données sont déjà dans le nouveau format, les utiliser directement
  if (data.editorial || data.reportage || data.interview || data.enquete || data.analyse || data.billet) {
    return {
      editorial: data.editorial || [],
      reportage: data.reportage || [],
      interview: data.interview || [],
      enquete: data.enquete || [],
      analyse: data.analyse || [],
      billet: data.billet || []
    };
  }

  // Migration depuis l'ancien format (si nécessaire)
  // Migrer les anciennes catégories vers les nouveaux genres
  if (data.apologetique) {
    newData.editorial = data.apologetique.map(a => ({ ...a, genre: 'editorial' }));
  }
  if (data.science) {
    newData.analyse = data.science.map(a => ({ ...a, genre: 'analyse' }));
  }
  if (data.histoire) {
    newData.reportage = data.histoire.map(a => ({ ...a, genre: 'reportage' }));
  }
  if (data.archeologie) {
    newData.enquete = data.archeologie.map(a => ({ ...a, genre: 'enquete' }));
  }

  // Migration depuis le format très ancien (analyses, temoignages, etc.)
  if (data.analyses) {
    newData.analyse = data.analyses.map(a => ({ ...a, genre: 'analyse' }));
  }
  if (data.temoignages) {
    newData.interview = data.temoignages.map(a => ({ ...a, genre: 'interview' }));
  }
  if (data.actualites) {
    newData.reportage = data.actualites.map(a => ({ ...a, genre: 'reportage' }));
  }
  if (data.ressources) {
    newData.enquete = data.ressources.map(a => ({ ...a, genre: 'enquete' }));
  }

  return newData;
}

// Afficher les statistiques
function updateStats() {
  const container = document.getElementById('stats-container');
  if (!container) return;

  const total = Object.values(articlesData).reduce((sum, arr) => sum + arr.length, 0);
  const featured = Object.values(articlesData).flat().filter(a => a.featured).length;

  container.innerHTML = `
    <div class="stat-card">
      <h3>Total d'articles</h3>
      <p class="number">${total}</p>
    </div>
    <div class="stat-card">
      <h3>En vedette</h3>
      <p class="number">${featured}</p>
    </div>
    <div class="stat-card">
      <h3>Éditorial</h3>
      <p class="number">${articlesData.editorial.length}</p>
    </div>
    <div class="stat-card">
      <h3>Reportage</h3>
      <p class="number">${articlesData.reportage.length}</p>
    </div>
    <div class="stat-card">
      <h3>Interview</h3>
      <p class="number">${articlesData.interview.length}</p>
    </div>
    <div class="stat-card">
      <h3>Enquête</h3>
      <p class="number">${articlesData.enquete.length}</p>
    </div>
    <div class="stat-card">
      <h3>Analyse</h3>
      <p class="number">${articlesData.analyse.length}</p>
    </div>
    <div class="stat-card">
      <h3>Billet</h3>
      <p class="number">${articlesData.billet.length}</p>
    </div>
  `;
}

// Afficher la liste des articles
function displayArticles(filteredArticles = null) {
  const container = document.getElementById('articles-container');
  if (!container) return;

  // Utiliser les articles filtrés ou tous les articles
  const articles = filteredArticles || getAllArticles();

  if (articles.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p>Aucun article trouvé.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = articles.map(article => {
    const genre = article.genre || article.category;
    const genreLabel = genreLabels[genre] || genre || 'Non catégorisé';

    const authorInfo = article.author ? `<span>✍️ ${escapeHtml(article.author)}</span>` : '';
    
    return `
      <div class="article-item-admin">
        <div class="article-info">
          <h4>${escapeHtml(article.title)}</h4>
          <div class="meta">
            <span>📝 ${genreLabel}</span>
            <span>📅 ${article.date}</span>
            ${authorInfo}
            ${article.featured ? '<span>⭐ En vedette</span>' : ''}
          </div>
        </div>
        <div class="article-actions">
          <button class="btn-edit" onclick="editArticle(${article.id}, '${genre}')">
            Modifier
          </button>
          <button class="btn-delete" onclick="deleteArticle(${article.id}, '${genre}')">
            Supprimer
          </button>
        </div>
      </div>
    `;
  }).join('');

  allArticles = articles;
}

// Obtenir tous les articles
function getAllArticles() {
  const all = [];
  Object.keys(articlesData).forEach(genre => {
    articlesData[genre].forEach(article => {
      all.push({ ...article, genre });
    });
  });
  return all.sort((a, b) => {
    // Trier par date (plus récent en premier)
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB - dateA;
      }
    } catch (e) {}
    return b.date.localeCompare(a.date);
  });
}

// Recherche et filtrage
function setupSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const filterSelect = document.getElementById('filter-type');

  const filterArticles = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = filterSelect.value;

    let filtered = getAllArticles();

    if (filterType) {
      filtered = filtered.filter(a => (a.genre || a.category) === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchTerm) ||
        a.excerpt.toLowerCase().includes(searchTerm) ||
        (a.content && a.content.join(' ').toLowerCase().includes(searchTerm))
      );
    }

    displayArticles(filtered);
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }
  if (filterSelect) {
    filterSelect.addEventListener('change', filterArticles);
  }
}

// Échapper le HTML pour éviter les injections
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Afficher un message d'erreur
function showError(message) {
  const container = document.getElementById('articles-container');
  const alertContainer = document.getElementById('alert-container');
  
  if (alertContainer) {
    alertContainer.innerHTML = `
      <div class="alert alert-error">
        <strong>Erreur:</strong> ${escapeHtml(message)}
      </div>
    `;
    setTimeout(() => {
      alertContainer.innerHTML = '';
    }, 5000);
  }
  
  if (container && container.innerHTML.includes('Chargement')) {
    container.innerHTML = `
      <div class="alert alert-error">
        <strong>Erreur:</strong> ${escapeHtml(message)}
      </div>
    `;
  }
}

// Afficher un message de succès
function showSuccess(message) {
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    alertContainer.innerHTML = `
      <div class="alert alert-success">
        ${escapeHtml(message)}
      </div>
    `;
    setTimeout(() => {
      alertContainer.innerHTML = '';
    }, 5000);
  }
}

// Ajouter un paragraphe
function addParagraph() {
  const container = document.getElementById('content-paragraphs');
  const div = document.createElement('div');
  div.className = 'paragraph-item';
  div.innerHTML = `
    <div style="display: flex; flex-direction: column; flex: 1; gap: 0.5rem;">
      <textarea class="paragraph-input"></textarea>
      <button type="button" class="btn-link" onclick="insertLink(this)" title="Insérer un lien dans ce paragraphe" style="align-self: flex-start; padding: 0.4rem 0.8rem; font-size: 0.85rem;">
        🔗 Insérer un lien
      </button>
    </div>
    <button type="button" class="btn-remove" onclick="removeParagraph(this)">×</button>
  `;
  container.appendChild(div);
}

// Variables pour la modal de lien
let currentTextarea = null;

// Ouvrir la modal pour insérer un lien
function insertLink(button) {
  // Trouver le textarea associé au bouton
  const paragraphItem = button.closest('.paragraph-item');
  const textarea = paragraphItem.querySelector('textarea');
  
  if (!textarea) {
    showError('Impossible de trouver le champ de texte.');
    return;
  }
  
  // Stocker la référence du textarea
  currentTextarea = textarea;
  
  // Ouvrir la modal
  const modal = document.getElementById('link-modal');
  if (modal) {
    modal.classList.add('active');
    // Réinitialiser les champs
    document.getElementById('link-text').value = '';
    document.getElementById('link-url').value = '';
    // Focus sur le premier champ
    setTimeout(() => {
      document.getElementById('link-text').focus();
    }, 100);
  }
}

// Fermer la modal
function closeLinkModal() {
  const modal = document.getElementById('link-modal');
  if (modal) {
    modal.classList.remove('active');
  }
  currentTextarea = null;
}

// Confirmer et insérer le lien
function confirmInsertLink() {
  const linkText = document.getElementById('link-text').value.trim();
  let linkUrl = document.getElementById('link-url').value.trim();
  
  if (!linkText) {
    showError('Veuillez entrer un texte pour le lien.');
    document.getElementById('link-text').focus();
    return;
  }
  
  if (!linkUrl) {
    showError('Veuillez entrer une URL.');
    document.getElementById('link-url').focus();
    return;
  }
  
  // Valider l'URL
  const isValidUrl = linkUrl.startsWith('http://') || 
                     linkUrl.startsWith('https://') || 
                     linkUrl.startsWith('/') || 
                     linkUrl.startsWith('#') ||
                     linkUrl.startsWith('mailto:');
  
  if (!isValidUrl) {
    const addHttps = confirm(
      'L\'URL ne commence pas par http://, https://, /, # ou mailto:.\n\n' +
      'Voulez-vous ajouter automatiquement https:// ?'
    );
    if (addHttps) {
      linkUrl = 'https://' + linkUrl;
    } else {
      return;
    }
  }
  
  if (!currentTextarea) {
    showError('Erreur : champ de texte non trouvé.');
    closeLinkModal();
    return;
  }
  
  // Insérer la syntaxe Markdown à la position du curseur
  const textarea = currentTextarea;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const before = text.substring(0, start);
  const after = text.substring(end);
  const linkMarkdown = `[${linkText}](${linkUrl})`;
  
  // Insérer le lien
  textarea.value = before + linkMarkdown + after;
  
  // Repositionner le curseur après le lien inséré
  const newPosition = start + linkMarkdown.length;
  textarea.focus();
  textarea.setSelectionRange(newPosition, newPosition);
  
  // Fermer la modal
  closeLinkModal();
  
  // Message de succès
  showSuccess('✅ Lien inséré avec succès !');
}

// Initialiser la gestion de la modal de lien
function initLinkModal() {
  const modal = document.getElementById('link-modal');
  if (modal) {
    // Fermer en cliquant en dehors
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeLinkModal();
      }
    });
    
    // Valider avec Entrée dans le champ URL
    const linkUrlInput = document.getElementById('link-url');
    if (linkUrlInput) {
      linkUrlInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirmInsertLink();
        }
      });
    }
  }
  
  // Fermer avec la touche Escape (global)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('link-modal');
      if (modal && modal.classList.contains('active')) {
        closeLinkModal();
      }
    }
  });
}

// Supprimer un paragraphe
function removeParagraph(btn) {
  const container = document.getElementById('content-paragraphs');
  if (container.children.length > 1) {
    btn.parentElement.remove();
  } else {
    alert('Vous devez avoir au moins un paragraphe.');
  }
}

// Convertir le Markdown en HTML (pour les liens)
function markdownToHtml(text) {
  if (!text) return '';
  
  // Échapper le HTML pour éviter les injections
  let html = escapeHtml(text);
  
  // Convertir les liens Markdown [texte](url) en liens HTML
  // Pattern: [texte](url) ou [texte](url "titre")
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

// Ajouter un tag
function addTag() {
  const input = document.getElementById('tag-input');
  const value = input.value.trim();
  
  if (!value) return;
  
  // Gérer les tags séparés par des virgules
  const tags = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
  
  tags.forEach(tag => {
    if (tag && !tagExists(tag)) {
      addTagToContainer(tag);
    }
  });
  
  input.value = '';
}

// Vérifier si un tag existe déjà
function tagExists(tag) {
  const container = document.getElementById('tags-container');
  const existingTags = Array.from(container.querySelectorAll('.tag-item .tag-name'));
  return existingTags.some(el => el.textContent.toLowerCase() === tag.toLowerCase());
}

// Ajouter un tag au conteneur
function addTagToContainer(tag) {
  const container = document.getElementById('tags-container');
  const tagDiv = document.createElement('div');
  tagDiv.className = 'tag-item';
  tagDiv.innerHTML = `
    <span class="tag-name">${escapeHtml(tag)}</span>
    <button type="button" class="tag-remove" onclick="removeTag(this)">×</button>
  `;
  container.appendChild(tagDiv);
}

// Supprimer un tag
function removeTag(btn) {
  btn.parentElement.remove();
}

// Obtenir tous les tags
function getTags() {
  const container = document.getElementById('tags-container');
  const tagItems = container.querySelectorAll('.tag-item .tag-name');
  return Array.from(tagItems).map(el => el.textContent.trim());
}

// Définir les tags
function setTags(tags) {
  const container = document.getElementById('tags-container');
  container.innerHTML = '';
  if (tags && Array.isArray(tags)) {
    tags.forEach(tag => {
      if (tag) {
        addTagToContainer(tag);
      }
    });
  }
}

// Éditer un article
function editArticle(id, genre) {
  const articles = articlesData[genre];
  const article = articles.find(a => a.id === id);
  if (!article) return;

  editingId = { id, genre };
  document.getElementById('form-title').textContent = 'Modifier l\'article';
  document.getElementById('article-id').value = id;
  document.getElementById('article-type-select').value = genre;
  document.getElementById('article-type').value = genre;
  document.getElementById('article-title').value = article.title;
  document.getElementById('article-excerpt').value = article.excerpt;
  document.getElementById('article-image').value = article.image || '';
  document.getElementById('article-image-credits').value = article.imageCredits || '';
  document.getElementById('article-author').value = article.author || '';
  document.getElementById('article-featured').checked = article.featured || false;

  // Convertir la date au format YYYY-MM-DD si nécessaire
  let dateValue = article.date;
  try {
    const date = new Date(article.date);
    if (!isNaN(date.getTime())) {
      dateValue = date.toISOString().split('T')[0];
    }
  } catch (e) {}
  document.getElementById('article-date').value = dateValue || new Date().toISOString().split('T')[0];

  // Remplir les paragraphes
  const paragraphsContainer = document.getElementById('content-paragraphs');
  paragraphsContainer.innerHTML = '';
  (article.content || []).forEach((para, index) => {
    if (index === 0) {
      paragraphsContainer.innerHTML = `
        <div class="paragraph-item">
          <div style="display: flex; flex-direction: column; flex: 1; gap: 0.5rem;">
            <textarea class="paragraph-input" required>${escapeHtml(para)}</textarea>
            <button type="button" class="btn-link" onclick="insertLink(this)" title="Insérer un lien dans ce paragraphe" style="align-self: flex-start; padding: 0.4rem 0.8rem; font-size: 0.85rem;">
              🔗 Insérer un lien
            </button>
          </div>
          <button type="button" class="btn-remove" onclick="removeParagraph(this)">×</button>
        </div>
      `;
    } else {
      addParagraph();
      const lastTextarea = paragraphsContainer.lastElementChild.querySelector('textarea');
      lastTextarea.value = para;
    }
  });

  // Remplir les tags
  setTags(article.tags || []);

  // Afficher la prévisualisation de l'image si elle existe
  if (article.image) {
    const previewDiv = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    if (article.image.startsWith('data:') || article.image.startsWith('http')) {
      previewImg.src = article.image;
    } else {
      previewImg.src = '../' + article.image;
    }
    previewDiv.style.display = 'block';
  } else {
    document.getElementById('image-preview').style.display = 'none';
  }

  // Scroll vers le formulaire
  document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
  updateCharCounts();
}

// Supprimer un article
function deleteArticle(id, genre) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) return;

  const articles = articlesData[genre];
  const index = articles.findIndex(a => a.id === id);
  if (index > -1) {
    articles.splice(index, 1);
    saveArticles();
    showSuccess('Article supprimé avec succès.');
  }
}

// Réinitialiser le formulaire
function resetForm() {
  editingId = null;
  document.getElementById('form-title').textContent = 'Ajouter un nouvel article';
  document.getElementById('article-form').reset();
  document.getElementById('article-type-select').value = 'editorial';
  document.getElementById('article-type').value = 'editorial';
  document.getElementById('article-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('article-author').value = '';
  document.getElementById('content-paragraphs').innerHTML = `
    <div class="paragraph-item">
      <div style="display: flex; flex-direction: column; flex: 1; gap: 0.5rem;">
        <textarea class="paragraph-input" required></textarea>
        <button type="button" class="btn-link" onclick="insertLink(this)" title="Insérer un lien dans ce paragraphe" style="align-self: flex-start; padding: 0.4rem 0.8rem; font-size: 0.85rem;">
          🔗 Insérer un lien
        </button>
      </div>
      <button type="button" class="btn-remove" onclick="removeParagraph(this)">×</button>
    </div>
  `;
  setTags([]);
  clearImagePreview();
  updateCharCounts();
}

// Mettre à jour les compteurs de caractères
function updateCharCounts() {
  const titleInput = document.getElementById('article-title');
  const excerptInput = document.getElementById('article-excerpt');
  const titleCount = document.getElementById('title-count');
  const excerptCount = document.getElementById('excerpt-count');

  if (titleInput && titleCount) {
    const updateTitleCount = () => {
      titleCount.textContent = `${titleInput.value.length} / 200 caractères`;
    };
    titleInput.removeEventListener('input', updateTitleCount);
    titleInput.addEventListener('input', updateTitleCount);
    updateTitleCount();
  }

  if (excerptInput && excerptCount) {
    const updateExcerptCount = () => {
      excerptCount.textContent = `${excerptInput.value.length} / 500 caractères`;
    };
    excerptInput.removeEventListener('input', updateExcerptCount);
    excerptInput.addEventListener('input', updateExcerptCount);
    updateExcerptCount();
  }
}

// Détecter automatiquement le dossier depuis l'URL
function detectProjectFolderFromURL() {
  const path = window.location.pathname;
  const href = window.location.href;
  
  // Si on est sur localhost ou file://
  if (path.includes('/Echos des moeurs/') || path.includes('/admin/')) {
    // Extraire le chemin jusqu'au dossier racine
    const parts = path.split('/').filter(p => p);
    const adminIndex = parts.indexOf('admin');
    if (adminIndex > 0) {
      // Retourner le chemin jusqu'au dossier racine
      const rootPath = parts.slice(0, adminIndex).join('/');
      return rootPath;
    }
  }
  
  // Si on est sur file://, essayer de détecter
  if (href.startsWith('file://')) {
    const urlPath = new URL(href).pathname;
    const parts = urlPath.split('/').filter(p => p);
    const adminIndex = parts.indexOf('admin');
    if (adminIndex > 0) {
      return '/' + parts.slice(0, adminIndex).join('/');
    }
  }
  
  return null;
}

// Essayer de restaurer automatiquement le dossier
async function tryAutoDetectFolder() {
  if (!window.showDirectoryPicker) return null;
  
  // 1. Essayer de détecter depuis l'URL
  const detectedPath = detectProjectFolderFromURL();
  if (detectedPath) {
    console.log('📁 Dossier détecté depuis URL:', detectedPath);
    // Stocker pour référence future
    localStorage.setItem('detectedProjectPath', detectedPath);
  }
  
  // 2. Essayer de restaurer depuis localStorage
  const lastFolder = localStorage.getItem('lastProjectFolder');
  const lastPath = localStorage.getItem('lastProjectPath');
  
  if (lastFolder && lastPath) {
    console.log('📁 Dernier dossier utilisé:', lastFolder, 'à', lastPath);
    return { name: lastFolder, path: lastPath };
  }
  
  return null;
}

// Stocker les permissions dans localStorage
function saveFolderPermissions(projectHandle, projectPath) {
  try {
    const folderName = projectHandle.name;
    localStorage.setItem('lastProjectFolder', folderName);
    localStorage.setItem('lastProjectPath', projectPath || window.location.pathname);
    localStorage.setItem('lastFolderSelection', new Date().toISOString());
    console.log('✅ Permissions sauvegardées pour:', folderName);
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des permissions:', e);
  }
}

// Demander à l'utilisateur de sélectionner le dossier racine du projet
async function selectProjectFolder() {
  if (!window.showDirectoryPicker) {
    alert('⚠️ Votre navigateur ne supporte pas la sauvegarde automatique.\n\nUtilisez Chrome ou Edge pour cette fonctionnalité.\n\nLes fichiers seront téléchargés normalement.');
    return false;
  }

  try {
    // Essayer de détecter automatiquement
    const autoDetected = await tryAutoDetectFolder();
    
    // Préparer les options pour showDirectoryPicker
    const pickerOptions = {
      mode: 'readwrite'
    };
    
    // Si on a détecté un chemin, essayer de l'utiliser comme suggestion
    if (autoDetected) {
      // Note: startIn ne supporte que certains dossiers système
      // Mais on peut au moins commencer dans "downloads" qui est souvent où sont les projets
      pickerOptions.startIn = 'downloads';
    } else {
      pickerOptions.startIn = 'downloads';
    }
    
    // Demander à l'utilisateur de sélectionner le dossier racine du projet
    const projectHandle = await window.showDirectoryPicker(pickerOptions);
    
    // Vérifier que c'est le bon dossier (contient data/ et js/)
    let isValid = false;
    try {
      await projectHandle.getDirectoryHandle('data', { create: false });
      await projectHandle.getDirectoryHandle('js', { create: false });
      isValid = true;
    } catch (e) {
      // Ce n'est pas le bon dossier, mais on continuera pour permettre la création
      isValid = false;
    }
    
    if (!isValid) {
      const continueAnyway = confirm(
        'Le dossier sélectionné ne semble pas être le dossier racine du projet.\n\n' +
        'Assurez-vous de sélectionner le dossier qui contient les dossiers "data" et "js".\n\n' +
        'Voulez-vous continuer quand même ? (Les dossiers seront créés si nécessaire)'
      );
      if (!continueAnyway) {
        return false;
      }
    }
    
    // Chercher ou créer le dossier data/
    let dataFolder = null;
    try {
      dataFolder = await projectHandle.getDirectoryHandle('data', { create: false });
    } catch (e) {
      const createData = confirm('Le dossier "data" n\'a pas été trouvé dans le dossier sélectionné.\n\nVoulez-vous le créer ?\n\nSinon, sélectionnez le dossier qui contient "data" et "js".');
      if (createData) {
        dataFolder = await projectHandle.getDirectoryHandle('data', { create: true });
      } else {
        showError('Veuillez sélectionner le dossier racine du projet (celui qui contient les dossiers "data" et "js").');
        return false;
      }
    }

    // Chercher ou créer le dossier js/
    let jsFolder = null;
    try {
      jsFolder = await projectHandle.getDirectoryHandle('js', { create: false });
    } catch (e) {
      const createJs = confirm('Le dossier "js" n\'a pas été trouvé dans le dossier sélectionné.\n\nVoulez-vous le créer ?');
      if (createJs) {
        jsFolder = await projectHandle.getDirectoryHandle('js', { create: true });
      } else {
        showError('Veuillez sélectionner le dossier racine du projet (celui qui contient les dossiers "data" et "js").');
        return false;
      }
    }

    // Chercher ou créer le dossier images/
    let imagesFolder = null;
    try {
      imagesFolder = await projectHandle.getDirectoryHandle('images', { create: false });
    } catch (e) {
      const createImages = confirm('Le dossier "images" n\'a pas été trouvé.\n\nVoulez-vous le créer pour sauvegarder les images uploadées ?');
      if (createImages) {
        imagesFolder = await projectHandle.getDirectoryHandle('images', { create: true });
      }
    }

    dataFolderHandle = dataFolder;
    jsFolderHandle = jsFolder;
    imagesFolderHandle = imagesFolder;
    
    // Sauvegarder les permissions pour la prochaine fois
    const projectPath = window.location.pathname.split('/').slice(0, -2).join('/') || window.location.href;
    saveFolderPermissions(projectHandle, projectPath);
    
    // Mettre à jour l'interface
    updateFolderSelectionUI(true);
    
    showSuccess('✅ Dossiers sélectionnés ! Les fichiers seront maintenant sauvegardés automatiquement dans data/ et js/.');
    
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Sélection de dossier annulée');
    } else {
      console.error('Erreur lors de la sélection:', error);
      showError('Erreur lors de la sélection des dossiers: ' + error.message);
    }
    return false;
  }
}

// Mettre à jour l'interface de sélection de dossiers
function updateFolderSelectionUI(selected) {
  const statusDiv = document.getElementById('folder-selection-status');
  const statusText = document.getElementById('folders-status');
  const selectBtn = document.getElementById('select-folders-btn');
  
  if (statusDiv && statusText && selectBtn) {
    if (selected) {
      const lastFolder = localStorage.getItem('lastProjectFolder');
      const lastDate = localStorage.getItem('lastFolderSelection');
      let statusMsg = '✅ Dossiers sélectionnés - Sauvegarde automatique activée';
      
      if (lastFolder) {
        statusMsg += `\n📁 Dossier: ${lastFolder}`;
      }
      if (lastDate) {
        const date = new Date(lastDate);
        statusMsg += `\n🕒 Dernière sélection: ${date.toLocaleDateString('fr-FR')}`;
      }
      
      statusText.textContent = statusMsg;
      statusText.style.color = '#10b981';
      selectBtn.textContent = '🔄 Changer le dossier';
    } else {
      // Vérifier si on a une détection automatique
      const detectedPath = localStorage.getItem('detectedProjectPath');
      const lastFolder = localStorage.getItem('lastProjectFolder');
      
      let statusMsg = 'Sélectionnez le dossier racine (celui qui contient data/ et js/)';
      
      if (detectedPath || lastFolder) {
        statusMsg += '\n💡 Dossier détecté automatiquement - Cliquez pour confirmer';
        if (lastFolder) {
          statusMsg += `\n📁 Dernier dossier: ${lastFolder}`;
        }
      }
      
      statusText.textContent = statusMsg;
      statusText.style.color = 'var(--color-text-secondary)';
      selectBtn.textContent = '📁 Sélectionner le dossier du projet';
    }
  }
}

// Appeler automatiquement au chargement pour afficher les infos
async function autoRestoreFolders() {
  if (!window.showDirectoryPicker) return;
  
  const lastPath = localStorage.getItem('lastProjectPath');
  const lastFolder = localStorage.getItem('lastProjectFolder');
  const detectedPath = detectProjectFolderFromURL();
  
  if (lastPath || lastFolder || detectedPath) {
    // Afficher les informations détectées
    const statusText = document.getElementById('folders-status');
    if (statusText && !dataFolderHandle) {
      let info = '💡 ';
      if (detectedPath) {
        info += 'Dossier détecté depuis l\'URL. ';
      }
      if (lastFolder) {
        info += `Dernier dossier utilisé: ${lastFolder}. `;
      }
      info += 'Cliquez sur "Sélectionner le dossier" pour activer la sauvegarde automatique.';
      
      statusText.innerHTML = info.replace(/\n/g, '<br/>');
      statusText.style.color = '#fbbf24';
    }
  }
}

// Écrire un fichier dans un dossier
async function writeFile(folderHandle, fileName, content) {
  const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

// Écrire un fichier binaire (image)
async function writeImageFile(folderHandle, fileName, blob) {
  const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

// Gérer l'upload d'image
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Vérifier que c'est une image
  if (!file.type.startsWith('image/')) {
    showError('Veuillez sélectionner un fichier image.');
    return;
  }

  // Vérifier la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showError('L\'image est trop grande. Taille maximale : 5MB');
    return;
  }

  // Afficher la prévisualisation
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewDiv = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    previewImg.src = e.target.result;
    previewDiv.style.display = 'block';
  };
  reader.readAsDataURL(file);

  // Si le dossier images est sélectionné, sauvegarder l'image
  if (imagesFolderHandle) {
    try {
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `upload-${timestamp}.${extension}`;
      
      // Sauvegarder l'image
      await writeImageFile(imagesFolderHandle, fileName, file);
      
      // Mettre à jour le champ image avec le chemin
      document.getElementById('article-image').value = `images/${fileName}`;
      showSuccess(`✅ Image sauvegardée : images/${fileName}`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'image:', error);
      showError('Erreur lors de la sauvegarde de l\'image. Utilisation de l\'image en base64.');
      // Fallback : utiliser base64
      useBase64Image(file);
    }
  } else {
    // Pas de dossier sélectionné, utiliser base64
    useBase64Image(file);
  }
}

// Utiliser l'image en base64 (fallback)
function useBase64Image(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    // Utiliser data URI comme valeur
    document.getElementById('article-image').value = e.target.result;
    showSuccess('✅ Image chargée (format base64). Pensez à sélectionner le dossier images pour sauvegarder l\'image.');
  };
  reader.readAsDataURL(file);
}

// Effacer la prévisualisation
function clearImagePreview() {
  document.getElementById('image-preview').style.display = 'none';
  document.getElementById('preview-img').src = '';
  document.getElementById('image-upload').value = '';
  document.getElementById('article-image').value = '';
}

// Sauvegarder les articles
async function saveArticles() {
  // Utiliser directement les nouvelles catégories
  const json = JSON.stringify(articlesData, null, 2);
  
  // Générer le contenu JavaScript
  const jsContent = `// Données des articles intégrées directement dans le JavaScript
// Cela permet au CMS de fonctionner même sans serveur local (file://)
// Généré automatiquement depuis data/articles.json

const ARTICLES_DATA = ${json};
`;

  // Essayer d'utiliser l'API File System Access si disponible et si les dossiers sont sélectionnés
  if (window.showDirectoryPicker && dataFolderHandle && jsFolderHandle) {
    try {
      // Écrire directement dans les dossiers
      await writeFile(dataFolderHandle, 'articles.json', json);
      await writeFile(jsFolderHandle, 'articles-data.js', jsContent);
      
      showSuccess('✅ Fichiers sauvegardés automatiquement dans data/ et js/ !');
      loadArticles();
      return;
    } catch (error) {
      console.error('Erreur lors de l\'écriture:', error);
      showError('Erreur lors de la sauvegarde. Les dossiers ont peut-être été déplacés. Réessayez de les sélectionner.');
      // Réinitialiser les handles
      dataFolderHandle = null;
      jsFolderHandle = null;
      updateFolderSelectionUI(false);
      // Fallback vers téléchargement
    }
  }

  // Fallback : télécharger les fichiers (si API non supportée ou erreur)
  downloadFiles(json, jsContent);
}

// Fonction pour télécharger les fichiers (méthode classique)
function downloadFiles(json, jsContent) {
  // Télécharger articles.json
  const blob1 = new Blob([json], { type: 'application/json' });
  const url1 = URL.createObjectURL(blob1);
  const a1 = document.createElement('a');
  a1.href = url1;
  a1.download = 'articles.json';
  a1.click();
  URL.revokeObjectURL(url1);

  // Télécharger articles-data.js
  const blob2 = new Blob([jsContent], { type: 'application/javascript' });
  const url2 = URL.createObjectURL(blob2);
  const a2 = document.createElement('a');
  a2.href = url2;
  a2.download = 'articles-data.js';
  
  setTimeout(() => {
    a2.click();
    URL.revokeObjectURL(url2);
    showSuccess('✅ Fichiers téléchargés ! Remplacez data/articles.json et js/articles-data.js');
    loadArticles();
  }, 500);
}

// Gestion du formulaire
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('article-form');
  if (!form) return;

  // Initialiser la date à aujourd'hui
  const dateInput = document.getElementById('article-date');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const genre = document.getElementById('article-type-select').value;
    const title = document.getElementById('article-title').value.trim();
    const excerpt = document.getElementById('article-excerpt').value.trim();
    const dateInput = document.getElementById('article-date').value;
    const date = formatDate(dateInput);
    const image = document.getElementById('article-image').value.trim();
    const imageCredits = document.getElementById('article-image-credits').value.trim();
    const author = document.getElementById('article-author').value.trim();
    const featured = document.getElementById('article-featured').checked;

    // Récupérer le contenu depuis Quill
    let content = [];
    if (quillEditor) {
      const quillHtml = quillEditor.root.innerHTML;
      content = quillHtmlToContent(quillHtml);
    } else {
      // Fallback vers les paragraphes si Quill n'est pas disponible
      const paragraphs = Array.from(document.querySelectorAll('.paragraph-input'))
        .map(t => t.value.trim())
        .filter(t => t.length > 0);
      content = paragraphs;
    }

    // Récupérer les tags
    const tags = getTags();

    // Validation du contenu
    if (content.length === 0 || (content.length === 1 && content[0].trim() === '')) {
      showError('Le contenu de l\'article est requis.');
      return;
    }
    
    // Validation
    if (!title) {
      showError('Le titre est requis.');
      return;
    }
    if (!excerpt) {
      showError('Le résumé est requis.');
      return;
    }
    const article = {
      id: editingId ? editingId.id : Date.now(),
      title,
      date,
      excerpt,
      content: content,
      image: image || undefined,
      imageCredits: imageCredits || undefined,
      author: author || undefined,
      featured,
      genre,
      tags: tags.length > 0 ? tags : undefined
    };

    if (editingId) {
      // Modifier un article existant
      const articles = articlesData[editingId.genre];
      const index = articles.findIndex(a => a.id === editingId.id);
      if (index > -1) {
        articles[index] = article;
        showSuccess('Article modifié avec succès.');
      }
    } else {
      // Ajouter un nouvel article
      articlesData[genre].push(article);
      showSuccess('Article ajouté avec succès.');
    }

    saveArticles();
    resetForm();
  });

  // Changer le genre d'article
  const typeSelect = document.getElementById('article-type-select');
  if (typeSelect) {
    typeSelect.addEventListener('change', function() {
      document.getElementById('article-type').value = this.value;
    });
  }

  // Initialiser les compteurs de caractères
  updateCharCounts();

  // Initialiser la recherche et le filtrage
  setupSearchAndFilter();

  // Gestionnaire pour ajouter des tags avec la touche Entrée
  const tagInput = document.getElementById('tag-input');
  if (tagInput) {
    tagInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    });
  }

  // Gestion du bouton de sélection de dossiers
  const selectFoldersBtn = document.getElementById('select-folders-btn');
  if (selectFoldersBtn) {
    selectFoldersBtn.addEventListener('click', async () => {
      await selectProjectFolder();
    });
    
    // Afficher le bouton si l'API est supportée
    const statusDiv = document.getElementById('folder-selection-status');
    if (statusDiv && window.showDirectoryPicker) {
      statusDiv.style.display = 'block';
      updateFolderSelectionUI(false);
    } else if (statusDiv) {
      // API non supportée, masquer le bouton
      statusDiv.style.display = 'none';
    }
  }

  // Gestion de l'upload d'image
  const imageUploadInput = document.getElementById('image-upload');
  if (imageUploadInput) {
    imageUploadInput.addEventListener('change', handleImageUpload);
  }

  // Initialiser la modal de lien
  initLinkModal();
});

// Charger les articles au chargement de la page
window.addEventListener('load', function() {
  setTimeout(function() {
    loadArticles();
    // Essayer de restaurer automatiquement les informations du dossier
    autoRestoreFolders();
  }, 300);
});
