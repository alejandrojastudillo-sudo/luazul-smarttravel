/* ============================================================
   LUAZUL CATÁLOGO — Service Worker
   Cachea recursos para funcionamiento offline y carga rápida
   ============================================================ */

const CACHE_NAME = 'luazul-catalogo-v1';
const PRECACHE_URLS = [
  './',
  './catalogo.html',
  './manifest.json',
  './css/style.css',
  './images/logo-hero.png',
  './images/logo-footer.png',
  './images/logo-watermark.png',
  './images/bg-ocean.webp',
  './images/favicon.ico',
  './images/pwa-192.png',
  './images/pwa-512.png',
  './images/apple-touch-icon.png',
  './images/traslado-privado.webp',
  './images/traslado-compartido.webp',
  './images/hospedaje.webp'
];

// INSTALL: pre-cachea recursos críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(err => {
        // Si algún recurso falla, no rompe el install
        console.warn('[SW] Some precache resources failed:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: limpia caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH: estrategia cache-first con fallback a network
self.addEventListener('fetch', (event) => {
  // Solo GET
  if (event.request.method !== 'GET') return;

  // Ignorar requests cross-origin (Google Fonts, etc.)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Devuelve del cache y actualiza en background
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
        }).catch(() => {});
        return cached;
      }

      // No está en cache, ir a network
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(() => {
        // Offline y no cacheado: página de fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./catalogo.html');
        }
      });
    })
  );
});

// MESSAGE: permite forzar update desde la página
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
