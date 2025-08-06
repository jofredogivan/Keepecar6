const CACHE_NAME = "keepecar6-cache-v2"; // Versão do cache atualizada
const FILES_TO_CACHE = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png", // Certifique-se de ter esses ícones
  "./icon-512.png", // Certifique-se de ter esses ícones
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css", // Versão atualizada
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js", // Versão atualizada
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap", // Adicionado para caching da fonte Inter
  // Adicione aqui qualquer outro arquivo estático que seu app precise para funcionar offline
];

self.addEventListener("install", (evt) => {
  console.log("[ServiceWorker] Install");
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Força a ativação imediata do novo Service Worker
});

self.addEventListener("activate", (evt) => {
  console.log("[ServiceWorker] Activate");
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Assume o controle de páginas não controladas
});

self.addEventListener("fetch", (evt) => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  // Serve do cache, se disponível, caso contrário, busca da rede
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});
