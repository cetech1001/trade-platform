const CACHE_NAME = 'trade-platform-cache-v1';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/styles.css',
  '/assets/favicons/apple-touch-icon.png',
  '/assets/favicons/favicon.ico',
  '/assets/favicons/favicon.svg',
  '/assets/favicons/favicon-96x96.png',
  '/assets/favicons/web-app-manifest-192x192.png',
  '/assets/favicons/web-app-manifest-512x512.png',
  '/assets/images/auth-bg.png',
  '/assets/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event - cleanup old caches if any
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached assets when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
