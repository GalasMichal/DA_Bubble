import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
} from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { User as AppUser } from '../../models/interfaces/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { StateControlService } from '../state-control/state-control.service';
import { FirebaseService } from '../firebase/firebase.service';
import { openDB } from 'idb';
import { getDoc } from 'firebase/firestore';
import { channel } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private fireService = inject(FirebaseService);
  private subscriptions: { [key: string]: Unsubscribe } = {};
  state = inject(StateControlService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  private dbPromise = openDB('ChatDB', 1, {
    upgrade(db) {
      db.createObjectStore('channels', { keyPath: 'chanId' });
      db.createObjectStore('messages', { keyPath: 'messageId' });
    },
  });
  public currentChannelSignal = signal<Channel | null>(null);
  channels = signal<Channel[]>([]);
  messages = signal<Message[]>([]);
  filteredMessages = signal<Message[]>([]);

  async setCurrentChannel(channel: Channel) {
    if (this.currentChannelSignal()?.chanId === channel.chanId) {
      return;
    }

    this.currentChannelSignal.set(channel);
    this.loadMessagesFromIndexedDB(channel.chanId);
    this.subscribeToFirestoreMessages(channel.chanId);
  }

  async clearMessagesCache() {
    const db = await this.dbPromise;
    await db.clear('messages');
    this.messages.set([]);
  }

  getCurrentChannel(): Signal<Channel | null> {
    return this.currentChannelSignal;
  }

  async getChannelsFromIndexedDB(): Promise<Channel[]> {
    const db = await this.dbPromise;
    const cachedChannels: Channel[] = await db.getAll('channels');
    this.channels.set(cachedChannels);
    return cachedChannels;
  }

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
        console.log('Channels aus Firestore aktualisiert:', updatedChannels);
      }
    );
  }

  async saveOrUpdateChannelInIndexedDB(channel: Channel) {
    const db = await this.dbPromise;
    await db.put('channels', channel);
  }

  async createChannel(channel: Channel) {
    const db = await this.dbPromise;
    const channelRef = collection(this.fireService.firestore, 'channels');
    const newChannelRef = doc(channelRef);
    await setDoc(newChannelRef, { ...channel, chanId: newChannelRef.id });
    channel.chanId = newChannelRef.id;
    await db.put('channels', channel);
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

  async clearIndexedDB() {
    const db = await this.dbPromise;
    await db.clear('channels'); // Löscht alle Channels aus IndexedDB
    this.channels.set([]); // Leert das lokale Signal
    console.log('IndexedDB wurde geleert.');
  }

  async deleteChannel(chanId: string) {
    const channelRef = doc(this.fireService.firestore, `channels/${chanId}`);
    await deleteDoc(channelRef);
    const db = await this.dbPromise;
    await db.delete('channels', chanId);
    this.channels.update((channels) =>
      channels.filter((c) => c.chanId !== chanId)
    );
  }

  // async loadMessages() {
  //   const db = await this.dbPromise;
  //   const allMessages: Message[] = [];

  //   for (const channel of this.channels()) {
  //     const messagesRef = collection(
  //       this.fireService.firestore,
  //       `channels/${channel.chanId}/messages`
  //     );
  //     const snapshot = await getDocs(messagesRef);

  //     const messages: Message[] = snapshot.docs
  //       .map((doc) => doc.data() as Message)
  //       .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

  //     for (const message of messages) {
  //       await db.put('messages', message);
  //     }

  //     allMessages.push(...messages);
  //   }

  //   this.messages.set(allMessages);
  //   console.log('Nachrichten aus Firestore geladen:', allMessages);
  // }

  async loadMessagesFromIndexedDB(chanId: string) {
    const db = await this.dbPromise;
    let cachedMessages: Message[] = await db.getAll('messages');
    let filteredMessages: Message[] = cachedMessages.filter(
      (message) => message.chatId === chanId
    );

    console.log(
      'Nachrichten aus IndexedDB für dany channeö geladen:',
      cachedMessages
    );
    this.messages.set(filteredMessages);
    return filteredMessages;
  }

  async subscribeToFirestoreMessages(chanId: string) {
    console.log('Abonniere Nachrichten für Channel:', chanId);
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

        // await db.clear('messages');
        for (const message of messages) {
          await db.put('messages', message);
        }

        this.messages.set(messages);
        console.log(
          `Nachrichten für Channel ${chanId} aktualisiert:`,
          messages
        );
      }
    );
  }

  async createMessage(chanId: string, message: Message) {
    const db = await this.dbPromise;
    const messagesRef = collection(
      this.fireService.firestore,
      `channels/${chanId}/messages`
    );
    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, { ...message, messageId: newMessageRef.id });
    message.messageId = newMessageRef.id;

    await db.put('messages', message); // Speichert Nachricht in IndexedDB
    console.log(
      `Nachricht gespeichert in IndexedDB für Channel ${chanId}:`,
      message
    );
  }

  async loadCurrentChannelAfterRefresh(currentChannelId: string) {
    const db = await this.dbPromise;
    const channel = await db.get('channels', currentChannelId);

    if (channel) {
      this.currentChannelSignal.set(channel);
      console.log('Channel aus IndexedDB geladen:', channel);
    } else {
      console.warn('Kein Channel mit dieser ID gefunden.');
    }
  }

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

  unsubscribe(key: string) {
    if (this.subscriptions[key]) {
      this.subscriptions[key]();
      delete this.subscriptions[key];
    }
  }

  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach((key) => this.unsubscribe(key));
  }

  async updateMessageTextInFirestore(
    textAreaEdited: string,
    chanId: string,
    textAreaEditId: string
  ) {
    const messageDocRef = doc(
      this.fireService.firestore,
      'channels',
      chanId,
      'messages',
      textAreaEditId
    );

    // Aktualisiere die Reaktionen im Firestore-Dokument
    await updateDoc(messageDocRef, {
      text: textAreaEdited,
      lastEdit: Timestamp.now(),
      editCount: 1,
    });
  }
}
