import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
  .then(() => registerServiceWorker());

let registration = undefined;

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/ngsw-worker.js')
      .then(reg => {
        registration = reg;
        swLog('Se ha registrado correctamente', registration);
        registration.onupdatefound = () => checkServiceWorkerStateChange();
      })
      .catch(e =>
        console.error('Error durante el registro:', e)
      );
  } else {
    console.warn('SW no es soportado');
  }
}

function checkServiceWorkerStateChange() {
  const installingWorker = registration.installing;

  installingWorker.onstatechange = () => {
    switch (installingWorker.state) {
      case 'installed':
        if (navigator.serviceWorker.controller) {
          swLog('Contenido nuevo disponible', installingWorker);
        } else {
          swLog('Contenido disponible offline', installingWorker);
        }
        break;
      case 'redundant':
        console.error(
          'Redundante',
          installingWorker
        );
        break;
      default:
        swLog(installingWorker.state);
        break;
    }
  };
}

function swLog(eventName, event?) {
  console.log('Service Worker - ' + eventName);
  if (event) {
    console.log(event);
  }
}