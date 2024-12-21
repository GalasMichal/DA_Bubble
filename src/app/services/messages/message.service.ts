import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import {
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
import { log } from 'console';

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
    const channelCollectionRef = collection(
      this.db.firestore,
      'privateMessages'
    );
    const channelDocRef = doc(channelCollectionRef);

    const privateChat = this.setPrivateObject(channelDocRef, user.uId);
    await setDoc(channelDocRef, privateChat);

    this.currentMessageId = channelDocRef.id;
    await this.loadCurrentMessageData();
    this.router.navigate(['start/main/messages/', channelDocRef.id]);
    this.currentMessageChannelId = channelDocRef.id;
    return channelDocRef; // Gibt die Referenz des erstellten Dokuments zurück
  }

  async addMessageToSubcollection(chatId: string, message: Message) {
    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );
    const messageDocRef = doc(messagesCollectionRef);
    await setDoc(messageDocRef, message);
  }

  async loadCurrentMessageData() {
    const docRef = doc(
      this.db.firestore,
      'privateMessages',
      this.currentMessageId
    );
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
  async loadMessagesFromChat(chatId: string): Promise<Message[]> {
    const messagesCollectionRef = collection(
      this.db.firestore,
      `privateMessages/${chatId}/messages`
    );

    const messagesQuery = query(
      messagesCollectionRef,
      orderBy('timestamp', 'asc')
    ); // Chronologisch sortiert
    const querySnapshot = await getDocs(messagesQuery);

    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data() as Message;
      messages.push(message);
      console.log('Received changes from DB', messages);
    });

    return messages;
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

    // Query erstellen, um Dokumente zu finden, die chatCreator und chatReciver entsprechen
    const q = query(
      privateChatCollection,
      where('chatCreator', '==', chatCreator),
      where('chatReciver', '==', uId)
    );

    const querySnapshot = await getDocs(q);

    // Wenn ein Dokument gefunden wird, gib die ID zurück
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Erstes Dokument
      return doc.id; // Dokument-ID
    }

    // Wenn kein Dokument gefunden wird, gib `null` zurück
    return null;
  }
}
