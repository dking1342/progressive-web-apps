const staticCacheName = "site-static-v2";
const assets = [
  "/",
  "/index.html",
  "/pages/about.html",
  "/pages/contact.html",
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
self.addEventListener("fetch", e => {
  // checking if asset is in cache
  const headerObject = new Headers();
  headerObject.append("Access-Control-Allow-Origin", "*");
  headerObject.append("Access-Control-Allow-Credentials", "true");
  headerObject.append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  headerObject.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  headerObject.append('Content-Type', 'application/json');

  if(e.request.method === "GET"){
    e.respondWith(
      caches
        .match(e.request)
        .then( (cacheRes) => {
  
          return cacheRes || fetch(e.request.url,{
            method: e.request.method, 
            mode: 'cors', 
            cache: e.request.cache, 
            credentials: 'same-origin', 
            headers: headerObject,
            redirect: 'follow', 
            referrerPolicy: 'no-referrer'
          })
        })
        .catch( err => console.log({"fetch error":err,"event":e.request}))
    )
  } else {
    console.log("fetch not get")
    fetch(e.request.url,{
      method: e.request.method, 
      mode: 'cors', 
      cache: e.request.cache, 
      credentials: 'same-origin', 
      headers: headerObject,
      redirect: 'follow', 
      referrerPolicy: 'no-referrer'
    })
  }

})