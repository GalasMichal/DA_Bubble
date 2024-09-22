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
  user,
} from '@angular/fire/auth';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { User } from '../../models/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  provider = new GoogleAuthProvider();

  //Signal für user
  public userSignal = signal<User | null>(null);

  constructor() {}

  // Methode zum Erstellen eines neuen Benutzers
  createUser(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log('user is', userCredential)
        const firebaseUser = userCredential.user;
        // Setze den displayName nach der erfolgreichen Registrierung
        return updateProfile(firebaseUser, {
          displayName: displayName,
        }).then(() => {
          // Benutzerprofil aktualisiert
          const user: User = {
            uId: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '', // Nun wird der displayName korrekt gesetzt
          };
          console.log('Registrierter User ist', user);
          this.addUserToFirestore(user);
        });
      })
      .catch((error) => {
        // Fehlerbehandlung
        console.error('Error creating user:', error);
        throw error;
      });
  }

  createGoogleUser(): Promise<any> {
   return signInWithPopup(this.auth, this.provider)
      .then((result) => {
        // Zugriff auf Google Access Token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // Der angemeldete Benutzer
        const googleUser = result.user;
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
        const user: User = {
          uId: googleUser.uid,
          email: googleUser.email ?? '',
          displayName: displayName,
        };
        this.addUserToFirestore(user);
  })
      .catch((error) => {
        // Fehlerbehandlung
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

  addUserToFirestore(user: User) {
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
    setDoc(channelDocRef, channel)
  }
}
