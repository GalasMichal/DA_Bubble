import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { User as AppUser } from '../../models/interfaces/user.model';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  firestore = inject(Firestore);
  unsubscribe: any;
  public userList: AppUser[] = [];


  constructor() { }

  subUserList() {
    this.unsubscribe = onSnapshot(this.getUsers(), (list) => {
      this.userList = [];
      list.forEach((element) => {
        const userData = element.data();
        const userId = element.id;
        const userObject = this.setUserObject(userData, userId);
        this.userList.push(userObject);
      });
    });
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

  getUsers() {
    return collection(this.firestore, 'users');
  }

}
