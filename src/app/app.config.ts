import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

// i18n
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { environment } from '../../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // ⚠️ withHashLocation() es CRÍTICO para GitHub Pages
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    provideAnimations(),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  

    // i18n
    provideTranslateService({
      fallbackLang: 'es',
      loader: provideTranslateHttpLoader({
        // El punto './' es fundamental para que funcione en GitHub Pages
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
