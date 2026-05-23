self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Do nothing, just need a fetch handler to satisfy PWA requirements
});
