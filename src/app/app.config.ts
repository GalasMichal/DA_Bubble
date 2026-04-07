import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'de-DE' },
    provideClientHydration(),
  ],
};
