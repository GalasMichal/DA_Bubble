import { ApplicationConfig } from '@angular/core';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

/**
 * Firebase client (App, Auth, Firestore, Storage) — used on browser and server for SSR DI.
 */
export const firebaseAppConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
