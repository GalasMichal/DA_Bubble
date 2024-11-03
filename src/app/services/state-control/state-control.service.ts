import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  isThreadOpen = false;
  showToast: boolean = false;
  showArrow: boolean = false
  showToastText: string = ''
  choosenUser: { userName: string; uId: string }[] = [];
  showMainContent: boolean = false;

  removeShowToast() {
    setTimeout(() => {
    this.showToast = false
    this.showArrow = false
    }, 2000);
  }

  constructor() {
   }
}
