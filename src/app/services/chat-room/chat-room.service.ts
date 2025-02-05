import { Injectable, Signal, inject, signal } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc,
} from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { User as AppUser } from '../../models/interfaces/user.model';
import { Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { StateControlService } from '../state-control/state-control.service';
import { FirebaseService } from '../firebase/firebase.service';
import { openDB } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private fireService = inject(FirebaseService);
  // public userList: AppUser[] = [];
  // public answers: Message[] = [];
  // public messageAnswerList = signal<Message[]>([]);
  private subscriptions: { [key: string]: Unsubscribe } = {};
  // public currentUserChannels: Channel[] = [];
  // public currentUserChannelsSpecificPeopleUid: string[] = [];
  // public currentUserChannelsSpecificPeopleObject: AppUser[] = [];

  private dbPromise = openDB('ChatDB', 1, {
    upgrade(db) {
      db.createObjectStore('channels', { keyPath: 'chanId' });
    },
  });

  channels = signal<Channel[]>([]);

  constructor() {


  }

  async loadChannels() {
    const userId = this.fireService.currentUser()?.uId;
    if (!userId) return;

    // 1️⃣ Erst aus IndexedDB laden (Offline-Support)
    const db = await this.dbPromise;
    const cachedChannels: Channel[] = await db.getAll('channels');
    this.channels.set(cachedChannels);

    // 2️⃣ Firestore abonnieren (onSnapshot für Echtzeit-Updates)
    const channelsRef = collection(this.fireService.firestore, 'channels');
    onSnapshot(channelsRef, async (snapshot) => {
      const updatedChannels: Channel[] = [];
      const db = await this.dbPromise;

      for (const doc of snapshot.docs) {
        const channel = doc.data() as Channel;
        if (channel.specificPeople.includes(userId)) {
          updatedChannels.push(channel);
          await db.put('channels', channel); // Update IndexedDB
        }
      }
      this.channels.set(updatedChannels);
      console.log('channels', updatedChannels);
    });
  }

  async addChannel(channel: Channel) {
    const channelRef = doc(
      this.fireService.firestore,
      `channels/${channel.chanId}`
    );
    await setDoc(channelRef, channel);
    this.channels.update((channels) => [...channels, channel]);
    const db = await this.dbPromise;
    await db.put('channels', channel); // IndexedDB aktualisieren
  }

  async updateChannel(channel: Channel) {
    const channelRef = doc(
      this.fireService.firestore,
      `channels/${channel.chanId}`
    );
    await setDoc(channelRef, channel, { merge: true });
    this.channels.update((channels) =>
      channels.map((c) => (c.chanId === channel.chanId ? channel : c))
    );
    const db = await this.dbPromise;
    await db.put('channels', channel);
  }

  async deleteChannel(chanId: string) {
    const channelRef = doc(this.fireService.firestore, `channels/${chanId}`);
    await setDoc(channelRef, { deleted: true }, { merge: true }); // Soft Delete
    this.channels.update((channels) =>
      channels.filter((c) => c.chanId !== chanId)
    );
    const db = await this.dbPromise;
    await db.delete('channels', chanId);
  }

  unsubscribe(key: string) {
    if (this.subscriptions[key]) {
      this.subscriptions[key]();
      delete this.subscriptions[key];
    }
  }

  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach((key) => this.unsubscribe(key));
  }
}

// Old Data only for compare with new data
//   // Caching-Maps
//   private channelCache: Map<string, Channel> = new Map();
//   private messageCache: Map<string, Message[]> = new Map();

//   constructor() {}

//   unsubscribe(key: string) {
//     if (this.subscriptions[key]) {
//       this.subscriptions[key]();
//       delete this.subscriptions[key];
//     }
//   }

//   unsubscribeAll() {
//     Object.keys(this.subscriptions).forEach((key) => this.unsubscribe(key));
//   }

//   /** Lädt die Channel-Daten aus dem Cache oder Firestore */
//   async getChannelById(channelId: string): Promise<Channel | null> {
//     if (this.channelCache.has(channelId)) {
//       return this.channelCache.get(channelId)!;
//     }

