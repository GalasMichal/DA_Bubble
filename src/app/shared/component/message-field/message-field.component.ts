import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Message } from '../../../models/interfaces/message.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { Timestamp } from '@angular/fire/firestore';
import { UserServiceService } from '../../../services/user-service/user-service.service';

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
  user = inject(UserServiceService);
  textArea: string = '';
  isEmojiPickerVisible: boolean = false;
  @Input() isThreadAnswerOpen = false;
  @Input() textAreaEdit: string = '';
  @Input() textAreaEditId: string = '';
  @Input() textAreaIsEdited: boolean = false
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textAreaEdit'] && changes['textAreaEdit'].currentValue !== undefined) {
      this.textArea = changes['textAreaEdit'].currentValue;
    }
  }

  async sendMessage() {
    
    const currentUser = this.fb.currentUser();
    if(this.textAreaIsEdited) {
      console.log('Test');
    }
    if(currentUser){
      const newMessage: Message = {
        text: this.textArea,
        chatId: this.chat.currentChannelData.chanId,
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
          const selectedMessage = this.user.selectedUserMessage();
          if(selectedMessage) {
              this.chat.addAnswerToMessage(selectedMessage.threadId, newMessage);
          }
        }else {
          const messageDocRef = await this.chat.addMessageToChannel(newMessage);
          await this.chat.updateMessageThreadId(messageDocRef);
          // Leere das Eingabefeld nach dem Senden
        }
        this.textArea = '';
      }
    }
    this.textAreaIsEdited = false;
  }

  addEmoji(event: any) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  showEmojiWindow() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  closeEmojiWindow() {
    this.isEmojiPickerVisible = false;
  }
}
