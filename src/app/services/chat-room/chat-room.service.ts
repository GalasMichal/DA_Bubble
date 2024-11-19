import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { User as AppUser } from '../../models/interfaces/user.model';
import { Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { addDoc, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { StateControlService } from '../state-control/state-control.service';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private firestore = inject(Firestore);
  state = inject(StateControlService);
  private router = inject(Router);
  public currentChannel: string = '';
  public unsubscribe: any;
  public userList: AppUser[] = [];
  public channelList: Channel[] = [];
  public currentChannelData!: Channel;
  public answers: Message[] = [];
  unsub: any;

  constructor() {}

  async addMessageToChannel(message: Message) {
    const channelId = this.currentChannelData.chanId;
    const channelCollectionRef = collection(
      this.firestore,
      'channels',
      channelId,
      'messages'
    );
    const messageDocRef = await addDoc(channelCollectionRef, message);
    console.log('Message verschickt', message);
    return messageDocRef.id; // Rückgabe der generierten Message-ID
  }

  async updateMessageThreadId(messageId: string) {
    console.log('updateMessageThreadId:', messageId);

    const channelId = this.currentChannelData.chanId;
    const messageDocRef = doc(
      this.firestore, 'channels', channelId, 'messages', messageId);

    // Aktualisiere das Dokument mit der Firestore-generierten ID als threadId
    await updateDoc(messageDocRef, { threadId: messageId });
  }

  addAnswerToMessage(messageId: string, answer: Message) {
    const channelId = this.currentChannelData.chanId;
    const messageCollectionRef = collection(
      this.firestore,
      'channels',
      channelId,
      'messages',
      messageId,
      'answers'
    );
    addDoc(messageCollectionRef, answer);
    console.log('Answer verschickt', answer);
  }


  subChannelList() {
    this.unsubscribe = onSnapshot(this.getChannels(), (list) => {
      this.channelList = [];
      list.forEach((element) => {
        const channelData = element.data();
        const channelId = element.id;
        const channelObject = this.setChannelObject(channelData, channelId);
        this.channelList.push(channelObject);
      });
    });
  }

  setChannelObject(obj: any, id: string): Channel {
    return {
      chanId: id || '',
      channelName: obj.channelName || '',
      channelDescription: obj.channelDescription || '',
      allMembers: obj.allMembers || '',
      specificPeople: obj.specificPeople || [],
      createdAt: obj.createdAt || '',
      createdBy: obj.createdBy || '',
    };
  }

  addChannelToFirestore(channel: Channel) {
    const channelCollectionRef = collection(this.firestore, 'channels');
    const channelDocRef = doc(channelCollectionRef);
    channel.chanId = channelDocRef.id;
    setDoc(channelDocRef, channel);
  }

  getChannels() {
    return collection(this.firestore, 'channels');
  }

  openChatById(currentChannel: string) {

    this.currentChannel = currentChannel;
    const channelRef = doc(this.firestore, 'channels', currentChannel);
    this.unsubscribe = onSnapshot(channelRef, (doc) => {
      if (doc.exists()) {
        const channelData = doc.data() as Channel;
        this.currentChannelData = channelData;
      } else {
        console.log('No such document!');
      }
    });
    this.loadCurrentChatData(currentChannel)
    this.router.navigate(['start/main/chat/', currentChannel]);
  }

  loadCurrentChatData(currentChannel: string) {
    const channelDocRef = doc(this.firestore, 'channels', currentChannel);
    const messageRef = collection(channelDocRef, 'messages');

    this.unsub = onSnapshot(
      messageRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        this.answers = [];

        snapshot.forEach((doc) => {
          const messageData = doc.data() as Message;

          // Füge den timestamp von Firebase hinzu
          this.answers.push(messageData); // messageData enthält bereits den Timestamp

          // console.log('Received changes from DB', this.answers);
        });

        // Sortiere die Nachrichten nach dem Timestamp von Firebase
        this.answers.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      }
    );
  }

  async updateSpecificPeopleInChannelFromState() {
    if (!this.currentChannelData.chanId) {
      console.error('Kein Channel-Daten verfügbar!');
      return;
    }

    const channelId = this.currentChannelData.chanId;
    const channelRef = doc(this.firestore, 'channels', channelId); // Referenz zum Channel

    try {
      // Hole die aktuellen Daten des Channels mit getDoc()
      const docSnap = await getDoc(channelRef);
      if (docSnap.exists()) {
                // Setze den specificPeople-Array mit dem aktuellen User-Array aus dem StateControlService
        const updatedSpecificPeople = this.state.choosenUser; // Array aus dem Service
        // Aktualisiere den Channel mit dem neuen specificPeople-Array
        await updateDoc(channelRef, { specificPeople: updatedSpecificPeople });
        console.log('specificPeople erfolgreich überschrieben');
      } else {
        console.error('Channel nicht gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Überschreiben der specificPeople:', error);
    }
  }

}
