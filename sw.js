const staticCacheName = "site-static-v5";
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
  "/js/serviceWorker.js",
  "/pages/offline.html",
];

// cache size limit function
const limitCacheSize = async (name, size) => {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if(keys.length <= size){
    return;
  } else {
    await cache.delete(keys[0]);
    await limitCacheSize(name, size);
  }
}

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
  e.waitUntil((async () => {
    const keys = await caches.keys();
    return await keys
      .filter(key => key !== staticCacheName && key !== dynamicCacheName)
      .map(async (key) => await caches.delete(key));
  })())
});

// fetch events
self.addEventListener("fetch", (e) => {
  if (e.request.url.indexOf('html') < 0) return; 

  e.respondWith((async () => {
    try {
      const cachedResponse = await caches.match(e.request);
      if(cachedResponse) return cachedResponse;
  
      const response = await fetch(e.request);
      
      if (!response || response.status !== 200 || response.type !== 'basic') {
        let errorResponse = await caches.match("/pages/offline.html");
        return errorResponse;  
      } else {
        console.log("dynamic cache")
        const responseToCache = response.clone();
        const cache = await caches.open(dynamicCacheName)
        await cache.put(e.request, responseToCache);
        await limitCacheSize(dynamicCacheName, 15);
        return response;
      }
    } catch (error) {
      console.log({"fetch error":error})
      let errorResponse = await caches.match("/pages/offline.html");
      return errorResponse;
    }
  })())
})
