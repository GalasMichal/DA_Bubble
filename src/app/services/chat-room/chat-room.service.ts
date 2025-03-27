import { Injectable, Signal, inject, signal } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
} from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { StateControlService } from '../state-control/state-control.service';
import { FirebaseService } from '../firebase/firebase.service';
import { openDB } from 'idb';
import { User } from '../../models/interfaces/user.model';
import { arrayUnion } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  /**
   * inject state, router, route, firebase service
   */
  state = inject(StateControlService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  private fireService = inject(FirebaseService);

  /**
   * subscriptions array to manage unsubscribe
   */
  private subscriptions: { [key: string]: Unsubscribe } = {};

  public currentChannelSignal = signal<Channel | null>(null);
  channels = signal<Channel[]>([]);
  messages = signal<Message[]>([]);

  /**
   * indexDB initialization
   */
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
      if (!db.objectStoreNames.contains('messageReceivers')) {
        db.createObjectStore('messageReceivers', { keyPath: 'uId' });
      }
    },
  });

  /**
   * set current channel
   * load messages from indexedDB
   * @param channel interface channel
   * @returns
   */
  async setCurrentChannel(channel: Channel) {
    if (this.currentChannelSignal()?.chanId === channel.chanId) {
      return;
    }
    this.currentChannelSignal.set(channel);
    this.subscribeToFirestoreMessages(channel.chanId);
  }

  /**
   * clear messages from indexDb
   * set messages signal to empty
   */
  async clearMessagesCache() {
    const db = await this.dbPromise;
    await db.clear('messages');
    this.messages.set([]);
  }

  /**
   * get current channel
   * @returns signal channel
   */
  getCurrentChannel(): Signal<Channel | null> {
    return this.currentChannelSignal;
  }

  /**
   * get channels from indexedDB
   * @returns  channels[]
   */
  async getChannelsFromIndexedDB(): Promise<Channel[]> {
    const db = await this.dbPromise;
    const cachedChannels: Channel[] = await db.getAll('channels');
    this.channels.set(cachedChannels);
    return cachedChannels;
  }

  /**
   * subscribe to firestore channels
   * filter channels by specific people
   * and update channels in indexedDB
   * set updated channels to signal
   */
  async subscribeToFirestoreChannels() {
    const userId = this.fireService.currentUser()?.uId;
    if (!userId) return;
    const channelsRef = collection(this.fireService.firestore, 'channels');
    this.subscriptions['channelUpdates'] = onSnapshot(
      channelsRef,
      async (snapshot) => {
        const db = await this.dbPromise;
        const updatedChannels: Channel[] = snapshot.docs
          .map((doc) => doc.data() as Channel)
          .filter((channel) => channel.specificPeople.includes(userId));

        for (const channel of updatedChannels) {
          await this.saveOrUpdateChannelInIndexedDB(channel);
        }
        this.channels.set(updatedChannels);
      }
    );
  }

  /**
   * save or update channel in indexedDB
   * @param channel interface channel
   */
  async saveOrUpdateChannelInIndexedDB(channel: Channel) {
    const db = await this.dbPromise;
    await db.put('channels', channel);
  }

  /**
   * Create new channel
   * save channel in firestore
   * save channel in indexedDB
   * @param channel interface channel
   */
  async createChannel(channel: Channel) {
    const db = await this.dbPromise;
    const channelRef = collection(this.fireService.firestore, 'channels');
    const newChannelRef = doc(channelRef);
    await setDoc(newChannelRef, { ...channel, chanId: newChannelRef.id });
    channel.chanId = newChannelRef.id;
    await db.put('channels', channel);
    this.getChannelsFromIndexedDB();
  }

  /**
   * update channel in firestore
   * update channel in indexedDB
   * @param channel interface channel
   */
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

  /**
   * clear indexedDB
   * clear channels signal
   */
  async clearIndexedDB() {
    const db = await this.dbPromise;
    await db.clear('channels');
    this.channels.set([]);
  }

  /**
   * delete channel from firestore
   * delete channel from indexedDB
   * update channels signal
   * @param chanId string channel id
   */
  async deleteChannel(chanId: string) {
    const channelRef = doc(this.fireService.firestore, `channels/${chanId}`);
    await deleteDoc(channelRef);
    const db = await this.dbPromise;
    await db.delete('channels', chanId);
    this.channels.update((channels) =>
      channels.filter((c) => c.chanId !== chanId)
    );
  }

  /**
   * check if messages exists in indexedDB
   * get all messages from indexedDB
   * filter messages by chatId
   * set messages signal
   * catch error if any
   * @param chanId from current channel
   * @returns
   */
  async loadMessagesFromIndexedDB(chanId: string): Promise<Message[]> {
    const db = await this.dbPromise;
    if (!db.objectStoreNames.contains('messages')) {
      console.error('Der Objektstore "messages" existiert nicht.');
      return [];
    }
    try {
      let cachedMessages: Message[] = await db.getAll('messages');
      let filteredMessages: Message[] = cachedMessages.filter(
        (message) => message.chatId === chanId
      );
      this.messages.set(filteredMessages);
      return filteredMessages;
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
      return [];
    }
  }

  /**
   * subscribe to firestore messages from specific channel
   * get all messages from firestore
   * sort messages by timestamp
   * put messages in indexedDB
   * set messages signal
   * @param chanId
   */
  async subscribeToFirestoreMessages(chanId: string) {
    await this.loadMessagesFromIndexedDB(chanId);
    const messagesRef = collection(
      this.fireService.firestore,
      `channels/${chanId}/messages`
    );
    this.subscriptions[`messages_${chanId}`] = onSnapshot(
      messagesRef,
      async (snapshot) => {
        const db = await this.dbPromise;
        const messages: Message[] = snapshot.docs
          .map((doc) => doc.data() as Message)
          .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        for (const message of messages) {
          await db.put('messages', message);
        }
        this.messages.set(messages);
      }
    );
  }

  /**
   * create new message
   * add message to firestore
   * add message to indexedDB
   * @param chanId string channel id
   * @param message interface message
   */
  async createMessage(chanId: string, message: Message) {
    const db = await this.dbPromise;
    const messagesRef = collection(
      this.fireService.firestore,
      `channels/${chanId}/messages`
    );
    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, { ...message, messageId: newMessageRef.id });
    message.messageId = newMessageRef.id;
    await db.put('messages', message);
  }

  /**
   * load current channel after refresh
   * get channel from indexedDB
   * set channel to signal
   * @param currentChannelId string channel id
   */
  async loadCurrentChannelAfterRefresh(currentChannelId: string) {
    const db = await this.dbPromise;
    const channel = await db.get('channels', currentChannelId);
    if (channel) {
      this.currentChannelSignal.set(channel);
    } else this.router.navigate(['main/chat']);
  }

  /**
   * update message
   * update message in firestore
   * @param chanId string channel id
   * @param message interface message
   */
  async updateMessage(chanId: string, message: Message) {
    const messageRef = doc(
      this.fireService.firestore,
      `channels/${chanId}/messages/${message.messageId}`
    );
    await setDoc(messageRef, message, { merge: true });
    this.messages.update((messages) =>
      messages.map((m) => (m.messageId === message.messageId ? message : m))
    );
  }

  /**
   * delete message from firestore
   * @param chanId string channel id
   * @param messageId string message id
   */
  async deleteMessage(chanId: string, messageId: string) {
    await deleteDoc(
      doc(
        this.fireService.firestore,
        `channels/${chanId}/messages/${messageId}`
      )
    );
    this.messages.update((messages) =>
      messages.filter((m) => m.messageId !== messageId)
    );
  }

  /**
   *  unsubscribe subscription
   * @param key string
   */
  unsubscribe(key: string) {
    if (this.subscriptions[key]) {
      this.subscriptions[key]();
      delete this.subscriptions[key];
    }
  }

  /**
   * unsubscribe all subscriptions
   */
  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach((key) => this.unsubscribe(key));
  }

  /**
   * update message text in firestore
   * @param messageText string new message text
   * @param chanId string channel id
   * @param messageId string message id
   */

  async updateMessageTextInFirestore(
    messageText: string,
    chanId: string,
    messageId: string
  ) {
    const messageDocRef = doc(
      this.fireService.firestore,
      'channels',
      chanId,
      'messages',
      messageId
    );

    await updateDoc(messageDocRef, {
      text: messageText,
      lastEdit: Timestamp.now(),
      editCount: increment(1), // Falls du den Edit-Count hochzählen möchtest
    });
  }
}
