import { inject, Injectable, signal } from '@angular/core';
import { Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { User as AppUser, User } from '../../models/interfaces/user.model';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import {
  authState,
  getAuth,
  updateEmail,
  updateProfile,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Message } from '../../models/interfaces/message.model';
import { Observable } from 'rxjs';
import { StateControlService } from '../state-control/state-control.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileSingleUserComponent } from '../../shared/profile-single-user/profile-single-user.component';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  firestore = inject(Firestore);
  unsubscribe: any;
  public userList: AppUser[] = [];
  // public userListUid: string[] = [];
  stateControl = inject(StateControlService);
  userDialog = inject(MatDialog);

  messageReceiver: User | null = null;
  privatMessageReceiver: User | null = null;
  auth = getAuth();
  answerChatMessage: Message | null = null;
  selectedUserMessage = signal<Message | null>(null);
  profileSingleUser!: User;

  constructor() {}

  setThreadMessage(message: Message) {
    this.selectedUserMessage.set(message); // Nachricht setzen
  }
  // Load users from firabse
  subUserList() {
    this.unsubscribe = onSnapshot(this.getUsers(), (list) => {
      this.userList = [];
      list.forEach((element) => {
        const userData = element.data() as User;
        this.userList.push(userData);
      });
    });
  }

  getUsers() {
    return collection(this.firestore, 'users');
  }

  async updateUserAvatar(userId: string, selectedAvatar: string) {
    const userDocRef = doc(this.getUsers(), userId);
    try {
      await updateDoc(userDocRef, { avatarUrl: selectedAvatar });
      console.log(
        `Avatar URL für Benutzer ${userId} erfolgreich aktualisiert.`
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Avatars:', error);
    }
  }

  async updateCurrentUserToFirebase(userName: string, userEmail: string) {
    if (this.auth.currentUser) {
      try {
        // Aktualisiere den displayName und das Avatar-Bild (photoURL)
        await updateProfile(this.auth.currentUser, {
          displayName: userName,
        });
        console.log('Profile updated successfully!');

        // Aktualisiere die E-Mail separat
        await updateEmail(this.auth.currentUser, userEmail);
        console.log('Email updated successfully!');
      } catch (error) {
        console.error(
          'An error occurred while updating the user information:',
          error
        );
      }
    } else {
      console.error('No authenticated user found to update the profile.');
    }
  }

  async showProfileUserSingle(userId: string) {
    this.profileSingleUser = null as unknown as User;
    const userDocRef = doc(this.getUsers(), userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      this.profileSingleUser = docSnap.data() as User;
    }
  }

  async updateUserStatus(currentUserId: string, statusType: boolean) {
    console.log('currentUserId ist status geändert', currentUserId);

    const userDocRef = doc(this.firestore, 'users', currentUserId);
    await updateDoc(userDocRef, { status: statusType });
  }

  /**
   * Returns an observable of the currently authenticated user.
   * The observable emits:
   * - A `FirebaseUser` object when a user is logged in.
   * - `null` when the user is logged out.
   *
   * @returns {Observable<FirebaseUser | null>} An observable that tracks the authentication state.
   */
  getCurrentUser(): Observable<FirebaseUser | null> {
    return authState(this.auth); // Returns an observable of the current user
  }

  async openProfileUserSingle(userId: string) {
    this.stateControl.scrollToBottomGlobal = false;
    await this.showProfileUserSingle(userId);
    this.userDialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }
}
