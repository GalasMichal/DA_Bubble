import { inject, Injectable, signal } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseService } from '../firebase/firebase.service';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  private storage = inject(Storage);

  uploadMsg = signal('eigenes Bild verwenden');


 async uploadAvatarToStorage(userId: string	, file: any) {
    const avatarRef = ref(this.storage, `avatars/${userId}/${file.name}`);
    try {
     await uploadBytes(avatarRef, file);
      const downloadUrl = await getDownloadURL(avatarRef);
      return downloadUrl;

    } catch (error) {

      console.error('Fehler beim Hochladen des Avatars:', error);
      return null;
    }

    }
  }

