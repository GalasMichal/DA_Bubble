import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { User as AppUser } from '../../models/interfaces/user.model';
import { Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { addDoc } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private firestore = inject(Firestore);
  private router = inject(Router);
  public currentChannel: string = '';
  public unsubscribe: any;
  public userList: AppUser[] = [];
  public channelList: Channel[] = [];
  public currentChannelData!: Channel;
  public answers: Message[] = [];
  private messagesSubject = new Subject<Message[]>();

  constructor() {}

  async addMessageToChannel(message: Message) {
    const channelId = this.currentChannelData.chanId;
    const channelCollectionRef = collection(this.firestore, 'channels', channelId, 'messages');
    const messageDocRef = await addDoc(channelCollectionRef, message);
    console.log('Message verschickt', message);
    return messageDocRef.id; // Rückgabe der generierten Message-ID
  }

  async updateMessageThreadId(messageId: string) {
    const channelId = this.currentChannelData.chanId;
    const messageDocRef = doc(this.firestore, 'channels', channelId, 'messages', messageId);

    // Aktualisiere das Dokument mit der Firestore-generierten ID als threadId
    await updateDoc(messageDocRef, { threadId: messageId });
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
    const channelRef = doc(this.firestore, 'channels', currentChannel);
    this.unsubscribe = onSnapshot(channelRef, (doc) => {
      if (doc.exists()) {
        const channelData = doc.data() as Channel;
        this.currentChannelData = channelData;
        this.router.navigate(['start/main/chat/', currentChannel]);
      } else {
        console.log('No such document!');
      }
    });
  }

  loadCurrentChatData(currentChannel: string) {
    // Erstelle die Dokumentreferenz für den aktuellen Kanal
    const channelDocRef = doc(this.firestore, 'channels', currentChannel);

    // Erstelle die Referenz zur 'messages'-Sammlung in diesem Kanal-Dokument
    const messageRef = collection(channelDocRef, 'messages');

    onSnapshot(messageRef, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data() as Message;
        messages.push({ ...messageData, messageId: doc.id });
      });

      // Benachrichtige die Subscriber über neue Nachrichten
      this.messagesSubject.next(messages);
    });
  }

  // Observable, um auf die geladenen Nachrichten zuzugreifen
  get messages$(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }}
