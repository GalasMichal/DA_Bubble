import { inject, Injectable, signal } from '@angular/core';
import { ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseService } from '../firebase/firebase.service';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  private storage = inject(Storage);
  db = inject(FirebaseService);
  uploadMsg = signal('eigenes Bild verwenden');


  loadStandardAvatar() {}
  uploadAvatarToStorage(file: any) {
    console.log('user', this.db.currentUser());
    const userId = this.db.currentUser()!.uId;
    const collectionRef = ref(this.storage, `avatars/${userId}`);
    const pathRef = ref(collectionRef, file.name);
    uploadBytes(pathRef, file);
    console.log('file', file);
  }
}
