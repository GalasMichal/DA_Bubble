import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
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

  currentMessageId: string = '';
  currentMessageData!: PrivateChat;
  unsubscribe: any;

  async newPrivateMessageChannel(User: User) {
    const channelCollectionRef = collection(
      this.db.firestore,
      'privateMessages'
    );
    const channelDocRef = doc(channelCollectionRef);
    const privateChat = this.setPrivateObject(channelDocRef, User.uId);
    await setDoc(channelDocRef, privateChat);

    this.currentMessageId = channelDocRef.id;
    await this.loadCurrentMessageData();
    this.router.navigate(['start/main/messages/', channelDocRef.id]);
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

  setPrivateObject(obj: any, uId: string) {
    const privateChat: PrivateChat = {
      privatChatId: obj.id,
      chatCreator: this.db.currentUser()!.uId,
      chatReciver: uId,
    };
    return privateChat;
  }
}
