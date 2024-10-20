import { inject, Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  private storage = inject(Storage);

  uploadUserAvatar(event: any) {

  }

}
