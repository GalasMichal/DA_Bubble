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

 async newPrivateMessage(User: User) {
  const channelCollectionRef = collection(this.db.firestore, 'privateMessages');
  const channelDocRef = doc(channelCollectionRef);
  const privateChat = this.setPrivateObject(channelDocRef, User);

  await setDoc(channelDocRef, privateChat);
 }


  setPrivateObject(obj: any, user: User) {
      const privateChat: PrivateChat = {
       privatChatId: obj.id,
       chatCreator: this.db.currentUser()!.uId,
       chatReciver: user.uId
     };
     return privateChat;
   }

}


