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
  signOut,
  authState,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { User as AppUser } from '../../models/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { UserServiceService } from '../user-service/user-service.service';
import {
  confirmPasswordReset,
  deleteUser,
  EmailAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  User,
} from 'firebase/auth';
import { StateControlService } from '../state-control/state-control.service';
import { DeleteAccountComponent } from '../../shared/component/delete-account/delete-account.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteAccountComponent } from '../../shared/component/confirm-delete-account/confirm-delete-account.component';
import { deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  provider = new GoogleAuthProvider();
  router = inject(Router);
  chat = inject(ChatRoomService);
  user = inject(UserServiceService);
  userService = inject(UserServiceService);
  stateControl = inject(StateControlService);
  public currentUser = signal<AppUser | null>(null);
  public errorMessageLogin = signal('');
  dialog = inject(MatDialog);

  mainChannel: string = 'xLke9Ff8JAT8AoorWXya'; //Willkommen

  constructor(private route: ActivatedRoute) {}

  async loadAllBackendData() {
    // this.chat.channelList;
    this.userService.subUserList();
  }


  // Methode zum Erstellen eines neuen Benutzers
  async createUser(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      await this.updateUserProfile(firebaseUser, displayName);
      const user = this.createAppUser(firebaseUser);
      console.log('Registrierter User ist', user);
      await this.addUserToFirestore(user);
      // await this.chat.addNewUserToChannel(this.mainChannel, user.uId);
      return user;
    } catch (error) {
      this.handleCreateUserError(error);
    }
  }

  private async updateUserProfile(
    firebaseUser: FirebaseUser,
    displayName: string
  ): Promise<void> {
    await updateProfile(firebaseUser, { displayName: displayName });
  }

  private createAppUser(firebaseUser: FirebaseUser): AppUser {
    return {
      status: true,
      channels: [],
      uId: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
    };
  }

  private handleCreateUserError(error: any): void {
    this.stateControl.showError = true;
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set('Versuche bitte noch einmal');
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
        this.errorMessageLogin.set('Ein unbekannter Fehler ist aufgetreten.'); // Standardfehlermeldung
    }
    this.stateControl.removeShowToast();
  }

  // Methode zum Einloggen mit E-Mail und Passwort
  async loginWithEmailAndPassword(
    email: string,
    password: string,
    text: string
  ): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user as FirebaseUser;
      if (user) {
        await this.handleSuccessfulLogin(user, text);
      }
      this.errorMessageLogin.set(''); // Fehlernachricht zurücksetzen bei erfolgreicher Anmeldung
    } catch (error) {
      this.handleLoginError(error);
    }
  }

  private async handleSuccessfulLogin(
    user: FirebaseUser,
    text: string
  ): Promise<void> {
    this.stateControl.showToast = true;
    console.log(text);

    this.stateControl.showToastText.set(text);
    this.stateControl.removeShowToast();
    await this.getUserByUid(user.uid);
    await this.user.updateUserStatus(user.uid, true);
    setTimeout(() => {
      this.router.navigate(['main']);
    }, 2200);
  }

  private handleLoginError(error: any): void {
    this.stateControl.showError = true;
    this.stateControl.showToast = true;
    if (error === 'auth/wrong-password') {
      this.errorMessageLogin.set('Falsches Passwort.');
    } else {
      this.stateControl.showToastText.set('Versuche bitte noch einmal');
      this.errorMessageLogin.set('E-Mail oder Passwort falsch');
    }
    this.stateControl.removeShowToast();
  }

  // Methode zum Abrufen eines Benutzers nach UID
  async getUserByUid(uid: string): Promise<AppUser | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as AppUser;
        this.currentUser.set(userData);
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      this.handleFirestoreError(
        error,
        'Fehler beim Abrufen des Benutzers aus Firestore'
      );
      return null;
    }
  }

  // Methode zum Erstellen eines Google-Benutzers
  async createGoogleUser(): Promise<any> {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      const googleUser = result.user as FirebaseUser;
      const displayName = this.getGoogleUserDisplayName(result, googleUser);
      const user = this.createGoogleAppUser(googleUser, displayName);
      if (!(await this.userExistFirestore(user.uId))) {
        await this.addUserToFirestore(user);
        this.currentUser.set(user);
        this.router.navigate(['avatar']);
        // this.chat.addNewUserToChannel(this.mainChannel, user.uId);
      } else {
        await this.handleExistingGoogleUser(googleUser);
      }
    } catch (error) {
      this.handleGoogleSignInError(error);
    }
  }


  // Methode zum Überprüfen, ob ein Benutzer in Firestore existiert
  async userExistFirestore(uId: string): Promise<boolean> {
    return getDocs(
      query(collection(this.firestore, 'users'), where('uId', '==', uId))
    ).then((querySnapshot) => querySnapshot.size > 0);
  }

  // Hilfsfunktionen
  private handleFirestoreError(error: any, message: string): void {
    console.error(message, error);
  }

  private getGoogleUserDisplayName(
    result: any,
    googleUser: FirebaseUser
  ): string {
    const additionalUserInfo = getAdditionalUserInfo(result);
    return typeof additionalUserInfo?.profile?.['name'] === 'string'
      ? additionalUserInfo.profile['name']
      : googleUser.displayName ?? '';
  }

  private createGoogleAppUser(
    googleUser: FirebaseUser,
    displayName: string
  ): AppUser {
    return {
      avatarUrl: googleUser.photoURL ?? '',
      status: true,
      channels: [],
      uId: googleUser.uid,
      email: googleUser.email ?? '',
      displayName: displayName,
    };
  }

  private async handleExistingGoogleUser(
    googleUser: FirebaseUser
  ): Promise<void> {
    await this.getUserByUid(googleUser.uid);
    await this.user.updateUserStatus(googleUser.uid, true);
    this.router.navigate(['main']);
  }

  private handleGoogleSignInError(error: any): void {
    console.error('Fehler bei der Google-Anmeldung:', error);
  }

  private handleUserExistError(error: any): void {
    this.errorMessageLogin.set('Fehler beim Überprüfen des Benutzers.');
  }

  // Methode zum Hinzufügen eines Benutzers zu Firestore
  async addUserToFirestore(user: AppUser): Promise<AppUser> {
    const userCollectionRef = collection(this.firestore, 'users');
    const userDocRef = doc(userCollectionRef, user.uId);
    await setDoc(userDocRef, user);
    return user;
  }

  // Methode zum Ausloggen des Benutzers
  async logoutUser(userId: string): Promise<void> {
    await this.user.updateUserStatus(userId, false);
    try {
      await signOut(this.auth);
      console.log('User logged out successfully');
    } catch (error) {
      this.handleLogoutError(error);
    }
  }

  // Methode zum Senden einer E-Mail an den Benutzer
  sendEmailToUser(email: string, text: string): void {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.handleEmailSuccess(text);
      })
      .catch((error) => {
        this.handleEmailError(error);
      });
  }

  // Hilfsfunktionen
  private handleLogoutError(error: any): void {
    console.error('Error logging out:', error);
  }

  private handleEmailSuccess(text: string): void {
    this.stateControl.showArrow = true;
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);
    this.stateControl.showConfirmationText =
      'Deine E-Mail wurde erfolgreich gesendet. Prüfe deinen Posteingang.';
    this.stateControl.removeShowToast();
  }

  private handleEmailError(error: any): void {
    this.stateControl.showToast = true;
    this.stateControl.showError = true;
    switch (error.code) {
      case 'auth/invalid-email':
        this.stateControl.showToastText.set(
          'Ungültige E-Mail-Adresse. Bitte überprüfen Sie die Eingabe.'
        );
        break;
      case 'auth/user-not-found':
        this.stateControl.showToastText.set(
          'Kein Benutzer mit dieser E-Mail-Adresse gefunden.'
        );
        break;
      default:
        this.stateControl.showToastText.set(
          'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.'
        );
    }
    this.stateControl.removeShowToast();
  }

  // Methode zum Bestätigen des Passworts
  confirmPassword(password: string, text: string): void {
    const oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    if (!oobCode) {
      this.handleInvalidOobCode();
      return;
    }

    confirmPasswordReset(this.auth, oobCode, password)
      .then(() => {
        this.handlePasswordResetSuccess(text);
      })
      .catch((error) => {
        this.handlePasswordResetError(error);
      });
  }

  // Methode zum Anmelden als Gast
  async signInAsGuest(text: string): Promise<void> {
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);

    try {
      const userCredential = await signInAnonymously(this.auth);
      const firebaseUser = userCredential.user;
      const user = this.createGuestUser(firebaseUser);
      this.stateControl.removeShowToast();
      this.router.navigate(['main']);
      // await this.chat.addNewUserToChannel(this.mainChannel, user.uId);
      await this.addUserToFirestore(user);
    } catch (error) {
      this.handleAnonymousSignInError(error);
    }
  }

  // Hilfsfunktionen
  private handleInvalidOobCode(): void {
    console.error('No oobCode provided.');
    this.stateControl.showToast = true;
    this.stateControl.showError = true;
    this.stateControl.showToastText.set(
      'Es gab ein Problem mit dem Link. Bitte versuchen Sie es erneut.'
    );
  }

  private handlePasswordResetSuccess(text: string): void {
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);
    this.stateControl.showConfirmationText =
      'Deine E-Mail wurde erfolgreich gesendet. Prüfe deinen Posteingang.';
    this.stateControl.removeShowToast();
    setTimeout(() => {
      this.router.navigate(['start']);
    }, 2200);
  }

  private handlePasswordResetError(error: any): void {
    this.stateControl.showToast = true;
    this.stateControl.showError = true;
    switch (error.code) {
      case 'auth/invalid-action-code':
        this.stateControl.showToastText.set(
          'Der Link ist ungültig oder abgelaufen.'
        );
        break;
      case 'auth/weak-password':
        this.stateControl.showToastText.set(
          'Das Passwort ist zu schwach. Bitte verwenden Sie ein stärkeres Passwort.'
        );
        break;
      default:
        this.stateControl.showToastText.set(
          'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
        );
    }
    this.stateControl.removeShowToast();
  }

  private createGuestUser(firebaseUser: FirebaseUser): AppUser {
    return {
      avatarUrl: 'assets/media/icons/profile-icons/profile-icon.svg',
      status: true,
      channels: [],
      uId: firebaseUser.uid,
      email: 'guest@gast.com',
      displayName: 'Gast',
    };
  }

  private handleAnonymousSignInError(error: any): void {
    console.error('Error during anonymous sign-in:', error.code, error.message);
  }
  // Methode zum Bestätigen der Konto-Löschung
  confirmDeleteAccount(user: any): void {
    const userId = user.uid;
    const confirmDialogRef = this.dialog.open(ConfirmDeleteAccountComponent, {
      panelClass: 'confirm-delete-container',
    });

    confirmDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteUserAccount(user, userId);
      }
      this.dialog.closeAll();
    });
  }

  // Methode zum Bestätigen der Konto-Löschung mit Passwort
  async confirmDeleteAccountWithPassword(): Promise<void> {
    const user = this.auth.currentUser;

    try {
      await this.promptForCredentials();
      this.confirmDeleteAccount(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Hilfsfunktionen
  private async deleteUserAccount(user: any, userId: string): Promise<void> {
    try {
      await deleteUser(user);
      await deleteDoc(doc(this.firestore, 'users', userId));
      this.stateControl.showConfirmationText =
        'Dein Konto wurde erfolgreich gelöscht.';
      this.stateControl.isUserLoggedIn = false;
      this.router.navigate(['start/confirmation']);
    } catch (error) {
      this.handleError(error);
    }
  }
  private handleError(error: any): void {
    if (!error) {
      alert('Ein unbekannter Fehler ist aufgetreten.');
      return;
    }
    switch (error.code) {
      case 'Passwortabfrage abgebrochen.':
        alert('Die Passwortabfrage wurde abgebrochen.');
        break;
      case 'auth/wrong-password':
        alert('Das eingegebene Passwort ist falsch.');
        break;
      case 'auth/user-not-found':
        alert('Der Benutzer konnte nicht gefunden werden.');
        break;
      case 'auth/requires-recent-login':
        alert(
          'Ihre Anmeldung ist zu lange her. Bitte melden Sie sich erneut an, um fortzufahren.'
        );
        break;
      default:
        alert('Ein unerwarteter Fehler ist aufgetreten.');
    }
  }

  private async promptForCredentials(): Promise<any> {
    const dialogRef = this.dialog.open(DeleteAccountComponent, {
      panelClass: 'delete-container',
    });
    const password = await dialogRef.afterClosed().toPromise();
    if (!password) {
      throw new Error('Passwortabfrage abgebrochen.');
    }
    const user = this.auth.currentUser!;
    return EmailAuthProvider.credential(user.email!, password);
  }

}

