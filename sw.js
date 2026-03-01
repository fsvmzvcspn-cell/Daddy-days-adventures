const CACHE = 'saar-uitjes-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Bij installatie: nieuwe cache vullen
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting(); // direct activeren, niet wachten
});

// Bij activatie: oude caches verwijderen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // direct alle open tabs overnemen
});

// Fetch: netwerk eerst, cache als fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
