const INDEXDB_NAME = "FOOD_DB";
const storeName = "recipes";
let indexdb = null;
const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
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
  "/js/recipeList.js",
  "http://localhost:3000/recipes",
];

// db setup
const dbOpen = async (dbName,storeName) => {
  const dbOpen = indexedDB.open(dbName)
  
  return new Promise((resolve,reject) => {
    dbOpen.onsuccess = (e) => {
      let db = e.target.result;
      let transaction = db.transaction(storeName,'readwrite');
      let store = transaction.objectStore(storeName);
      resolve(store)
    }
    
    dbOpen.onerror = () => {
      reject(dbOpen.error)
    }
    dbOpen.onupgradeneeded = e => {
      const db = e.target.result;
      db.createObjectStore(storeName);
      resolve("db init")
    };  
  })
}

const addRecipe = async (recipe) => {
  const dbOpen = indexedDB.open(INDEXDB_NAME)
  
  return new Promise((resolve,reject) => {
    dbOpen.onsuccess = (e) => {
      let db = e.target.result;
      let transaction = db.transaction(storeName,'readwrite');
      let store = transaction.objectStore(storeName);
      let newItem = store.add(recipe,recipe.id);
      
      newItem.onsuccess = event => {
        resolve(event.target.result)
      }
      newItem.onerror = event => {
        reject(event.target.error)
      }
    }
    
    dbOpen.onerror = () => {
      reject(dbOpen.error)
    }
  })
}

const getAll = () => {
  const dbOpen = indexedDB.open(INDEXDB_NAME)
  
  return new Promise((resolve,reject) => {
    dbOpen.onsuccess = (e) => {
      let db = e.target.result;
      let transaction = db.transaction(storeName,'readwrite');
      let store = transaction.objectStore(storeName);
      let allItems = store.getAll();
      
      allItems.onsuccess = event => {
        resolve(event.target.result)
      }
      allItems.onerror = event => {
        reject(event.target.error)
      }
    }
    
    dbOpen.onerror = () => {
      reject(dbOpen.error)
    }
  })
}

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
self.addEventListener('activate',async (e) => {
  // get latest cache version
  e.waitUntil((async () => {
    // init client indexed db
    let response = await dbOpen(INDEXDB_NAME,storeName)
    if(response) indexdb = response;
    const keys = await caches.keys();
    return await keys
      .filter(key => key !== staticCacheName && key !== dynamicCacheName)
      .map(async (key) => await caches.delete(key));
  })())
});


// fetch events
self.addEventListener("fetch", async (e) => {
  // if(e.request.url === "http://localhost:5500/js/recipeList.js"){
  //   const recipe = {
  //     id:2,
  //     title:"Pizza",
  //     ingredients:["Water","Sweets"]
  //   }
  //   // let result = await addRecipe(recipe)
  //   let results = await getAll();
  //   console.log({results})
  // }

  if (e.request.url.indexOf('html' || e.request.url !== "/recipes") < 0) return; 
  
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
