import { inject, Injectable, signal } from '@angular/core';
import { ref, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  private storage = inject(Storage);
  uploadMsg = signal('eigenes Bild verwenden');

  loadStandardAvatar() {
   const pathRef = ref(this.storage, 'exampleAvatars');
  }
  uploadAvatarToStorage(file: any) {

    console.log('file', file);
  }
}
