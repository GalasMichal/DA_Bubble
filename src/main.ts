import { mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { firebaseAppConfig } from './app/firebase-app.config';
import { AppComponent } from './app/app.component';

const browserConfig = mergeApplicationConfig(appConfig, firebaseAppConfig);

bootstrapApplication(AppComponent, browserConfig).catch((err) =>
  console.error(err)
);
