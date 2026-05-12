/* sw.js — 图片缓存 Service Worker */
const CACHE_NAME = ‘feed-img-v1’;

self.addEventListener(‘install’, () => self.skipWaiting());
self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
).then(() => self.clients.claim())
);
});

self.addEventListener(‘fetch’, e => {
// 只缓存图片请求
if (e.request.destination !== ‘image’) return;
e.respondWith(
caches.open(CACHE_NAME).then(cache =>
cache.match(e.request).then(cached => {
if (cached) return cached;
return fetch(e.request).then(res => {
if (res.ok) cache.put(e.request, res.clone());
return res;
}).catch(() => cached); // 离线时返回缓存
})
)
);
});