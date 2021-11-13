if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      registration.addEventListener('updatefound', function() {
        // If updatefound is fired, it means that there's
        // a new service worker being installed.
        var installingWorker = registration.installing;
        console.log('A new service worker is being installed:',
          installingWorker);
  
        // You can listen for changes to the installing service worker's
        // state via installingWorker.onstatechange
      });
    })
    .catch(function(error) {
      console.log('Service worker registration failed:', error);
    });
} else {
    console.log('Service workers are not supported.');
}

Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

function serviceWorkerRegistration(callback = (reg) => {console.log(reg)}){
  if (Notification.permission == 'granted')  {
    return navigator.serviceWorker.getRegistration().then(callback)
  }
  return null
}

function displayNotification(notification = null) {
    if (Notification.permission == 'granted') {
      serviceWorkerRegistration((reg) => {
        console.log("SW registration:", reg)

        var options = {
          body: notification || 'Esse é o corpo da notificação de teste!',
          icon: 'kevi.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {action: 'close', title: 'Fechar Notificação', icon: 'kevi.png'},
          ]
        }

        reg.showNotification('Test OK!', options)
      })
    }
}

//displayNotification()

let btn = document.getElementById('display')
if (btn) btn.addEventListener('click', () => {
  let notification = document.getElementById('notification')
  if(notification) 
    displayNotification(notification.value) 
    notification.value = ""
})

