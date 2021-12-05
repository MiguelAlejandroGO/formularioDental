let staticCache = "staticCache_v1";
let dynamicCache = "dynamicCache_v1";
let immutableCache = "immutableCache_v1";
const _staticFiles = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/js/db.js"
];
const _immutableFiles = [
  "/css/bootstrap.min.css",
  "/css/bootstrap.min.css.map",
  "/js/jquery.js",
  "/js/bootstrap.bundle.min.js",
  "/js/bootstrap.bundle.min.js.map",
];

self.addEventListener("install", (installEvent) => {
  const saveStaticCache = caches
    .open(staticCache)
    .then((cache) => cache.addAll(_staticFiles));
  const saveImmutableCache = caches
    .open(immutableCache)
    .then((cache) => cache.addAll(_immutableFiles));
  installEvent.waitUntil(Promise.all([saveStaticCache, saveImmutableCache]));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!staticCache.includes(key) && !immutableCache.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  // const _result = caches.match(fetchEvent.request).then((cacheResponse) => {
  //   return (
  //     cacheResponse ||
  //     fetch(fetchEvent.request).then((networkResponse) => {
  //       caches.open(dynamicCache).then((cache) => {
  //         cache.put(fetchEvent.request, networkResponse.clone());
  //         return networkResponse;
  //       });
  //     })
  //   );
  // });
});
//First cache with backup
self.addEventListener("message", (msgClient) => {
  if (msgClient.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});
