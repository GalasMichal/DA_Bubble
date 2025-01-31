import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import {
  addDoc,
  collection,
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
import { Message } from '../../models/interfaces/message.model';


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
  messages: Message[] = [];

  async newPrivateMessageChannel(user: User) {
    const existingChatId = await this.checkPrivateChatExists(user.uId);
    if (existingChatId) {
      this.currentMessageId = existingChatId;
      await this.loadCurrentMessageData();
      this.router.navigate(['main/messages/', existingChatId]);
      return existingChatId;
    }

    // Neuen Chat erstellen, wenn keiner existiert
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

  async addMessageToSubcollection(chatId: string, message: Message) {
    if (!chatId) {
      throw new Error('chatId is required to add a message.');
    } else {
      const messagesCollectionRef = collection(
        this.db.firestore,
        `privateMessages/${chatId}/messages`
      );

      await addDoc(messagesCollectionRef, message);
    }
  }
  async loadCurrentMessageData() {

    const docRef = doc(this.db.firestore, 'privateMessages', this.currentMessageId);
    this.unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const messageData = doc.data() as PrivateChat;
        this.currentMessageData = messageData;
      } else {
        console.log('No such document!');
      }
    });
  }


  /**
   * Lädt alle Nachrichten einer bestimmten Chat-Subcollection.
   * @param chatId Die ID des privaten Chats.
   * @returns Ein Promise mit einer Liste von Nachrichten.
   */
   unsubscribeMessages: (() => void) | null = null;

  async loadMessagesFromChat(chatId: string) {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages(); // Vorherigen Listener entfernen
    }

    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );

    const messagesQuery = query(
      messagesCollectionRef,
      orderBy('timestamp', 'asc')
    );

    this.unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
      this.messages = []; // Nachrichtenliste zurücksetzen
      querySnapshot.forEach((doc) => {
        const message = doc.data() as Message;
        this.messages.push(message);
      });
      console.log('Received changes from DB', this.messages);
    });
  }

  setPrivateObject(obj: any, uId: string) {
    const privateChat: PrivateChat = {
      privatChatId: obj.id,
      chatCreator: this.db.currentUser()!.uId,
      chatReciver: uId,
    };
    return privateChat;
  }

  async checkPrivateChatExists(uId: string): Promise<string | null> {
    const chatCreator = this.db.currentUser()!.uId; // Aktueller Benutzer
    const privateChatCollection = collection(
      this.db.firestore,
      'privateMessages'
    ); // Collection-Name

    // Query 1: chatCreator ist der aktuelle Benutzer und chatReciver ist der andere Benutzer
    const q1 = query(
      privateChatCollection,
      where('chatCreator', '==', chatCreator),
      where('chatReciver', '==', uId)
    );

    // Query 2: chatCreator ist der andere Benutzer und chatReciver ist der aktuelle Benutzer
    const q2 = query(
      privateChatCollection,
      where('chatCreator', '==', uId),
      where('chatReciver', '==', chatCreator)
    );

    // Beide Queries ausführen
    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
    ]);

    // Prüfen, ob ein Dokument in einer der beiden Queries gefunden wurde
    if (!querySnapshot1.empty) {
      return querySnapshot1.docs[0].id; // ID des ersten Dokuments aus Query 1
    }
    if (!querySnapshot2.empty) {
      return querySnapshot2.docs[0].id; // ID des ersten Dokuments aus Query 2
    }

    // Wenn kein Dokument gefunden wurde, gib `null` zurück
    return null;
  }
}
