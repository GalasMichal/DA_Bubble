import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  addDoc,
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
  private subscriptions: { [key: string]: Unsubscribe } = {};
  public currentUserChannelsSpecificPeopleObject: AppUser[] = [];

  private dbPromise = openDB('ChatDB', 1, {
    upgrade(db) {
      db.createObjectStore('channels', { keyPath: 'chanId' });
    },
  });
  public currentChannelSignal = signal<Channel | null>(null);
  channels = signal<Channel[]>([]);

  setCurrentChannel(channel: Channel) {
    this.currentChannelSignal.set(channel);
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
    const newChannelRef = doc(channelRef); // Erstelle eine neue DocumentReference
    await setDoc(newChannelRef, { ...channel, chanId: newChannelRef.id }); // Speichere mit der generierten ID
    channel.chanId = newChannelRef.id;
    await db.put('channels', channel);
  }

  async updateChannel(channel: Channel) {
    const channelRef = doc(
      this.fireService.firestore, `channels/${channel.chanId}`
    );
    await setDoc(channelRef, channel, { merge: true });
    this.channels.update((channels) =>
      channels.map((c) => (c.chanId === channel.chanId ? channel : c))
    );
    const db = await this.dbPromise;
    await db.put('channels', channel);
  }

  async deleteChannel(chanId: string) {
    await deleteDoc(doc(this.fireService.firestore, 'channels', chanId));
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
