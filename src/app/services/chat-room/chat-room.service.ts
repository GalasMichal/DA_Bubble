import { inject, Injectable, signal } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { Channel } from '../../models/interfaces/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  firestore = inject(Firestore);
  channelData: DocumentData | undefined = undefined;
  constructor() {}


  openChatById(id: string): Promise<() => void> {
    const channelRef = doc(this.firestore, 'channels', id);
    return new Promise((resolve, reject) => {
      const unsub = onSnapshot(
        channelRef,
        (doc) => {
           this.channelData = doc.data();
          if (this.channelData) {
            resolve(unsub); // Gib die Unsubscribe-Funktion zurück
          } else {
            reject(new Error('Channel data not found'));
          }
        },
        (error) => {
          reject(error); // Fehlerbehandlung
        }
      );
    });
  }
}
