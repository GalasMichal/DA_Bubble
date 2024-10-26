import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  isThreadOpen = false;
  showSuccess: boolean = false;
  showSuccessText: string = ''
  choosenUser: { userName: string; uId: string }[] = [];

  removeShowSuccess() {
    setTimeout(() => {
    this.showSuccess = false
    }, 2000);
  }

  constructor() {
   }
}
