import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeDe);

/**
 * Kein provideClientHydration(): Mit Firebase/Auth + Zone bleibt die App oft länger als 10s
 * von ApplicationRef.isStable blockiert (NG0506). Client rendert nach SSR normal neu.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'de-DE' },
  ],
};
