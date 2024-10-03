import { Component, inject, Input } from '@angular/core';
import { MessageEditComponent } from '../message-edit/message-edit.component';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { StateControlService } from '../../../services/state-control/state-control.service';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [MessageEditComponent, CommonModule, EmojiComponent],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent {
  server = inject(StateControlService)
  showCloud:boolean = false 
  @Input() index: number = 0;

  confirmMessage() {
    console.log('confirmMessage()', this.index);
  }

  handsUp() {
    console.log('handsUp()', this.index);
  }

  showEmojiWindow() {
    this.server.isEmojiPickerVisibleMessage = !this.server.isEmojiPickerVisibleMessage;
  }

  sendPrivateMessage(){
    console.log('sendPrivateMessage()', this.index);
  }

  showEditCloud() {
      this.showCloud = !this.showCloud
  }
}
