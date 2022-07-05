const staticCacheName = "site-static-v6";
const dynamicCacheName = "site-dynamic-v5";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/materialize.min.js",
  "/js/navbar.js",
  "/css/style.css",
  "/img/dish.png",
  "/css/materialize.min.css",
  "/manifest.json",
  "/js/serviceWorker.js",
  "/icons",
];
// const iteratorAssets = assets[Symbol.iterator]()

// install event
self.addEventListener('install', evt => {
  // pre-caching
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => {
        return cache.addAll(assets)
      })
      .catch(err => console.log({"install error": err}))
  )
});

// activate event
self.addEventListener('activate', e => {
  // get latest cache version
  e.waitUntil(
    caches
      .keys()
      .then(keys => {
        return Promise.all(keys
          .filter(key => key !== staticCacheName)
          .map(key => caches.delete(key))
        )
      })
  )
});

// fetch events
self.addEventListener("fetch", (e) => {
  if (!(e.request.url.indexOf('http') === 0)) return; 

  e.respondWith((async () => {
    try {
      const cachedResponse = await caches.match(e.request);
      if(cachedResponse) return cachedResponse;
  
      const response = await fetch(e.request);

      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      const responseToCache = response.clone();
      const cache = await caches.open(dynamicCacheName)
      await cache.put(e.request, responseToCache);

      return response;

      // await caches
      //   .open(dynamicCacheName)
      //   .put(e.request.url, fetchResponse.clone())
      // return fetchResponse;      
    } catch (error) {
      console.log({"fetch error":error})
    }
  })())
})
