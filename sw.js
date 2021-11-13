var cacheFiles = [
  '/kevi.png',
  '/main.js',
]

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  console.log('Closed notification: ' + primaryKey);
})

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open().then(function(cache) {
      console.log('cache:', cache)
      return cache.addAll(cacheFiles)
      // .then(function() {
      //   console.log('Cache Files add completed');
      // })
    })
  )
})