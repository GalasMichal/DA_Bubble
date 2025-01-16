import { Injectable, signal } from '@angular/core';
import { User } from '../../models/interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  // Without this variable you will see specific user when you want to create new channel
  createChannelActiveInput: boolean = true;
  isThreadOpen:boolean = false;
  showToast: boolean = false;
  showArrow: boolean = false;
  showToastText = signal('');
  showConfirmationText: string = '';
  choosenUser: User[] = [];
  choosenUserFirbase: string[] = [];
  isUserLoggedIn: boolean = false;
  showError: boolean = false;
  globalEdit: boolean = false;
  responsiveChat: boolean = false;
  responsiveArrow: boolean = false;
  responsiveMenu: boolean = false;
  messageImage: string = "";
  scrollToBottomGlobal: boolean = true;

  removeShowToast() {
    setTimeout(() => {
    this.showToast = false;
    this.showArrow = false;
    this.showError = false;
    this.showToastText.set('');
    }, 2000);
  }

  constructor() {
   }
}
