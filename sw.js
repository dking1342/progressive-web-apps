const staticCacheName = "site-static-v12";
const dynamicCacheName = "site-dynamic-v12";
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
  "/pages/offline.html",
];

// install event
self.addEventListener('install', evt => {
  // pre-caching
  evt.waitUntil((async () => {
    try {
      let cache = await caches.open(staticCacheName);
      await assets.forEach(async (asset) => {
        return await cache.add(asset)
      });
    } catch (error) {
      console.log({"install error":error})
      return new Response();
    }
  })())
});

// activate event
self.addEventListener('activate', e => {
  // get latest cache version
  e.waitUntil(
    caches
      .keys()
      .then(keys => {
        return Promise.all(keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
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
        let errorResponse = await caches.match("/pages/offline.html");
        return errorResponse;  
      } else {
        const responseToCache = response.clone();
        const cache = await caches.open(dynamicCacheName)
        await cache.put(e.request, responseToCache);
        return response;
      }
    } catch (error) {
      console.log({"fetch error":error})
      let errorResponse = await caches.match("/pages/offline.html");
      return errorResponse;
    }
  })())
})
