import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signOut,
} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
  onSnapshot,
  getDoc,
  Unsubscribe,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { User as AppUser } from '../../models/interfaces/user.model';
import { Channel } from '../../models/interfaces/channel.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { UserServiceService } from '../user-service/user-service.service';
import {
  confirmPasswordReset,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { StateControlService } from '../state-control/state-control.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  provider = new GoogleAuthProvider();
  router = inject(Router);
  chat = inject(ChatRoomService);
  userService = inject(UserServiceService);
  stateControl = inject(StateControlService);

  public currentUser = signal<AppUser | null>(null);
  public errorMessageLogin = signal('');

  constructor(private route: ActivatedRoute) {}

  async loadAllBackendData() {
    this.chat.subChannelList();
    this.userService.subUserList();
  }

  // Methode zum Erstellen eines neuen Benutzers
  async createUser(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;
        return updateProfile(firebaseUser, {
          displayName: displayName,
        }).then(() => {
          const user: AppUser = {
            status: true,
            channels: [],
            uId: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
          };
          console.log('Registrierter User ist', user);
          this.addUserToFirestore(user);
          return user;
        });
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.errorMessageLogin.set(
              'Diese E-Mail-Adresse wird bereits verwendet.'
            );
            break;
          case 'auth/invalid-email':
            this.errorMessageLogin.set('Die E-Mail-Adresse ist ungültig.');
            break;
          case 'auth/operation-not-allowed':
            this.errorMessageLogin.set(
              'Die Anmeldung mit E-Mail und Passwort ist nicht erlaubt.'
            );
            break;
          case 'auth/weak-password':
            this.errorMessageLogin.set(
              'Das Passwort ist zu schwach. Bitte wähle ein stärkeres Passwort.'
            );
            break;
          default:
            this.errorMessageLogin.set(
              'Ein unbekannter Fehler ist aufgetreten.'
            ); // Standardfehlermeldung
        }
      });
  }

  async loginWithEmailAndPassword(email: string, password: string, text: string
  ): Promise<any> {
    try {
      const exists = await this.userExists(email); // Überprüfen, ob der Benutzer existiert
      if (exists) {
        this.errorMessageLogin.set(
          'Kein Benutzer mit dieser E-Mail-Adresse gefunden.'
        );
      }
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      let user = userCredential.user as FirebaseUser;
      console.log('user is', user);
      if (user) {
        this.stateControl.showToast = true;
        this.stateControl.showToastText = text;
        this.stateControl.removeShowToast();
        await this.getUserByUid(user.uid);
        setTimeout(() => {
          this.router.navigate(['/start/main']);
          }, 2200);
      }

      console.log('User is logged in:', user);
      this.errorMessageLogin.set(''); // Fehlernachricht zurücksetzen bei erfolgreicher Anmeldung
    } catch (error) {
        this.stateControl.showError = true;
        this.stateControl.showToast = true;
      if (error === 'auth/wrong-password') {
        this.errorMessageLogin.set('Falsches Passwort.');
      } else {
        this.stateControl.showToastText = 'Versuche bitte noch einmal';
        this.errorMessageLogin.set('E-Mail oder Passwort falsch');
      }
      this.stateControl.removeShowToast();
      // Falls es einen allgemeinen Fehler gibt (bei der Benutzerabfrage oder Anmeldung)
      console.error('Fehler beim Login:', error);
    }
  }
  async getUserByUid(uid: string): Promise<AppUser | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`); // Referenz zum Dokument
      const userDocSnapshot = await getDoc(userDocRef); // Abrufen des Dokuments

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as AppUser; // Cast zu deinem AppUser-Interface
        this.currentUser.set(userData);
        return userData; // Benutzer-Daten zurückgeben
      } else {
        console.log('Kein Benutzer mit dieser UID gefunden.');
        return null; // Falls kein Benutzer gefunden wird
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzers aus Firestore:', error);
      return null; // Bei Fehler null zurückgeben
    }
  }
  async createGoogleUser(): Promise<any> {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
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
      const displayName =
        typeof additionalUserInfo?.profile?.['name'] === 'string'
          ? additionalUserInfo.profile['name']
          : googleUser.displayName ?? '';

      // Benutzerobjekt erstellen
      const user: AppUser = {
        avatarUrl: googleUser.photoURL ?? '',
        status: true,
        channels: [],
        uId: googleUser.uid,
        email: googleUser.email ?? '',
        displayName: displayName,
      };
      if (!(await this.userExistFirestore(user.uId))) {
        // Benutzer existiert nicht, also Avatar-Seite anzeigen
        await this.addUserToFirestore(user);
        this.currentUser.set(user);
        this.router.navigate(['/start/avatar']);
      } else {
        // Benutzer existiert, also zum Main-Content
        await this.getUserByUid(googleUser.uid);
        this.router.navigate(['/start/main']);
      }

      console.log('User ist eingeloggt', this.currentUser());
    } catch (error) {
      console.error('Fehler bei der Google-Anmeldung:', error);
    }
  }

  userExists(email: string): Promise<boolean> {
    return fetchSignInMethodsForEmail(this.auth, email)
      .then((methods) => {
        return methods.length > 0;
      })
      .catch((error) => {
        console.error('Fehler beim Überprüfen des Benutzers:', error);
        this.errorMessageLogin.set('Fehler beim Überprüfen des Benutzers.');
        return false;
      });
  }

  async userExistFirestore(uId: string): Promise<boolean> {
    return getDocs(
      query(collection(this.firestore, 'users'), where('uId', '==', uId))
    ).then((querySnapshot) => {
      return querySnapshot.size > 0;
    });
  }

  async addUserToFirestore(user: AppUser) {
    const userCollectionRef = collection(this.firestore, 'users');
    const userDocRef = doc(userCollectionRef, user.uId);
    setDoc(userDocRef, user).then(() => {
      return user;
    });
  }

  logoutUser() {
    // Methode zum Ausloggen des Benutzers
    signOut(this.auth)
      .then(() => {
        console.log('User logged out successfully');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  sendEmailToUser(email: string, text: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.stateControl.showArrow = true;
        this.stateControl.showToast = true;
        this.stateControl.showToastText = text;
        this.stateControl.removeShowToast();
      })
      .catch((error) => {
        this.stateControl.showToast = true;
        this.stateControl.showError = true;
        switch (error.code) {
          case 'auth/invalid-email':
            this.stateControl.showToastText =
              'Ungültige E-Mail-Adresse. Bitte überprüfen Sie die Eingabe.';
            break;
          case 'auth/user-not-found':
            this.stateControl.showToastText =
              'Kein Benutzer mit dieser E-Mail-Adresse gefunden.';
            break;
          default:
            this.stateControl.showToastText =
              'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.';
        }
        this.stateControl.removeShowToast();
      });
  }

  confirmPassword(password: string, text:string) {
    // Hole den oobCode aus der URL
    const oobCode = this.route.snapshot.queryParamMap.get('oobCode');

    if (!oobCode) {
      console.error('No oobCode provided.');
      this.stateControl.showToast = true;
      this.stateControl.showError = true;
      this.stateControl.showToastText =
        'Es gab ein Problem mit dem Link. Bitte versuchen Sie es erneut.';
      return;
    }

    confirmPasswordReset(this.auth, oobCode, password)
      .then(() => {
        this.stateControl.showToast = true;
        this.stateControl.showToastText = text;
        this.stateControl.removeShowToast();
        setTimeout(() => {
          this.router.navigate(['start']);
          }, 2200);
      })
      .catch((error) => {
        this.stateControl.showToast = true;
        this.stateControl.showError = true;
        switch (error.code) {
          case 'auth/invalid-action-code':
            this.stateControl.showToastText =
              'Der Link ist ungültig oder abgelaufen.';
            break;
          case 'auth/weak-password':
            this.stateControl.showToastText =
              'Das Passwort ist zu schwach. Bitte verwenden Sie ein stärkeres Passwort.';
            break;
          default:
            this.stateControl.showToastText =
              'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
        }
        this.stateControl.removeShowToast();
      });
  }
}
