/* sw.js — Surround-field v3.0.0 · bump CACHE on every deploy */
const CACHE = 'sf-v3.0.0';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './og-cover.png'];

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => c.addAll(['./', './index.html'])))
    .then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;

  // Never cache the optional wasm core probe failures
  if (url.pathname.includes('/ffmpeg/')) {
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request)));
    return;
  }

  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => {
      const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => hit)));
});
