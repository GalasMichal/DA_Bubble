import {
  Injectable,
  Injector,
  Signal,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { StateControlService } from '../state-control/state-control.service';
import { FirebaseService } from '../firebase/firebase.service';
import { openDB } from 'idb';
import { User } from '../../models/interfaces/user.model';
import { environment } from '../../../environments/environment.firebase';
import { Auth } from '@angular/fire/auth';

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
  private auth = inject(Auth);
  private injector = inject(Injector);

  private fbCtx<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }

  /**
   * subscriptions array to manage unsubscribe
   */
  private subscriptions: Record<string, Unsubscribe> = {};

  public currentChannelSignal = signal<Channel | null>(null);
  channels = signal<Channel[]>([]);
  messages = signal<Message[]>([]);

  /** System-Kanal „Willkommen“ — nicht löschen/ändern (ID = environment.mainChannelId). */
  isMainChannel(chanId: string | undefined | null): boolean {
    return !!chanId && chanId === environment.mainChannelId;
  }

  /** Firestore-Profil oder Firebase-Auth-UID (Profil kann kurz fehlen — sonst bleibt die Kanalliste leer). */
  private effectiveUserId(): string | null {
    return (
      this.fireService.currentUser()?.uId ?? this.auth.currentUser?.uid ?? null
    );
  }

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
    const previousId = this.currentChannelSignal()?.chanId;
    if (previousId) {
      this.unsubscribe(`messages_${previousId}`);
    }
    this.messages.set([]);
    this.currentChannelSignal.set(channel);
    await this.subscribeToFirestoreMessages(channel.chanId);
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
   * Ersetzt IndexedDB-Kanäle durch Firestore (specificPeople enthält Nutzer).
   * Willkommen (environment.mainChannelId) wird immer ergänzt, wenn das Dokument existiert — unabhängig von specificPeople.
   * Sollte nach Login vor dem ersten UI-Lauf ausgeführt werden.
   */
  async reconcileChannelsWithFirestore(): Promise<void> {
    const userId = this.effectiveUserId();
    if (!userId) return;

    const fs = this.fireService.firestore;
    const db = await this.dbPromise;

    const snapshot = await this.fbCtx(() =>
      getDocs(
        query(
          collection(fs, 'channels'),
          where('specificPeople', 'array-contains', userId)
        )
      )
    );

    let channelsFromFirestore: Channel[] = snapshot.docs.map((d) => ({
      ...(d.data() as Channel),
      chanId: d.id,
    }));

    const mainId = environment.mainChannelId;
    if (
      mainId &&
      !channelsFromFirestore.some((c) => c.chanId === mainId)
    ) {
      const mainSnap = await this.fbCtx(() =>
        getDoc(doc(fs, 'channels', mainId))
      );
      if (mainSnap.exists()) {
        const data = mainSnap.data() as Channel;
        channelsFromFirestore = [
          ...channelsFromFirestore,
          { ...data, chanId: mainId },
        ];
      } else if (mainId && !mainId.startsWith('YOUR_')) {
        console.warn(
          '[Willkommen] Kein Dokument channels/' +
            mainId +
            ' — mainChannelId in environment.firebase.ts anpassen (Firestore-Dokument-ID).'
        );
      }
    }

    const validIds = new Set(channelsFromFirestore.map((c) => c.chanId));

    await db.clear('channels');
    for (const ch of channelsFromFirestore) {
      await db.put('channels', ch);
    }

    const allMsgs = await db.getAll('messages');
    for (const m of allMsgs) {
      if (!m.messageId || !m.chatId) continue;
      if (!validIds.has(m.chatId)) {
        await db.delete('messages', m.messageId);
      }
    }

    this.channels.set(channelsFromFirestore);

    const cur = this.currentChannelSignal();
    if (cur && !validIds.has(cur.chanId)) {
      this.currentChannelSignal.set(null);
      void this.router.navigate(['main']);
    }
  }

  /**
   * subscribe to firestore channels
   * filter channels by specific people
   * and update channels in indexedDB
   * set updated channels to signal
   */
  async subscribeToFirestoreChannels() {
    const userId = this.effectiveUserId();
    if (!userId) return;
    this.fbCtx(() => {
      const channelsRef = collection(this.fireService.firestore, 'channels');
      this.subscriptions['channelUpdates'] = onSnapshot(
        channelsRef,
        async (snapshot) => {
        const db = await this.dbPromise;
        let updatedChannels: Channel[] = snapshot.docs
          .map((d) => ({
            ...(d.data() as Channel),
            chanId: d.id,
          }))
          .filter((channel) =>
            channel.specificPeople?.includes(userId)
          );

        const mainId = environment.mainChannelId;
        if (
          mainId &&
          !updatedChannels.some((c) => c.chanId === mainId)
        ) {
          const mainDoc = snapshot.docs.find((d) => d.id === mainId);
          if (mainDoc) {
            updatedChannels = [
              ...updatedChannels,
              {
                ...(mainDoc.data() as Channel),
                chanId: mainId,
              },
            ];
          }
        }

        const validIds = new Set(updatedChannels.map((c) => c.chanId));
        const cachedChannels: Channel[] = await db.getAll('channels');
        for (const ch of cachedChannels) {
          if (!validIds.has(ch.chanId)) {
            await db.delete('channels', ch.chanId);
            const allMsgs = await db.getAll('messages');
            for (const m of allMsgs) {
              if (m.chatId === ch.chanId && m.messageId) {
                await db.delete('messages', m.messageId);
              }
            }
          }
        }

        for (const channel of updatedChannels) {
          await this.saveOrUpdateChannelInIndexedDB(channel);
        }
        this.channels.set(updatedChannels);
        }
      );
    });
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
    await this.fbCtx(() => {
      const channelRef = collection(this.fireService.firestore, 'channels');
      const newChannelRef = doc(channelRef);
      channel.chanId = newChannelRef.id;
      return setDoc(newChannelRef, { ...channel, chanId: newChannelRef.id });
    });
    await db.put('channels', channel);
    this.getChannelsFromIndexedDB();
  }

  /**
   * update channel in firestore
   * update channel in indexedDB
   * @param channel interface channel
   */
  async updateChannel(channel: Channel) {
    if (this.isMainChannel(channel.chanId)) {
      return;
    }
    await this.fbCtx(() =>
      setDoc(
        doc(this.fireService.firestore, `channels/${channel.chanId}`),
        channel,
        { merge: true }
      )
    );
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
    if (this.isMainChannel(chanId)) {
      return;
    }
    await this.fbCtx(() =>
      deleteDoc(doc(this.fireService.firestore, `channels/${chanId}`))
    );
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
      const cachedMessages: Message[] = await db.getAll('messages');
      const filteredMessages: Message[] = cachedMessages.filter(
        (message) => message.chatId === chanId
      );
      // Schneller Kanalwechsel: ältere Loads dürfen den aktuellen Chat nicht überschreiben
      if (this.currentChannelSignal()?.chanId !== chanId) {
        return filteredMessages;
      }
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
    for (const key of Object.keys(this.subscriptions)) {
      if (key.startsWith('messages_') && key !== `messages_${chanId}`) {
        this.unsubscribe(key);
      }
    }

    this.messages.set([]);
    await this.loadMessagesFromIndexedDB(chanId);
    if (this.currentChannelSignal()?.chanId !== chanId) {
      return;
    }

    const messagesRef = this.fbCtx(() =>
      collection(this.fireService.firestore, `channels/${chanId}/messages`)
    );
    this.fbCtx(() => {
      this.subscriptions[`messages_${chanId}`] = onSnapshot(
        messagesRef,
        async (snapshot) => {
          if (this.currentChannelSignal()?.chanId !== chanId) {
            return;
          }
          const db = await this.dbPromise;
          const messages: Message[] = snapshot.docs
            .map((doc) => doc.data() as Message)
            .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
          for (const message of messages) {
            await db.put('messages', message);
          }
          if (this.currentChannelSignal()?.chanId === chanId) {
            this.messages.set(messages);
          }
        }
      );
    });
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
    await this.fbCtx(() => {
      const messagesRef = collection(
        this.fireService.firestore,
        `channels/${chanId}/messages`
      );
      const newMessageRef = doc(messagesRef);
      message.messageId = newMessageRef.id;
      return setDoc(newMessageRef, { ...message, messageId: newMessageRef.id });
    });
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
    await this.fbCtx(() =>
      setDoc(
        doc(
          this.fireService.firestore,
          `channels/${chanId}/messages/${message.messageId}`
        ),
        message,
        { merge: true }
      )
    );
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
    await this.fbCtx(() =>
      deleteDoc(
        doc(
          this.fireService.firestore,
          `channels/${chanId}/messages/${messageId}`
        )
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
    await this.fbCtx(() =>
      updateDoc(
        doc(
          this.fireService.firestore,
          'channels',
          chanId,
          'messages',
          messageId
        ),
        {
          text: messageText,
          lastEdit: Timestamp.now(),
          editCount: increment(1),
        }
      )
    );
  }
}
