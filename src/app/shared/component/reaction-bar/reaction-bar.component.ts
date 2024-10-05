import { Component, ElementRef, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { MessageEditComponent } from '../message-edit/message-edit.component';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [MessageEditComponent, CommonModule, EmojiComponent, PickerComponent],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent {
  state = inject(StateControlService)
  showCloud:boolean = false 
  @Input() index: number = 0;
  isEmojiPickerVisibleMessage: boolean[] = [false];

  constructor() {
    console.log(this.isEmojiPickerVisibleMessage);
    
  }

  showEmojiWindow(index: number) {
    console.log(this.isEmojiPickerVisibleMessage[index]);
    
    this.isEmojiPickerVisibleMessage[index] = !this.isEmojiPickerVisibleMessage[index]
  }

  confirmMessage() {
    console.log('confirmMessage()', this.index);
  }

  handsUp() {
    console.log('handsUp()', this.index);
  }


  addEmoji(event: any) {
    //   // this.server.textArea = `${this.server.textArea}${event.emoji.native}`;
    //   this.isEmojiPickerVisibleMessage = false;
    }

  sendPrivateMessage(){
    console.log('sendPrivateMessage()', this.index);
  }

  showEditCloud() {
      this.showCloud = !this.showCloud
  }
}
