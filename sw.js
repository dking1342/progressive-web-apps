// install event
self.addEventListener('install', evt => {
  console.log('service worker installed');
});

// activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
});

// fetch events
self.addEventListener("fetch", e => {
  console.log("fetch event: ", e)
})