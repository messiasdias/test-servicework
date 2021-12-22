const cacheName = "v1-dev"
const cacheFiles = [
  '/test-servicework/',
  'kevi.png',
  'main.js',
  'sw.js'
]

const maxExecusions = 100000;
const loopTimeout = 50000

async function loop(v){
  let now = new Date()

  let request = {
    method: "GET",
    url: "https://servicodados.ibge.gov.br/api/v1/localidades/distritos"
    //bodyUsed: false,
    // cache: "default",
    // credentials: "include",
    // destination: "script",
    // headers: {},
    // integrity: "",
    // isHistoryNavigation: false,
    // keepalive: false,
    // mode: "no-cors",
    // redirect: "follow",
    // referrer: "https://messiasdias.github.io/test-servicework/",
    // referrerPolicy: "strict-origin-when-cross-origin",
    // signal: {
    //   aborted: false,
    //   onabort: null
    // },
  }

  let response = fetch(request)
  console.log(response)
  
  console.log(`Loop version ${v} | ${now}`)
  if (parseInt(v + 1) < maxExecusions) setTimeout(() => self.loop(v+1), loopTimeout);
}

async function  updateCache(request, response){
  let res =  await response.then(res => res)
  if (cacheFiles.map(path => request.url.endsWith(path)).some(p => p)) {
    caches.open(cacheName).then(async (cache) => {cache.put(request.url, response)})
  }
  return res
}

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  console.log('Closed notification: ' + primaryKey);
})

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => {
    return cache.addAll(cacheFiles).then(() => self.skipWaiting())
  }))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cache => {if (cache !== cacheName) return caches.delete(cache)}))
  }))

  self.loop(1)
})

self.addEventListener('fetch', event => {
  console.log(event.request)
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      if (response) {return response}
      self.updateCache(event.request, fetch(event.request))
      return response
    }).catch(error => {
      console.log("Response error: ", error)
      return error
    })
  )
})