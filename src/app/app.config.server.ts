import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { firebaseAppConfig } from './firebase-app.config';

const serverOnlyConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

/** SSR: same Firebase providers as browser (Auth, Firestore, Storage). */
export const config = mergeApplicationConfig(
  mergeApplicationConfig(mergeApplicationConfig(appConfig, firebaseAppConfig), serverOnlyConfig)
);
