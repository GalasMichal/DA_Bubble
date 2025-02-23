import { inject, Injectable, signal } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { PrivateChat } from '../../models/interfaces/privateChat.model';
import { UserServiceService } from '../user-service/user-service.service';
import { User } from '../../models/interfaces/user.model';
import { Router } from '@angular/router';
import { ChannelMessage, ChannelThreadMessage, Message, PrivateMessage, PrivateThreadMessage } from '../../models/interfaces/message.model';
import { IDBPDatabase, openDB } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  db = inject(FirebaseService);
  user = inject(UserServiceService);
  router = inject(Router);
  currentMessageChannelId = '';
  currentMessageId: string = '';
  currentMessageData!: PrivateChat;
  unsubscribe: any;
  messages = signal<Message[]>([]);

  constructor() {}

  private dbPromise = openDB('ChatDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('channels')) {
        db.createObjectStore('channels', { keyPath: 'chanId' });
      }
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'messageId' });
      }
      if (!db.objectStoreNames.contains('directMessages')) {
        db.createObjectStore('directMessages', { keyPath: 'chatId' });
      }
    },
  });

  async saveMessageLocally() {
    const db = await this.dbPromise;
    const messages = this.messages();
    console.log('Saving messages to local DB', messages);
    messages.forEach(async (msg) => {
      await db.put('directMessages', msg);
      console.log('Saved message to local DB', msg);
    });
  }

  async getMessagesLocally(chatId: string): Promise<(ChannelMessage | ChannelThreadMessage | PrivateMessage | PrivateThreadMessage)[]> {
    const db = await this.dbPromise;

    try {
      let cachedMessages = await db.getAll('directMessages');
      cachedMessages = cachedMessages.filter(
        (message: Message) => message.chatId === chatId
      );
      this.messages.set(cachedMessages);
      console.log('Loaded messages from local DB', cachedMessages);
      return cachedMessages;
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
      return [];
    }
  }
  // tu zreba poprawic lepiej
  async deleteMessages(chatId: string) {
    const db = await this.dbPromise;
    const tx = db.transaction('directMessages', 'readwrite');
    const store = tx.objectStore('directMessages');
    const messages = await store.getAllKeys();
    for (const key of messages) {
      await store.delete(key);
    }
    await tx.done;

    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );
    const querySnapshot = await getDocs(messagesCollectionRef);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  async newPrivateMessageChannel(user: User): Promise<string> {
    const existingChatId = await this.checkPrivateChatExists(user.uId);
    if (existingChatId) {
      this.currentMessageId = existingChatId;
      await this.loadCurrentMessageData();
      this.router.navigate(['main/messages/', existingChatId]);
      return existingChatId;
    }

    const channelCollectionRef = collection(
      this.db.firestore,
      'privateMessages'
    );
    const channelDocRef = doc(channelCollectionRef);
    const privateChat = this.setPrivateObject(channelDocRef, user.uId);
    await setDoc(channelDocRef, privateChat);

    this.currentMessageId = channelDocRef.id;
    await this.loadCurrentMessageData();
    this.router.navigate(['main/messages/', channelDocRef.id]);
    this.currentMessageChannelId = channelDocRef.id;
    return channelDocRef.id;
  }

  async addMessageToSubcollection(chatId: string, message: ChannelMessage | ChannelThreadMessage | PrivateMessage | PrivateThreadMessage) {
    if (!chatId) {
      throw new Error('chatId is required to add a message.');
    }
    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );
    await addDoc(messagesCollectionRef, message);
  }

  async loadCurrentMessageData() {
    const docRef = doc(
      this.db.firestore,
      'privateMessages',
      this.currentMessageId
    );
    this.unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        this.currentMessageData = doc.data() as PrivateChat;
      } else {
        console.log('No such document!');
      }
    });
  }

  unsubscribeMessages: (() => void) | null = null;

  async loadMessagesFromChat(chatId: string) {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }

    // Lade zuerst lokale Nachrichten
    const localMessages = await this.getMessagesLocally(chatId);
    this.messages.set(localMessages);
    console.log('Loaded messages from local DB', localMessages);

    // Setze den Snapshot-Listener
    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );
    const messagesQuery = query(
      messagesCollectionRef,
      orderBy('timestamp', 'asc')
    );
    this.messages.set([]);
    this.unsubscribeMessages = onSnapshot(
      messagesQuery,
      async (querySnapshot) => {
        const newMessages: (ChannelMessage | ChannelThreadMessage | PrivateMessage | PrivateThreadMessage)[] = [];
        querySnapshot.forEach((doc) => {
          newMessages.push(doc.data() as ChannelMessage | ChannelThreadMessage | PrivateMessage | PrivateThreadMessage);
        });

        this.messages.set(newMessages);
        console.log('Mesage signal', this.messages());
        this.saveMessageLocally();
        console.log('Received changes from DB', newMessages);
      }
    );
  }

  setPrivateObject(obj: any, uId: string) {
    return {
      privatChatId: obj.id,
      chatCreator: this.db.currentUser()!.uId,
      chatReciver: uId,
    } as PrivateChat;
  }

  async checkPrivateChatExists(uId: string): Promise<string | null> {
    const chatCreator = this.db.currentUser()!.uId;
    const privateChatCollection = collection(
      this.db.firestore,
      'privateMessages'
    );

    const q1 = query(
      privateChatCollection,
      where('chatCreator', '==', chatCreator),
      where('chatReciver', '==', uId)
    );
    const q2 = query(
      privateChatCollection,
      where('chatCreator', '==', uId),
      where('chatReciver', '==', chatCreator)
    );

    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);
    if (!querySnapshot1.empty) return querySnapshot1.docs[0].id;
    if (!querySnapshot2.empty) return querySnapshot2.docs[0].id;
    return null;
  }
}
