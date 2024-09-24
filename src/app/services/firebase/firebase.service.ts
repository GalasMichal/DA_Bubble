import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
  fetchSignInMethodsForEmail,

} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { User as AppUser } from '../../models/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  provider = new GoogleAuthProvider();
  channels$;

  currentUser: AppUser | null = null;
  public userSignal = signal<AppUser | null>(null);
  public errorMessageLogin = signal('')

  constructor() {
    this.channels$ = collectionData(this.getChannels());
  }

  // Methode zum Erstellen eines neuen Benutzers
  createUser(email: string, password: string, displayName: string): Promise<any> {

        return createUserWithEmailAndPassword(this.auth, email, password)
          .then((userCredential) => {
            const firebaseUser = userCredential.user;
            // Setze den displayName nach der erfolgreichen Registrierung
            return updateProfile(firebaseUser, {
              displayName: displayName,
            }).then(() => {
              const user: AppUser = {
                uId: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
              };
              console.log('Registrierter User ist', user);
              // Hier kannst du den Benutzer zu Firestore hinzufügen, wenn nötig
              this.addUserToFirestore(user);
            });
          })
          .catch((error) => {
            switch (error.code) {
              case 'auth/email-already-in-use':
                this.errorMessageLogin.set('Diese E-Mail-Adresse wird bereits verwendet.');
                break;
              case 'auth/invalid-email':
                this.errorMessageLogin.set('Die E-Mail-Adresse ist ungültig.');
                break;
              case 'auth/operation-not-allowed':
                this.errorMessageLogin.set('Die Anmeldung mit E-Mail und Passwort ist nicht erlaubt.');
                break;
              case 'auth/weak-password':
                this.errorMessageLogin.set('Das Passwort ist zu schwach. Bitte wähle ein stärkeres Passwort.');
                break;
              default:
                this.errorMessageLogin.set('Ein unbekannter Fehler ist aufgetreten.'); // Standardfehlermeldung
            }
          });


  }

  loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.userExists(email).then(exists => {
      if (!exists) {
        this.errorMessageLogin.set('Kein Benutzer mit dieser E-Mail-Adresse gefunden.');
        return; // Beende die Methode, wenn der Benutzer nicht existiert
      }

      // Wenn der Benutzer existiert, führe die Anmeldung durch
      return signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user as FirebaseUser;
          this.currentUser = {
            uId: user.uid,
            email: user.email || '',
            displayName: user.displayName || ''
          };
          console.log('User is logged in:', user);
          this.errorMessageLogin.set(''); // Fehlernachricht zurücksetzen bei erfolgreicher Anmeldung
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/wrong-password':
              this.errorMessageLogin.set('Falsches Passwort.');
              break;
            default:
              this.errorMessageLogin.set('Fehler beim Anmelden: ' + error.message);
          }
        });
    }).catch((error) => {
      // Fehler bei der Benutzerabfrage
      console.error('Fehler beim Überprüfen des Benutzers:', error);
    });
  }

  createGoogleUser(): Promise<any> {
    return signInWithPopup(this.auth, this.provider)
      .then((result) => {
        // Zugriff auf Google Access Token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // Der angemeldete Benutzer
        const googleUser = result.user as FirebaseUser;
        const additionalUserInfo = getAdditionalUserInfo(result);
        console.log('Google Access Token:', token);
        console.log('Google-Benutzer:', googleUser);
        console.log('Zusätzliche Benutzerinformationen:', additionalUserInfo);

        // Fallback für den displayName, falls er nicht verfügbar ist
        // Sicherstellen, dass displayName ein string ist
        const displayName =
          typeof additionalUserInfo?.profile?.['name'] === 'string'
            ? additionalUserInfo.profile['name']
            : googleUser.displayName ?? '';
        // Benutzerobjekt erstellen
        const user: AppUser = {
          uId: googleUser.uid,
          email: googleUser.email ?? '',
          displayName: displayName,
        };
        this.addUserToFirestore(user);
        this.currentUser = user;
        console.log('user ist eingeloggt', this.currentUser);
      })
      .catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email; // Optionales Chaining für den Fall, dass customData null ist
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error('Fehlercode:', errorCode);
        console.error('Fehlermeldung:', errorMessage);
        console.error('Verwendete E-Mail:', email);
        console.error('AuthCredential-Typ:', credential);

        // Fehler erneut werfen, damit der Aufrufer sie behandeln kann
        throw error;
      });
  }

  userExists(email: string): Promise<boolean> {
    return fetchSignInMethodsForEmail(this.auth, email)
      .then((methods) => {
        return methods.length > 0; // Gibt true zurück, wenn der Benutzer existiert, andernfalls false
      })
      .catch((error) => {
        console.error('Fehler beim Überprüfen des Benutzers:', error);
        this.errorMessageLogin.set('Fehler beim Überprüfen des Benutzers.'); // Setze eine generische Fehlermeldung
        return false
      });
  }

  // userExist(email: string): Promise<boolean> {
  //   const userCollectionRef = collection(this.firestore, 'users');
  //   const q = query(userCollectionRef, where('email', '==', email));
  //   return getDocs(q).then((querySnapshot) => {
  //     return !querySnapshot.empty; // Gibt true zurück, wenn der Benutzer existiert, andernfalls false
  //   }).catch((error) => {
  //     console.error('Fehler beim Überprüfen des Benutzers:', error);
  //     throw error;
  //   });
  // }

  addUserToFirestore(user: AppUser) {
    const userCollectionRef = collection(this.firestore, 'users'); // Referenz zur 'users'-Collection
    const userDocRef = doc(userCollectionRef, user.uId);
    // Speichern des Benutzers in Firestore und Rückgabe des Benutzers
    setDoc(userDocRef, user).then(() => {
      this.userSignal.set(user); // Angular Signal setzen
      return user; // Benutzer zurückgeben
    });
  }

  addChannelToFirestore(channel: any) {
    const channelCollectionRef = collection(this.firestore, 'channels');
    const channelDocRef = doc(channelCollectionRef);
    setDoc(channelDocRef, channel);
  }

  getChannels() {
    return collection(this.firestore, 'channels');
  }
}
