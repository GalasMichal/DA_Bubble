import { FirebaseOptions } from 'firebase/app';

export interface AppEnvironment {
  production: boolean;
  firebase: FirebaseOptions;
  /** Default channel document id (e.g. Willkommen) */
  mainChannelId: string;
}
