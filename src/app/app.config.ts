import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'da-bubble-de268',
        appId: '1:677473563082:web:3e599bda852f5085a15f33',
        storageBucket: 'da-bubble-de268.appspot.com',
        apiKey: 'AIzaSyDgbbZOf8RGc02Ws3A-GRTRTnljepm2Rlw',
        authDomain: 'da-bubble-de268.firebaseapp.com',
        messagingSenderId: '677473563082',
        measurementId: 'G-WJY4TV84X3',
      })
    ),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    { provide: LOCALE_ID, useValue: 'de-DE' }
  ],
}
