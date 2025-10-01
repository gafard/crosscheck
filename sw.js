/**
 * CrossCheck Service Worker
 * PWA functionality and caching for better performance
 */

const CACHE_NAME = 'crosscheck-v1.0.0';
const STATIC_CACHE = 'crosscheck-static-v1.0.0';
const DYNAMIC_CACHE = 'crosscheck-dynamic-v1.0.0';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/modern-framework.css',
  '/js/modern-interactions.js',
  '/archeologie.html',
  '/science.html',
  '/histoire.html',
  '/apologetique.html',
  '/togo.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://i.postimg.cc/vZVr1TXm/6f6159a363a500b74a0fee49e59b3d12.jpg'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        console.log('Service Worker: Fetching from network', request.url);
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'newsletter-signup') {
    event.waitUntil(syncNewsletterSignup());
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nouveau contenu disponible sur CrossCheck',
    icon: 'https://i.postimg.cc/vZVr1TXm/6f6159a363a500b74a0fee49e59b3d12.jpg',
    badge: 'https://i.postimg.cc/vZVr1TXm/6f6159a363a500b74a0fee49e59b3d12.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorer',
        icon: 'https://i.postimg.cc/vZVr1TXm/6f6159a363a500b74a0fee49e59b3d12.jpg'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: 'https://i.postimg.cc/vZVr1TXm/6f6159a363a500b74a0fee49e59b3d12.jpg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CrossCheck', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions
async function syncNewsletterSignup() {
  // Handle offline newsletter signups
  console.log('Service Worker: Syncing newsletter signup');
  // Implementation would depend on your backend API
}

// Cache management
async function updateCache() {
  const cache = await caches.open(STATIC_CACHE);
  const requests = STATIC_FILES.map(url => new Request(url));
  
  try {
    const responses = await Promise.all(
      requests.map(request => fetch(request))
    );
    
    await Promise.all(
      responses.map((response, index) => {
        if (response.ok) {
          return cache.put(requests[index], response);
        }
      })
    );
    
    console.log('Service Worker: Cache updated');
  } catch (error) {
    console.error('Service Worker: Error updating cache', error);
  }
}

// Message handling for cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    updateCache();
  }
});
