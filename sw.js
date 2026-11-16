// Service worker for Hatim Paylaşım.
//
// Strategy:
//  - Same-origin files (index.html, app.js, manifest, icons): NETWORK-FIRST.
//    Users always get the latest deploy when online; the cache is only an
//    offline fallback. No need to bump CACHE on every release.
//  - Versioned CDN files (React, Firebase SDK, fonts): CACHE-FIRST.
//    Their URLs contain a pinned version, so they never change.
//  - Firebase Realtime Database traffic: never touched.
//
// Bump CACHE only when the list of precached assets changes shape.
const CACHE = 'hatim-v7';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;500;600;700&display=swap',
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/13.1.0/firebase-database-compat.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // Add individually so one failing CDN request doesn't abort the rest.
      Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isLiveFirebase(url) {
  return url.hostname.endsWith('firebaseio.com') ||
         url.hostname.endsWith('firebasedatabase.app') ||
         url.hostname === 'identitytoolkit.googleapis.com' ||
         url.hostname === 'securetoken.googleapis.com';
}

function putInCache(req, res) {
  if (res && (res.ok || res.type === 'opaque')) {
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(req, clone));
  }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (isLiveFirebase(url)) return;

  if (url.origin === self.location.origin) {
    // Network-first
    e.respondWith(
      fetch(req)
        .then(res => putInCache(req, res))
        .catch(() =>
          caches.match(req, { ignoreSearch: req.mode === 'navigate' })
            .then(c => c || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
            .then(c => c || Response.error())
        )
    );
    return;
  }

  // Cache-first for pinned third-party assets
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => putInCache(req, res)))
  );
});
