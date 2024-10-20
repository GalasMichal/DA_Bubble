import { inject, Injectable, signal } from '@angular/core';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  private storage = inject(Storage);
  uploadMsg = signal('eigenes Bild verwenden');

  uploadUserAvatar(event: any) {
    const file = event.target.files[0];
    this.uploadMsg.set(file.name);
    console.log('file', file);
  }
}
