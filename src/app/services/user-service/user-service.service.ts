import { inject, Injectable, signal } from '@angular/core';
import { Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { User as AppUser, User } from '../../models/interfaces/user.model';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { StorageService } from '../storage/storage.service';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { getAuth, updateEmail, updateProfile } from '@angular/fire/auth';
import { tick } from '@angular/core/testing';
import { Message } from '../../models/interfaces/message.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  firestore = inject(Firestore);
  unsubscribe: any;
  public userList: AppUser[] = [];
  private readonly storageService = inject(StorageService);
  messageReceiver: User | null = null;
  auth = getAuth();
  answerChatMessage: Message | null = null;
  selectedUserMessage = signal<Message | null>(null);
  profileSingleUser!: User


  constructor() {

  }

  setThreadMessage(message: Message) {
    this.selectedUserMessage.set(message); // Nachricht setzen
  }

  subUserList() {
    this.unsubscribe = onSnapshot(this.getUsers(), (list) => {
      this.userList = [];
      list.forEach((element) => {
        const userData = element.data() as User;
        // console.log('userData List', userData);
        this.userList.push(userData);
      });
    });
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

  getUsers() {
    return collection(this.firestore, 'users');
  }

  async updateUserAvatar(userId: string, selectedAvatar: string) {
    const userDocRef = doc(this.getUsers(), userId);
    try {
      await updateDoc(userDocRef, { avatarUrl: selectedAvatar });
      console.log(`Avatar URL für Benutzer ${userId} erfolgreich aktualisiert.`);
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
        console.log("Profile updated successfully!");

        // Aktualisiere die E-Mail separat
        await updateEmail(this.auth.currentUser, userEmail);
        console.log("Email updated successfully!");
      } catch (error) {
        console.error("An error occurred while updating the user information:", error);
      }
    } else {
      console.error("No authenticated user found to update the profile.");
    }
  }


  // Update the current user muss noch geändert werden auf realtime verbindung !! wichtig
  async updateCurrentUser(user: AppUser) {
    const userDocRef = doc(this.getUsers(), user.uId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
    const userData = docSnap.data();
    console.log('Document data:', userData);
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

}
