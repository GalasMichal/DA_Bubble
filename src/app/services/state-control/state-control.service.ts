import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  isThreadOpen = false;
  showSuccess: boolean = false;
  showArrow: boolean = false
  showSuccessText: string = ''
  choosenUser: { userName: string; uId: string }[] = [];
  showMainContent: boolean = true;

  removeShowSuccess() {
    setTimeout(() => {
    this.showSuccess = false
    this.showArrow = false
    }, 2000);
  }

  constructor() {
   }
}
