import { Injectable } from '@angular/core';
import { User } from '../../models/interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  isThreadOpen = false;
  showToast: boolean = false;
  showArrow: boolean = false;
  showToastText: string = '';
  choosenUser: User[] = [];
  showMainContent: boolean = true;

  removeShowToast() {
    setTimeout(() => {
    this.showToast = false
    this.showArrow = false
    }, 2000);
  }

  constructor() {
   }
}
