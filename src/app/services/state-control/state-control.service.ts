import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  isThreadOpen = false;
  isEmojiPickerVisible: boolean = false
  textArea: string = "";
  isEmojiPickerVisibleMessage:boolean = false

  constructor() {
   }
}
