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
  signOut,
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
import { UserServiceService } from '../user-service/user-service.service';
import {
  confirmPasswordReset,
  deleteUser,
  EmailAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
} from 'firebase/auth';
import { StateControlService } from '../state-control/state-control.service';
import { DeleteAccountComponent } from '../../shared/component/delete-account/delete-account.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteAccountComponent } from '../../shared/component/confirm-delete-account/confirm-delete-account.component';
import { arrayUnion, deleteDoc, updateDoc } from 'firebase/firestore';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  /**
   * inject firestore auth, router, user, stateControl, dialog
   *
   */
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  router = inject(Router);
  user = inject(UserServiceService);
  stateControl = inject(StateControlService);
  dialog = inject(MatDialog);
  provider = new GoogleAuthProvider();

  /**
   * define currentUser, errorMessageLogin
   */
  public currentUser = signal<AppUser | null>(null);
  public errorMessageLogin = signal('');

  /**
   * default mainChannel start path
   */
  mainChannel: string = '55dO4OXETme2oZEiCPZH'; //Willkommen

  constructor(private route: ActivatedRoute) {}

  /**
   * load user data
   */
  async loadAllBackendData() {
    this.user.subUserList();
  }

  /**
   * create user with email, password, displayName
   * @param email
   * @param password
   * @param displayName
   * @returns
   * get user credential from createUserWithEmailAndPassword
   * set user credential to firebaseUser
   * update user profile with firebaseUser, displayName
   * add user to firestore
   */
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
      await this.addUserToFirestore(user);
      return user;
    } catch (error) {
      this.handleCreateUserError(error);
    }
  }

  /**
   * update user profile with firebaseUser, displayName
   * @param firebaseUser
   * @param displayName
   */
  private async updateUserProfile(
    firebaseUser: FirebaseUser,
    displayName: string
  ): Promise<void> {
    await updateProfile(firebaseUser, { displayName: displayName });
  }

  /**
   * create app user with firebaseUser data
   * @param firebaseUser
   * @returns object with user data
   */
  private createAppUser(firebaseUser: FirebaseUser): AppUser {
    return {
      status: true,
      channels: [],
      uId: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
    };
  }

  /**
   * handle create user error
   * @param error
   */
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
        this.errorMessageLogin.set('Ein unbekannter Fehler ist aufgetreten.');
    }
    this.stateControl.removeShowToast();
  }

  /**
   * login with email, password
   * using text for success message
   * @param email
   * @param password
   * @param text
   */
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
      this.errorMessageLogin.set('');
    } catch (error) {
      this.handleLoginError(error);
    }
    this.stateControl.removeShowToast();

  }

  /**
   * handle successful login
   * set showToast to true and show toast text
   * get user by uid from firestore and update user status
   * after 2200ms navigate to main page
   * @param user
   * @param text
   */
  private async handleSuccessfulLogin(
    user: FirebaseUser,
    text: string
  ): Promise<void> {
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);
    this.stateControl.removeShowToast();
    await this.getUserByUid(user.uid);
    await this.user.updateUserStatus(user.uid, true);
    setTimeout(() => {
      this.router.navigate(['main']);
    }, 2200);
  }

  /**
   * handle login error and set toast text and error message
   * @param error
   */
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

  /**
   * get user by uid from firestore
   * set refence to user document
   * get user document snapshot
   * set user data to currentUser signal
   * @param uid string user id
   * @returns user data or null
   */
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

  /**
   * create google user with google sign in
   * get google user data
   * check if user exist in firestore
   * add user data to firestore and set user to currentUser signal
   * navigate to avatar page
   */
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
      } else {
        await this.handleExistingGoogleUser(googleUser);
      }
    } catch (error) {
      this.handleGoogleSignInError(error);
    }
  }

  /**
   * check if user exist in firestore
   * @param uId user id
   * @returns
   */
  async userExistFirestore(uId: string): Promise<boolean> {
    return getDocs(
      query(collection(this.firestore, 'users'), where('uId', '==', uId))
    ).then((querySnapshot) => querySnapshot.size > 0);
  }

  /**
   *  handle firestore error
   * @param error the error
   * @param message the message from the error
   */
  private handleFirestoreError(error: any, message: string): void {
    console.error(message, error);
  }

  /**
   * get google user display name
   * @param result
   * @param googleUser
   * @returns
   */
  private getGoogleUserDisplayName(
    result: any,
    googleUser: FirebaseUser
  ): string {
    const additionalUserInfo = getAdditionalUserInfo(result);
    return typeof additionalUserInfo?.profile?.['name'] === 'string'
      ? additionalUserInfo.profile['name']
      : googleUser.displayName ?? '';
  }

  /**
   * set google user data to app user and return app user object
   * @param googleUser data from google user
   * @param displayName display name from google user
   * @returns
   */
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

  /**
   * handle existing google user and update user status
   * navigate to main page
   * @param googleUser
   */
  private async handleExistingGoogleUser(
    googleUser: FirebaseUser
  ): Promise<void> {
    await this.getUserByUid(googleUser.uid);
    await this.user.updateUserStatus(googleUser.uid, true);
    this.router.navigate(['main']);
  }

  /**
   * handle google sign in error
   * @param error
   */
  private handleGoogleSignInError(error: any): void {
    console.error('Fehler bei der Google-Anmeldung:', error);
  }
  /**
   * handle user exist error
   * @param error
   */
  private handleUserExistError(error: any): void {
    this.errorMessageLogin.set('Fehler beim Überprüfen des Benutzers.');
  }

  /**
   * add user to firestore
   * set reference to user collection
   * @param user as interface User
   * @returns user object
   */
  async addUserToFirestore(user: AppUser): Promise<AppUser> {
    const userCollectionRef = collection(this.firestore, 'users');
    const userDocRef = doc(userCollectionRef, user.uId);
    await setDoc(userDocRef, user);
    this.addNewUserToMainChannel(this.mainChannel, user.uId )
    return user;
  }

  /**
   * logout user by user id
   * update user online status to false
   * @param userId
   */
  async logoutUser(userId: string): Promise<void> {
    await this.user.updateUserStatus(userId, false);
    try {
      await signOut(this.auth);
    } catch (error) {
      this.handleLogoutError(error);
    }
    this.stateControl.responsiveArrow = false;
  }

  /**
   * send email to user with password reset link
   * @param email user email
   * @param text
   */
  sendEmailToUser(email: string, text: string): void {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.handleEmailSuccess(text);
      })
      .catch((error) => {
        this.handleEmailError(error);
      });
  }

  /**
   * handle logout error
   * @param error
   */
  private handleLogoutError(error: any): void {
    console.error('Error logging out:', error);
  }

  /**
   * handle email success information
   * @param text
   */
  private handleEmailSuccess(text: string): void {
    this.stateControl.showArrow = true;
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);
    this.stateControl.showConfirmationText.set(
      'Deine E-Mail wurde erfolgreich gesendet. Prüfe deinen Posteingang.'
    );
    this.stateControl.removeShowToast();
  }

  /**
   * handle email error information
   * @param error
   */
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

  /**
   * confirm password reset
   * @param password
   * @param text
   * @returns
   */
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

  /**
   * sign in as guest
   * set toast text
   * sing in anonymously
   * create guest user in firestore
   * @param text
   */
  async signInAsGuest(text: string): Promise<void> {
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);
    try {
      const userCredential = await signInAnonymously(this.auth);
      const firebaseUser = userCredential.user;
      const user = this.createGuestUser(firebaseUser);
      this.stateControl.removeShowToast();
      this.router.navigate(['main']);
      await this.addUserToFirestore(user);
    } catch (error) {
      this.handleAnonymousSignInError(error);
    }
  }

  /**
   * handle invalid oob code
   */
  private handleInvalidOobCode(): void {
    console.error('No oobCode provided.');
    this.stateControl.showToast = true;
    this.stateControl.showError = true;
    this.stateControl.showToastText.set(
      'Es gab ein Problem mit dem Link. Bitte versuchen Sie es erneut.'
    );
  }

  /**
   * handle password reset success
   * @param text
   */
  private handlePasswordResetSuccess(text: string): void {
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);
    this.stateControl.showConfirmationText.set(
      'Deine E-Mail wurde erfolgreich gesendet. Prüfe deinen Posteingang.'
    );
    this.stateControl.removeShowToast();
    setTimeout(() => {
      this.router.navigate(['confirmation']);
    }, 2200);
  }

  /**
   * handle password reset error
   * @param error
   */
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

  /**
   * create guest user object
   * @param firebaseUser
   * @returns
   */
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

  /**
   * handle anonymous sign in error
   * @param error
   */
  private handleAnonymousSignInError(error: any): void {
    console.error('Error during anonymous sign-in:', error.code, error.message);
  }

  /**
   * confirm delete account and delete user account
   * @param user
   */
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

  /**
   * confirm delete account with password and delete user account
   */
  async confirmDeleteAccountWithPassword(): Promise<void> {
    const user = this.auth.currentUser;

    try {
      await this.promptForCredentials();
      this.confirmDeleteAccount(user);
    } catch (error) {
      this.handleError(error);
    }
  }
  /**
   * delete user account with user and userId
   * delete user and user document from firestore
   * set confirmation text
   * navigate to confirmation page
   * @param user
   * @param userId
   */
  private async deleteUserAccount(user: any, userId: string): Promise<void> {
    try {
      await deleteUser(user);
      await deleteDoc(doc(this.firestore, 'users', userId));
      this.stateControl.showConfirmationText.set(
        'Dein Konto wurde erfolgreich gelöscht.'
      );
      this.stateControl.isUserLoggedIn = false;
      this.router.navigate(['confirmation']);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * error handling
   * @param error
   * @returns
   */
  private handleError(error: any): void {
    this.stateControl.showError = true;
    this.stateControl.showToast = true;
    if (!error) {
      this.stateControl.showConfirmationText.set('Ein unbekannter Fehler ist aufgetreten.');
      return;
    }
    switch (error.code) {
      case 'Passwortabfrage abgebrochen.':
        this.stateControl.showConfirmationText.set('Die Passwortabfrage wurde abgebrochen.');
        break;
      case 'auth/wrong-password':
        this.stateControl.showConfirmationText.set('Das eingegebene Passwort ist falsch.');
        break;
      case 'auth/user-not-found':
        this.stateControl.showConfirmationText.set('Der Benutzer konnte nicht gefunden werden.');
        break;
      case 'auth/requires-recent-login':
        this.stateControl.showConfirmationText.set(
          'Ihre Anmeldung ist zu lange her. Bitte melden Sie sich erneut an, um fortzufahren.'
        );
        break;
      default:
        this.stateControl.showConfirmationText.set('Ein unerwarteter Fehler ist aufgetreten.');
    }
    this.stateControl.removeShowToast();
  }

  /**
   * prompt for credentials
   * open delete account component and get password
   * return emailAuthProvider credential
   * @returns
   */
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

  /**
 * Adds a new user to a specified channel by updating the 'specificPeople' array in Firestore.
 * 
 * @param channelName - The name of the channel (used as the document ID in Firestore).
 * @param newUserId - The ID of the user to be added to the channel.
 * 
 * This function retrieves the Firestore document corresponding to the given channel name
 * and updates the 'specificPeople' array to include the new user. If the operation is 
 * successful, it logs a confirmation message; otherwise, it logs an error.
 */
   private async addNewUserToMainChannel(channelName: string, newUserId: string) {
    try {
      // Reference the document for the "Willkommen" channel
      const channelRef = doc(
        this.firestore,
        'channels',
        channelName
      ); // Assuming 'channels' is the collection name and 'channelName' is the document ID

      // Update the 'allMembers' array
      await updateDoc(channelRef, {
        specificPeople: arrayUnion(newUserId),
      });

    } catch (error) {
      this.stateControl.showConfirmationText.set(`Error adding user to the channel: ${error}`);
    }
    this.stateControl.removeShowToast();
  }

}
