import { Injectable, signal } from '@angular/core';
import { User } from '../../models/interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  // Without this variable you will see specific user when you want to create new channel
  createChannelActiveInput = true;
  isThreadOpen = false;
  showToast = false;
  showArrow = false;
  showToastText = signal('');
  showConfirmationText = signal('');
  choosenUser: User[] = [];
  isUserLoggedIn = false;
  showError = false;
  responsiveChat = false;
  responsiveArrow = false;
  responsiveMenu = false;
  messageImage: string | undefined = "";
  scrollToBottomGlobal = true;
  isMenuOpen = true;
  isSendButtonActive = true;
  isDirectMessage = false;
  editDirectMessage = false;
  editChannelMessage = false;
  globalEditModul = false;

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