//     const channelRef = doc(this.firestore, 'channels', channelId);
//     const channelSnap = await getDoc(channelRef);

//     if (channelSnap.exists()) {
//       const channelData = channelSnap.data() as Channel;
//       this.channelCache.set(channelId, channelData);
//       return channelData;
//     }

//     return null;
//   }

//   /** Öffnet einen Chat und cached die Channel-Daten */
//   async openChatById(channelId: string) {
//     this.unsubscribe('channel');
//     this.currentChannel = channelId;

//     // Prüfe zuerst den Cache
//     const cachedChannel = await this.getChannelById(channelId);
//     if (cachedChannel) {
//       this.currentChannelData = cachedChannel;
//     }

//     const channelRef = doc(this.firestore, 'channels', channelId);
//     this.subscriptions['channel'] = onSnapshot(channelRef, (doc) => {
//       if (doc.exists()) {
//         this.currentChannelData = doc.data() as Channel;
//         this.channelCache.set(channelId, this.currentChannelData);
//       }
//     });

//     this.loadMessagesForChannel(channelId);
//     this.router.navigate(['main/chat/', channelId]);
//   }

//   /** Lädt Nachrichten aus dem Cache oder Firestore */
//   loadMessagesForChannel(channelId: string) {
//     this.unsubscribe('messages');

//     if (this.messageCache.has(channelId)) {
//       this.answers = this.messageCache.get(channelId)!;
//       return;
//     }

//     const messageRef = collection(
//       doc(this.firestore, 'channels', channelId),
//       'messages'
//     );

//     this.subscriptions['messages'] = onSnapshot(
//       messageRef,
//       (snapshot: QuerySnapshot<DocumentData>) => {
//         const messages = snapshot.docs.map((doc) => doc.data() as Message);
//         messages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

//         this.answers = messages;
//         this.messageCache.set(channelId, messages);
//       }
//     );
//   }

//   /** Fügt eine neue Nachricht hinzu und aktualisiert den Cache */
//   async addMessageToChannel(message: Message) {
//     let messageId = await this.addDocumentToCollection(
//       `channels/${this.currentChannel}/messages`,
//       message
//     );
//     messageId = messageId;

//     // Nachricht in den Cache hinzufügen
//     if (this.messageCache.has(this.currentChannel)) {
//       this.messageCache.get(this.currentChannel)!.push(message);
//     } else {
//       this.messageCache.set(this.currentChannel, [message]);
//     }

//     return messageId;
//   }

//   /** Fügt Dokument zu Firestore hinzu */
//   private async addDocumentToCollection(collectionPath: string, data: any): Promise<string> {
//     const docRef = await addDoc(collection(this.firestore, collectionPath), data);
//     return docRef.id;
//   }

//   /** Entfernt die Channel-Daten aus dem Cache */
//   clearChannelCache(channelId: string) {
//     this.channelCache.delete(channelId);
//   }

//   /** Entfernt die Nachrichten eines Channels aus dem Cache */
//   clearMessageCache(channelId: string) {
//     this.messageCache.delete(channelId);
//   }

//   /** Löscht alle Caches */
//   clearAllCaches() {
//     this.channelCache.clear();
//     this.messageCache.clear();
//   }

// updateMessageTextInFirestore(newText: string, channelId: string, messageId: string): Promise<void> {
//   const messageRef = doc(collection(this.firestore, 'channels', channelId, 'messages'), messageId);
//   return updateDoc(messageRef, {
//     text: newText,
//     lastEdit: Timestamp.now()  // Aktualisierung des Zeitstempels der letzten Bearbeitung
//   });
// }

// addAnswerToMessage(threadId: string, answerMessage: Message): Promise<void> {
//   const messageRef = doc(collection(this.firestore, 'messages'), threadId);
//   return updateDoc(messageRef, {
//     answers: arrayUnion(answerMessage)  // Füge die Antwort zur bestehenden Nachricht hinzu
//   });
// }
// updateMessageThreadId(messageDocRef: DocumentReference): Promise<void> {
//   return updateDoc(messageDocRef, {
//     threadId: messageDocRef.id  // Setzt die threadId auf die ID des Nachrichten-Dokuments
//   });
// }
// }
