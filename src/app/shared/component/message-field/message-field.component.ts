import { Component, inject, Input } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Message } from '../../../models/interfaces/message.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-message-field',
  standalone: true,
  imports: [
    FormsModule,
    PickerComponent,
    CommonModule,
  ],
  templateUrl: './message-field.component.html',
  styleUrl: './message-field.component.scss',
})
export class MessageFieldComponent {
  chat = inject(ChatRoomService);
  fb = inject(FirebaseService);
  textArea: string = '';
  isEmojiPickerVisible: boolean = false;
  currentChannelId = this.chat.currentChannelData.chanId
  @Input() isThreadAnswerOpen = false;

  async sendMessage() {

    const currentUser = this.fb.currentUser();
    if(currentUser){
      const newMessage: Message = {
        text: this.textArea,
        chatId: this.currentChannelId,
        timestamp: Timestamp.now(),
        messageSendBy: currentUser, // Hier den aktuellen Benutzer dynamisch setzen
        reactions: [],
        threadId: '',
        answerCount: 0,
        lastAnswer: '',
        editCount: 0,
        lastEdit: '',
        storageData: '',
        taggedUser: [],
      };
      if(this.textArea !== "") {
        if(this.isThreadAnswerOpen) {

        }else {
          const messageDocRef = await this.chat.addMessageToChannel(newMessage);
          await this.chat.updateMessageThreadId(messageDocRef);
          // Leere das Eingabefeld nach dem Senden
        }
        this.textArea = ''; 
      }
    }
  }

  addEmoji(event: any) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
    console.log('TEST');

  }

  showEmojiWindow() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  closeEmojiWindow() {
    this.isEmojiPickerVisible = false;
  }
}
