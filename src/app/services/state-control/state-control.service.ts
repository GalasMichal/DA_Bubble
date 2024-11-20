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
  showConfirmationText: string = '';
  choosenUser: User[] = [];
  isUserLoggedIn: boolean = false;
  showError: boolean = false
  saveGlobaPassword: string = ''

  removeShowToast() {
    setTimeout(() => {
    this.showToast = false
    this.showArrow = false
    this.showError = false;
    this.showToastText = ""
    }, 2000);
  }

  constructor() {
   }
}
