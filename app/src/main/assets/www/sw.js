// Poliglot: internet bo'lmasa ham ochiladi; internet bo'lsa yangi versiyani oladi
var C = "poliglot-v3";
var FILES = ["./", "index.html", "app.js", "data.js", "stories.js", "dialogs.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var cp = r.clone(); caches.open(C).then(function (c) { c.put(e.request, cp); }); return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
