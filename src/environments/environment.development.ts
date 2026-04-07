import { AppEnvironment } from './environment.types';

/** Dev build (`ng serve`) — same shape as production; fill with your dev/staging app. */
export const environment: AppEnvironment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_FIREBASE_APP_ID',
  },
  mainChannelId: 'YOUR_DEFAULT_CHANNEL_DOC_ID',
};
