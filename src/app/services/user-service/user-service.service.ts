import { inject, Injectable } from '@angular/core';
import { Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { User as AppUser, User } from '../../models/interfaces/user.model';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { StorageService } from '../storage/storage.service';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  firestore = inject(Firestore);
  unsubscribe: any;
  public userList: AppUser[] = [];
  private readonly storageService = inject(StorageService);
  messageReceiver: User | null = null;



  constructor() {

  }

  subUserList() {
    this.unsubscribe = onSnapshot(this.getUsers(), (list) => {
      this.userList = [];
      list.forEach((element) => {
        const userData = element.data() as User;
        console.log('userData List', userData);
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

 async getUserAvatarFromStorage(userId: string) {

  }

  async updateCurrentUser(user: AppUser) {
    const userDocRef = doc(this.getUsers(), user.uId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
    const userData = docSnap.data();
    console.log('Document data:', userData);
    }
  }

}
