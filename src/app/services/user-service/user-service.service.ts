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
  stateControl = inject(StateControlService);
  userDialog = inject(MatDialog);
  auth = getAuth();
  unsubscribe: any;
  public userList: AppUser[] = [];

  messageReceiver: User | null = null;
  privatMessageReceiver: User | null = null;
  answerChatMessage: Message | null = null;
  selectedUserMessage = signal<Message | null>(null);
  profileSingleUser!: User;

  constructor() {}

  /**
   * set the thread message
   * @param message
   */
  setThreadMessage(message: Message) {
    this.selectedUserMessage.set(message);
  }

  /**
   * sub user list from firebase as snapshot
   */
  subUserList() {
    this.unsubscribe = onSnapshot(this.getUsers(), (list) => {
      this.userList = [];
      list.forEach((element) => {
        const userData = element.data() as User;
        this.userList.push(userData);
      });
    });
  }

  /**
   * get user list from firebase
   * @returns
   */
  getUsers() {
    return collection(this.firestore, 'users');
  }

  /**
   * update user avatar in firebase
   * @param userId
   * @param selectedAvatar
   */
  async updateUserAvatar(userId: string, selectedAvatar: string) {
    const userDocRef = doc(this.getUsers(), userId);
    try {
      await updateDoc(userDocRef, { avatarUrl: selectedAvatar });
    } catch (error) {}
  }

  /**
   *check if user is online
   update user Profile in firebase
   updated user name and email
   * @param userName
   * @param userEmail
   */
  async updateCurrentUserToFirebase(userName: string, userEmail: string) {
    if (this.auth.currentUser) {
      try {
        await updateProfile(this.auth.currentUser, {
          displayName: userName,
        });
        await updateEmail(this.auth.currentUser, userEmail);
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

  /**
   * get the user data from firebase
   * @param userId
   */
  async showProfileUserSingle(userId: string) {
    this.profileSingleUser = null as unknown as User;
    const userDocRef = doc(this.getUsers(), userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      this.profileSingleUser = docSnap.data() as User;
    }
  }

  /**
   * updated user online status
   * @param currentUserId
   * @param statusType
   */
  async updateUserStatus(currentUserId: string, statusType: boolean) {
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

  /**
   * open Single user profil view box with data about user
   * @param userId
   */
  async openProfileUserSingle(userId: string) {
    this.stateControl.scrollToBottomGlobal = false;
    await this.showProfileUserSingle(userId);
    this.userDialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }
}
