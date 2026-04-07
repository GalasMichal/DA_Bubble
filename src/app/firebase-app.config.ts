import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment.firebase';

const apiKey = environment.firebase.apiKey ?? '';
if (
  isDevMode() &&
  (apiKey.startsWith('YOUR_') || apiKey === '')
) {
  console.warn(
    '[da-bubble] Firebase apiKey looks like a placeholder — Google login will fail.\n' +
      'Run `npm run env:local` before `ng serve`, or use `npm start` (runs it via prestart). After `npm run build`, run `env:local` again or rely on postbuild.\n' +
      'Real keys: src/environments/environment.local.ts (gitignored).'
  );
}

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
