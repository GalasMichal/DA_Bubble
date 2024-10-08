import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Message } from '../../../models/interfaces/message.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';


@Component({
  selector: 'app-message-field',
  standalone: true,
  imports: [FormsModule, HeaderComponent, PickerComponent, CommonModule, EmojiComponent, ],
  templateUrl: './message-field.component.html',
  styleUrl: './message-field.component.scss'
})
export class MessageFieldComponent {
  chat = inject(ChatRoomService)
  fb = inject(FirebaseService)
  textArea: string = "";
  isEmojiPickerVisible: boolean = false




    sendMessage() {
      const currentUser = this.fb.currentUser();
      const newMessage: Message = {

        text: this.textArea,
        chatId: this.chat.currentChannelData.chanId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        messageSendBy: currentUser!.uId, // Hier den aktuellen Benutzer dynamisch setzen
        reactions: [],
        threadId: '',
        answerCount: 0,
        lastAnswer: '',
        editCount: 0,
        lastEdit: '',
        storageData: '',
        taggedUser: []
      };

      this.chat.addMessageToChannel(newMessage)
        this.textArea = ''; // Leere das Eingabefeld nach dem Senden

    }





  addEmoji(event: any) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

    showEmojiWindow() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  closeEmojiWindow() {
    this.isEmojiPickerVisible = false
  }

}
