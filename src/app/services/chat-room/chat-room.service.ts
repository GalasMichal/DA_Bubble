import { inject, Injectable, signal } from '@angular/core';
import { collection, doc, DocumentData, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Channel } from '../../models/interfaces/channel.model';
import { User as AppUser } from '../../models/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  firestore = inject(Firestore);
  currentChannel:string = '';
  unsubscribe: any;
  public userList: AppUser[] = [];
  public channelList: Channel[] = [];
  currentChannelData!: Channel;
  constructor() {}


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

    subUserList() {
      // return onSnapshot(this.getUsers(), (list) => {
      //   this.userList = [];
      //   list.forEach((element) => {
      //     const userData = element.data();
      //     const userId = element.id;
      //     const userObject = this.setUserObject(userData, userId);
      //     this.userList.push(userObject);
      //   });
      // });
    }

    setUserObject(obj: any, id: string): AppUser {
      return {
        status: obj.status || false,
        channels: obj.channels || [],
        uId: id || '',
        email: obj.email || '',
        displayName: obj.displayName || '',
        avatarUrl: obj.avatarUrl || '',
        birthdate: obj.birthdate || '',
      };
    }

    setChannelObject(obj: any, id: string): Channel {
      return {
        chanId: id || '',
        channelName: obj.channelName || '',
        channelDescription: obj.channelDescription || '',
        allMembers: obj.allMembers || '',
        specificPeople: obj.specificPeople || [],
        createdAt: obj.createdAt || '',
        createdBy: obj.createdBy || ''
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

        this.currentChannelData = channelData
        console.log('channelData', channelData);
      } else {
        console.log('No such document!');
      }
    })
  }
}
