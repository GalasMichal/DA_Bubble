import { inject, Injectable, signal } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  addDoc,
  arrayUnion,
  DocumentData,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  where,
} from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { User as AppUser } from '../../models/interfaces/user.model';
import { Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { StateControlService } from '../state-control/state-control.service';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private firestore = inject(Firestore);
  state = inject(StateControlService);
  private router = inject(Router);
  public currentChannel: string = '';
  channelUnsubscribe: Unsubscribe | null = null;
  messageUnsubscribe: Unsubscribe | null = null;
  channelDataUnsubscribe: Unsubscribe | null = null;
  public userList: AppUser[] = [];
  public channelList: Channel[] = [];
  public currentUserChannels: Channel[] = [];
  public currentUserChannelsSpecificPeopleUid: string[] = [];
  public currentUserChannelsSpecificPeopleObject: AppUser[] = [];
  public currentChannelData!: Channel;
  public answers: Message[] = [];
  public messageAnswerList = signal<Message[]>([]);
  unsub: any;
  public currentMessageId: string | null = null;

  constructor() {}

  unsubscribe(subscription: Unsubscribe | null) {
    if (subscription) {
      subscription();
      subscription = null;
    }
  }

  unsubscribeAll() {
    this.unsubscribe(this.channelUnsubscribe);
    this.unsubscribe(this.messageUnsubscribe);
  }

  async addMessageToChannel(message: Message) {
    const messageId = await this.addDocumentToCollection(
      `channels/${this.currentChannelData.chanId}/messages`,
      message
    );
    this.currentMessageId = messageId;
    return messageId;
  }

  async updateMessageThreadId(messageId: string) {
    await this.updateDocument(
      `channels/${this.currentChannelData.chanId}/messages/${messageId}`,
      { threadId: messageId }
    );
  }

  addAnswerToMessage(messageId: string, answer: Message) {
    this.addDocumentToCollection(
      `channels/${this.currentChannelData.chanId}/messages/${messageId}/answers`,
      answer
    );
    this.currentMessageId = messageId;
    this.getAnswersFromMessage();
  }

  async updateMessageTextInFirestore(
    textAreaEdited: string,
    chanId: string,
    textAreaEditId: string
  ) {
    await this.updateDocument(`channels/${chanId}/messages/${textAreaEditId}`, {
      text: textAreaEdited,
      lastEdit: Timestamp.now(),
      editCount: 1,
    });
  }

  async getAnswersFromMessage() {
    if (this.currentMessageId) {
      const newAnswers = await this.getDocumentsFromCollection(
        `channels/${this.currentChannelData.chanId}/messages/${this.currentMessageId}/answers`
      );
      this.messageAnswerList.set(newAnswers);
    }
  }

  subChannelList() {
    this.unsubscribe(this.channelUnsubscribe);
    this.channelUnsubscribe = onSnapshot(this.getChannels(), (list) => {
      this.channelList = list.docs.map((doc) => doc.data() as Channel);
    });
  }

  addChannelToFirestore(channel: Channel) {
    const channelDocRef = doc(collection(this.firestore, 'channels'));
    channel.chanId = channelDocRef.id;
    setDoc(channelDocRef, channel);
  }

  getChannels() {
    return collection(this.firestore, 'channels');
  }

  async openChatById(currentChannel: string) {
    await this.loadSpecificPeopleFromChannel();
    this.currentChannel = currentChannel;
    const channelRef = doc(this.firestore, 'channels', currentChannel);
    this.unsubscribe(this.channelDataUnsubscribe);
    this.channelDataUnsubscribe = onSnapshot(channelRef, (doc) => {
      if (doc.exists()) {
        this.currentChannelData = doc.data() as Channel;
        this.currentUserChannelsSpecificPeopleUid =
          this.currentChannelData.specificPeople || [];
      }
    });
    this.loadCurrentChatData(currentChannel);
    this.router.navigate(['main/chat/', currentChannel]);
  }

  loadCurrentChatData(currentChannel: string) {
    const messageRef = collection(
      doc(this.firestore, 'channels', currentChannel),
      'messages'
    );
    this.unsubscribe(this.messageUnsubscribe);
    this.messageUnsubscribe = onSnapshot(
      messageRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        this.answers = snapshot.docs.map((doc) => doc.data() as Message);
        this.answers.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      }
    );
  }

  async updateSpecificPeopleInChannelFromState() {
    if (!this.currentChannelData.chanId) {
      console.error('Kein Channel-Daten verfügbar!');
      return;
    }
    await this.updateDocument(`channels/${this.currentChannelData.chanId}`, {
      specificPeople: this.state.choosenUserFirebase,
    });
  }

  async addNewUserToChannel(channelName: string, newUserId: string) {
    await this.updateDocument(`channels/${channelName}`, {
      specificPeople: arrayUnion(newUserId),
    });
  }

  async getUserChannels(currentUserId: string): Promise<Channel[]> {
    const q = query(
      collection(this.firestore, 'channels'),
      where('specificPeople', 'array-contains', currentUserId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Channel);
  }

  async loadSpecificPeopleFromChannel() {
    if (this.currentUserChannelsSpecificPeopleUid.length === 0) return;
    const q = query(
      collection(this.firestore, 'users'),
      where('uId', 'in', this.currentUserChannelsSpecificPeopleUid)
    );
    const querySnapshot = await getDocs(q);
    this.currentUserChannelsSpecificPeopleObject = querySnapshot.docs.map(
      (doc) => doc.data() as AppUser
    );
  }

  private async addDocumentToCollection(
    collectionPath: string,
    data: any
  ): Promise<string> {
    const docRef = await addDoc(
      collection(this.firestore, collectionPath),
      data
    );
    return docRef.id;
  }

  private async updateDocument(docPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await updateDoc(docRef, data);
  }

  private async getDocumentsFromCollection(
    collectionPath: string
  ): Promise<any[]> {
    const querySnapshot = await getDocs(
      collection(this.firestore, collectionPath)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }
}
