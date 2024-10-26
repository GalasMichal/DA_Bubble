import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { collection, doc, setDoc } from '@angular/fire/firestore';
import { PrivateChat } from '../../models/interfaces/privateChat.class';
import { UserServiceService } from '../user-service/user-service.service';
import { User } from '../../models/interfaces/user.model';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  db = inject(FirebaseService)
  user = inject(UserServiceService)

 async newPrivateMessage(privateChat: PrivateChat, user: User) {
  const channelCollectionRef = collection(this.db.firestore, 'privateMessages');
  const channelDocRef = doc(channelCollectionRef);
  privateChat.privatChatId = channelDocRef.id;
  privateChat.chatCreator = this.db.currentUser()!.uId;
  privateChat.chatReciver = user.uId;
  await setDoc(channelDocRef, privateChat);
 }

  constructor() { }


}


