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
} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { User as AppUser } from '../../models/interfaces/user.model';
import { Channel } from '../../models/interfaces/channel.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  provider = new GoogleAuthProvider();
  router = inject(Router);
  channels$;

  public userList: AppUser[] = [];
  public channelList: Channel[] = [];


  unsubUserList: any;
  unsubChannelList: any;

  currentUser: AppUser | null = null;
  public errorMessageLogin = signal('');

  constructor() {
    this.unsubChannelList = this.subChannelList();
    this.unsubUserList = this.subUserList();
    this.channels$ = collectionData(this.getChannels());
  }

  ngOnDestroy(): void {
    this.unsubUserList();
    this.unsubChannelList();
  }

  subChannelList() {
    return onSnapshot(this.getChannels(), (list) => {
      this.channelList = [];
      list.forEach((element) => {
        const channelData = element.data();
        const channelId = element.id;
        const channelObject = this.setChannelObject(channelData, channelId);
        this.channelList.push(channelObject); // Benutzer zur Liste hinzufügen
      });
    });
  }


  subUserList() {
    return onSnapshot(this.getUsers(), (list) => {
      this.userList = [];
      list.forEach((element) => {
        const userData = element.data();
        const userId = element.id;
        const userObject = this.setUserObject(userData, userId);
        this.userList.push(userObject); // Benutzer zur Liste hinzufügen
      });
    });
  }


  setUserObject(obj: any, id: string): AppUser {
    return {
      uId: id || '',
      email: obj.email || '',
      status: obj.status || false,
      displayName: obj.displayName || '',
      avatarUrl: obj.avatarUrl || '',
      birthdate: obj.birthdate || '',
    };
  }

  setChannelObject(obj: any, id: string): Channel {
    return {
      chanId: id || '',
      channelName: obj.channelName || '',
      channelDescription: obj.channelDescription || '',
      allMembers: obj.allMembers || '',
      specificPeople: obj.specificPeople || [],
      createdAt: obj.createdAt || '',
      createdBy: obj.createdBy || ''
    };
  }

  // Methode zum Erstellen eines neuen Benutzers
  createUser(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
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
          this.addUserToFirestore(user);
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

  loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.userExists(email)
      .then((exists) => {
        if (!exists) {
          this.errorMessageLogin.set(
            'Kein Benutzer mit dieser E-Mail-Adresse gefunden.'
          );
          return; // Beende die Methode, wenn der Benutzer nicht existiert
        }
        // Wenn der Benutzer existiert, führe die Anmeldung durch
        return signInWithEmailAndPassword(this.auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user as FirebaseUser;
            this.currentUser = {
              uId: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
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
                this.errorMessageLogin.set(
                  'Fehler beim Anmelden: ' + error.message
                );
            }
          });
      })
      .catch((error) => {
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
        this.router.navigate(['avatar']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error('Fehlercode:', errorCode);
        console.error('Fehlermeldung:', errorMessage);
        console.error('Verwendete E-Mail:', email);
        console.error('AuthCredential-Typ:', credential);

        throw error;
      });
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

  addUserToFirestore(user: AppUser) {
    const userCollectionRef = collection(this.firestore, 'users');
    const userDocRef = doc(userCollectionRef, user.uId);
    setDoc(userDocRef, user).then(() => {
      return user;
    });
  }

  addChannelToFirestore(channel: Channel) {
    const channelCollectionRef = collection(this.firestore, 'channels');
    const channelDocRef = doc(channelCollectionRef);
    channel.chanId = channelDocRef.id;
    setDoc(channelDocRef, channel);
  }

  getChannels() {
    return collection(this.firestore, 'channels');
  }

  getUsers() {
    return collection(this.firestore, 'users');
  }
}
