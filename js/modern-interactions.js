/**
 * CrossCheck Modern Interactions
 * Modern JavaScript for enhanced user experience
 */

class CrossCheckApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupHeader();
    this.setupMobileMenu();
    this.setupScrollAnimations();
    this.setupSmoothScrolling();
    this.setupLazyLoading();
    this.setupSearch();
    this.setupThemeToggle();
    this.setupPerformanceOptimizations();
  }

  // Header scroll effects
  setupHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll
      if (scrollY > lastScrollY && scrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.mobile-nav .nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
      
      // Animate hamburger icon
      toggle.classList.toggle('active');
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      }
    });
  }

  // Scroll animations with Intersection Observer
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.article-card, .card, .section-header, .cta-section'
    );
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });

    // Staggered animation for grid items
    const gridItems = document.querySelectorAll('.article-card');
    gridItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Lazy loading for images
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Search functionality
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        this.hideSearchResults();
        return;
      }

      searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);
    });

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
        this.hideSearchResults();
      }
    });
  }

  performSearch(query) {
    // Simple client-side search
    const articles = document.querySelectorAll('.article-card');
    const results = [];

    articles.forEach(article => {
      const title = article.querySelector('.article-title')?.textContent.toLowerCase();
      const excerpt = article.querySelector('.article-excerpt')?.textContent.toLowerCase();
      
      if (title?.includes(query.toLowerCase()) || excerpt?.includes(query.toLowerCase())) {
        results.push({
          title: article.querySelector('.article-title')?.textContent,
          excerpt: article.querySelector('.article-excerpt')?.textContent,
          link: article.href
        });
      }
    });

    this.displaySearchResults(results);
  }

  displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="text-gray-500">Aucun résultat trouvé</p>';
    } else {
      searchResults.innerHTML = results.map(result => `
        <a href="${result.link}" class="search-result-item">
          <h4>${result.title}</h4>
          <p>${result.excerpt}</p>
        </a>
      `).join('');
    }

    searchResults.style.display = 'block';
  }

  hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
      searchResults.style.display = 'none';
    }
  }

  // Theme toggle functionality
  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update toggle button
      themeToggle.setAttribute('aria-label', `Switch to ${currentTheme} theme`);
    });
  }

  // Performance optimizations
  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize images
    this.optimizeImages();
    
    // Setup service worker for caching
    this.setupServiceWorker();
  }

  preloadCriticalResources() {
    // Preload hero image
    const heroImage = new Image();
    heroImage.src = 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1920&h=1080&fit=crop';
    
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
  }

  optimizeImages() {
    // Add loading="lazy" to images below the fold
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img, index) => {
      if (index > 2) { // Skip first few images (above the fold)
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Enhanced article modal functionality
class ArticleModal {
  constructor() {
    this.modal = null;
    this.setupModalTriggers();
  }

  setupModalTriggers() {
    document.addEventListener('click', (e) => {
      const articleCard = e.target.closest('.article-card[data-modal]');
      if (articleCard) {
        e.preventDefault();
        this.openModal(articleCard.dataset.modal);
      }
    });
  }

  openModal(articleId) {
    const article = this.getArticleData(articleId);
    if (!article) return;

    this.createModal(article);
    this.showModal();
  }

  getArticleData(id) {
    // This would typically fetch from an API or data source
    const articles = {
      'dna': {
        title: "Complexité irréductible de l'ADN",
        category: "Science",
        content: `
          <p>La complexité de l'ADN révèle des mécanismes si sophistiqués qu'ils défient l'explication par l'évolution aléatoire seule.</p>
          <h2>Le code génétique</h2>
          <p>L'ADN contient un code informationnel complexe, similaire à un programme informatique.</p>
        `
      }
      // Add more articles as needed
    };

    return articles[id];
  }

  createModal(article) {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Fermer">&times;</button>
        <div class="modal-header">
          <span class="modal-category">${article.category}</span>
          <h1 class="modal-title">${article.title}</h1>
        </div>
        <div class="modal-body">
          ${article.content}
        </div>
      </div>
    `;

    // Add event listeners
    this.modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    document.body.appendChild(this.modal);
  }

  showModal() {
    document.body.style.overflow = 'hidden';
    this.modal.style.display = 'flex';
    requestAnimationFrame(() => {
      this.modal.classList.add('active');
    });
  }

  closeModal() {
    this.modal.classList.remove('active');
    setTimeout(() => {
      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      document.body.style.overflow = '';
    }, 300);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CrossCheckApp();
  new ArticleModal();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CrossCheckApp, ArticleModal };
}
