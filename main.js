var hasPermission = ("Notification" in window) && (Notification.permission === "granted")
var btn = document.getElementById('display')
var notification = document.getElementById('notification')
var offline = document.getElementById('offline')
var installingWorker  = false
var serviceWorker = null


function init(){
  if (notification) {
     notification.addEventListener('focus', () => {
      Notification.requestPermission(function(status) {
        if (status === 'granted') {
          hasPermission = true
          if (serviceWorker === null) {
            registerServiceWorker()
            getServiceWorkerRegistration()
          }
        }
      })
    })
  }

  if (btn) {
    btn.addEventListener('click', () => {
      if(notification) {
        displayNotification("Notificação Enviada", notification.value) 
        notification.value = ""
      }
    })
  }

  registerServiceWorker()
  getServiceWorkerRegistration()

  if (!navigator.onLine) {
    offline.innerHTML = "Ops! You Are Offline!"
  }

  if (navigator.onLine && window.location.href == "/offline") {
    offline.innerHTML = ""
  }
}


async function getServiceWorkerRegistration(){
  if (hasPermission) return serviceWorker = await navigator.serviceWorker.getRegistration().then(reg => {return reg})
  serviceWorker = null
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    ///test-servicework/
    navigator.serviceWorker.register('/test-servicework/sw.js')
    .then(function(registration) {
      registration.addEventListener('updatefound', function() {
        installingWorker = registration.installing 
      });
    })
    .catch(function(error) {
      console.error('Service worker registration failed:', error);
    });
  } else {
    console.error('Service workers are not supported.');
  }
}

function displayNotification(notificationTitle = null, notificationText = null) {
  if (serviceWorker) {
    let notificationOptions = {
      body: notificationText != null ? notificationText:  'Esse é o corpo da notificação de teste!',
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
    serviceWorker.showNotification(notificationTitle  != null ? notificationTitle : 'Test OK!', notificationOptions)
  } else {
    console.error('Service workers are not supported to send notification.');
  }
}

//Run
init()
