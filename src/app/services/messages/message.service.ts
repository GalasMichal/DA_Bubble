import { inject, Injectable, signal } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { PrivateChat } from '../../models/interfaces/privateChat.model';
import { UserServiceService } from '../user-service/user-service.service';
import { User } from '../../models/interfaces/user.model';
import { Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { openDB } from 'idb';
import { text } from 'stream/consumers';

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
  currentMessageToEdit = signal<Message | null>(null);

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

  /**
   * saveMessageLocally in IndexDB
   * for offline usage
   */
  async saveMessageLocally() {
    const db = await this.dbPromise;
    const messages = this.messages();
    messages.forEach(async (msg) => {
      await db.put('directMessages', msg);
    });
  }

  /**
   * getMessagesLocally from IndexDB
   * filter by chatId and return messages for current chat
   * @param chatId
   * @returns
   */
  async getMessagesLocally(chatId: string): Promise<Message[]> {
    const db = await this.dbPromise;
    try {
      let cachedMessages = await db.getAll('directMessages');
      cachedMessages = cachedMessages.filter(
        (message: Message) => message.chatId === chatId
      );
      this.messages.set(cachedMessages);
      return cachedMessages;
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
      return [];
    }
  }
  /**
   * Remove all messages from IndexDB
   * @param chatId
   */
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

  /**
   * Create a new private message channel after the message sending process
   * check if the chat already exists
   * @param user
   * @returns
   */
  async newPrivateMessageChannel(user: User): Promise<string> {
    const existingChatId = await this.checkPrivateChatExists(user.uId);
    if (existingChatId) {
      return this.handleExistingChat(existingChatId);
    }
    return this.createNewPrivateChat(user.uId);
  }

  /**
   * Handle the existing chat
   * load the current message data from this chat
   * navigate to the chat
   * @param chatId
   * @returns
   */
  private async handleExistingChat(chatId: string): Promise<string> {
    this.currentMessageId = chatId;
    await this.loadCurrentMessageData();
    this.router.navigate(['main/messages/', chatId]);
    return chatId;
  }

  /**
   *  Create a new private chat
   *  load the current message data from this chat and navigate to the chat
   * @param userId
   * @returns
   */
  private async createNewPrivateChat(userId: string): Promise<string> {
    const channelDocRef = await this.createPrivateChatDocument(userId);
    this.currentMessageId = channelDocRef.id;
    await this.loadCurrentMessageData();
    this.router.navigate(['main/messages/', channelDocRef.id]);
    this.currentMessageChannelId = channelDocRef.id;
    return channelDocRef.id;
  }

  /**
   * Create a new private chat document
   * @param userId
   * @returns
   */
  private async createPrivateChatDocument(
    userId: string
  ): Promise<DocumentReference> {
    const channelCollectionRef = collection(
      this.db.firestore,
      'privateMessages'
    );
    const channelDocRef = doc(channelCollectionRef);
    const privateChat = this.setPrivateObject(channelDocRef, userId);
    await setDoc(channelDocRef, privateChat);
    return channelDocRef;
  }

  /**
   *  Add a message to the subcollection of the private chat
   * @param chatId
   * @param message
   */
  async addMessageToSubcollection(chatId: string, message: Message) {
    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );

    const messageDocRef = doc(messagesCollectionRef); // Erstellt eine neue Dokument-Referenz mit ID
    message.messageId = messageDocRef.id; // Weise die generierte ID der Nachricht zu

    await setDoc(messageDocRef, message); // Speichert das Dokument mit der ID
  }

  /**
   * Load the current message data from firestore
   */
  async loadCurrentMessageData() {
    const docRef = doc(
      this.db.firestore,
      'privateMessages',
      this.currentMessageId
    );
    this.unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        this.currentMessageData = doc.data() as PrivateChat;
      }
    });
  }
  /**
   * Unsubscribe from the current message data
   */
  unsubscribeMessages: (() => void) | null = null;

  /**
   * load messages from the chat
   * load messages from the local DB
   * @param chatId
   */
  async loadMessagesFromChat(chatId: string) {
    this.unsubscribeMessages?.();
    await this.loadLocalMessages(chatId);
    this.setupSnapshotListener(chatId);
  }

  /**
   * load messages from the local DB by chatId
   * @param chatId
   */
  private async loadLocalMessages(chatId: string) {
    const localMessages = await this.getMessagesLocally(chatId);
    this.messages.set(localMessages);
  }

  async updateMessageInSubcollection(
    chatId: string,
    messageId: string,
    updatedText: string // Direkt den Text übergeben
  ) {
    if (!updatedText) {
      console.error('Fehler: Der übergebene Text ist leer oder undefined.');
      return;
    }

    const messageDocRef = doc(
      this.db.firestore,
      'privateMessages',
      chatId,
      'messages',
      messageId
    );

    try {
      await updateDoc(messageDocRef, {
        text: updatedText,
        lastEdit: Timestamp.now(),
        editCount: increment(1),
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Nachricht:', error);
    }
  }

  /**
   * setup the snapshot listener for the chat
   * @param chatId
   */
  private setupSnapshotListener(chatId: string) {
    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );
    const messagesQuery = query(
      messagesCollectionRef,
      orderBy('timestamp', 'asc')
    );
    this.unsubscribeMessages = onSnapshot(
      messagesQuery,
      async (querySnapshot) => {
        const newMessages = querySnapshot.docs.map(
          (doc) => doc.data() as Message
        );
        this.messages.set(newMessages);
        await this.saveMessageLocally();
      }
    );
  }

  /**
   * save the message to the chat
   * clear the message db
   * put the message to the local db
   * @param message
   */
  async saveMessageReceiverToIndexDB(user: User): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('messageReceivers');
    await db.put('messageReceivers', user);
  }

  /**
   * load the message receiver from the index db
   */
  async loadMessageReceiverFromIndexDB(): Promise<void> {
    const db = await this.dbPromise;
    const user = await db.getAll('messageReceivers');
    if (user) this.user.privatMessageReceiver = user[0];
  }

  /**
   * set the private object for the chat
   * @param obj
   * @param uId
   * @returns
   */
  setPrivateObject(obj: any, uId: string) {
    return {
      privatChatId: obj.id,
      chatCreator: this.db.currentUser()!.uId,
      chatReciver: uId,
    } as PrivateChat;
  }

  /**
   * check if the private chat exists in the database
   * @param uId
   * @returns
   */
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

    const q3 = query(privateChatCollection, where('privatChatId', '==', uId));

    const [querySnapshot1, querySnapshot2, querySnapshot3] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
      getDocs(q3),
    ]);

    if (!querySnapshot1.empty) return querySnapshot1.docs[0].id;
    if (!querySnapshot2.empty) return querySnapshot2.docs[0].id;
    if (!querySnapshot3.empty) return querySnapshot3.docs[0].id;
    return null;
  }
}
