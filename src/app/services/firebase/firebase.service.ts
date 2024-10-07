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
  getDoc,
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

  public userList: AppUser[] = [];
  public channelList: Channel[] = [];

  currentUser: AppUser | null = null;
  public errorMessageLogin = signal('');

  unsubUserList: any;
  unsubChannelList: any;
 
  subChannelList() {
    return onSnapshot(this.getChannels(), (list) => {
      this.channelList = [];
      list.forEach((element) => {
        const channelData = element.data();
        const channelId = element.id;
        const channelObject = this.setChannelObject(channelData, channelId);
        this.channelList.push(channelObject); // Kanał do listy
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
        this.userList.push(userObject); // Użytkownik do listy
      });
    });
  }
  
  ngOnDestroy(): void {
    if (this.unsubUserList) {
      this.unsubUserList(); 
    }
  
    if (this.unsubChannelList) {
      this.unsubChannelList();
    }
  }

  
  setUserObject(obj: any, id: string): AppUser {
    return {
      status: obj.status || false,
      channels: obj.channels || [],
      uId: id || '',
      email: obj.email || '',
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
            status: true,
            channels: [],
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

  async loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    try {
      const exists = await this.userExists(email); // Überprüfen, ob der Benutzer existiert

      if (!exists) {
        this.errorMessageLogin.set(
          'Kein Benutzer mit dieser E-Mail-Adresse gefunden.'
        );
      }
      // Wenn der Benutzer existiert, führe die Anmeldung durch
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = await userCredential.user as FirebaseUser;
      console.log('user is', user)
      if (user) {
       await this.getUserByUid(user.uid)
        this.router.navigate(['/start/main']);
      }
   

      console.log('User is logged in:', user);
      this.errorMessageLogin.set(''); // Fehlernachricht zurücksetzen bei erfolgreicher Anmeldung

    } catch (error) {
      if (error=== 'auth/wrong-password') {
        this.errorMessageLogin.set('Falsches Passwort.');
      } else {
        this.errorMessageLogin.set(
          'Fehler beim Anmelden: ' + error
        );
      }

      // Falls es einen allgemeinen Fehler gibt (bei der Benutzerabfrage oder Anmeldung)
      console.error('Fehler beim Login:', error);
    }
  }
  async getUserByUid(uid: string): Promise<AppUser | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`); // Referenz zum Dokument
      const userDocSnapshot = await getDoc(userDocRef); // Abrufen des Dokuments

      if (userDocSnapshot.exists()) {
         this.currentUser = userDocSnapshot.data() as AppUser; // Cast zu deinem AppUser-Interface
        return this.currentUser; // Benutzer-Daten zurückgeben
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
      await this.addUserToFirestore(user);
      this.currentUser = user;
      console.log('User ist eingeloggt', this.currentUser);
      this.router.navigate(['/start/avatar']);

    } catch (error) {

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
