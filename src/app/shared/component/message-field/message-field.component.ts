import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Message } from '../../../models/interfaces/message.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { Timestamp } from '@angular/fire/firestore';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { CloseComponent } from '../close/close.component';
import { MessageService } from '../../../services/messages/message.service';


@Component({
  selector: 'app-message-field',
  standalone: true,
  imports: [
    FormsModule,
    PickerComponent,
    CommonModule,
    CloseComponent
  ],
  templateUrl: './message-field.component.html',
  styleUrl: './message-field.component.scss',
})
export class MessageFieldComponent {
  chat = inject(ChatRoomService);
  stateControl = inject(StateControlService)
  fb = inject(FirebaseService);
  user = inject(UserServiceService);
  msg = inject(MessageService);
  textArea: string = '';
  isEmojiPickerVisible: boolean = false;

  @Input() isThreadAnswerOpen = false;
  @Input() textAreaEdit: string = '';
  @Input() channelIdEdit: string = '';
  @Input() textAreaEditId: string = '';
  @Input() textAreaIsEdited: boolean = false;
  @Output() editStatusChange = new EventEmitter<boolean>();
  @Input() directMessage: boolean = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textAreaEdit'] && changes['textAreaEdit'].currentValue !== undefined) {
      this.textArea = changes['textAreaEdit'].currentValue;
    }
  }

  async sendMessage() {
    console.log(this.textAreaIsEdited);

    const currentUser = this.fb.currentUser();

    if(this.textAreaIsEdited && this.textArea !== '') {
      this.chat.updateMessageTextInFirestore(this.textArea, this.channelIdEdit, this.textAreaEditId)
      this.textArea = '';
      this.textAreaIsEdited = false;
      this.stateControl.globalEdit = false
      return
    }
    if(currentUser){
      console.log(this.chat.answers);

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
        lastEdit: Timestamp.now(),
        storageData: '',
        taggedUser: [],
      };

      if(this.textArea !== "") {
        if(this.isThreadAnswerOpen) {
          const selectedMessage = this.user.selectedUserMessage();
          if(selectedMessage) {
            this.textArea = '';

              this.chat.addAnswerToMessage(selectedMessage.threadId, newMessage);
            }
          }else {
            this.textArea = '';
            const messageDocRef = await this.chat.addMessageToChannel(newMessage);
            await this.chat.updateMessageThreadId(messageDocRef);
          // Leere das Eingabefeld nach dem Senden
        }
      }
    }
  }

  closeEdit() {
    this.stateControl.globalEdit = false
    this.textArea = ""
    this.textAreaIsEdited = false;
  }

 async sendDirectMessage() {
 let collRef = await this.msg.newPrivateMessageChannel(this.user.messageReceiver!);
    const newMessage: Message = {
      text: this.textArea,
      chatId: '',
      timestamp: Timestamp.now(),
      messageSendBy: this.fb.currentUser()!,
      reactions: [],
      threadId: '',
      answerCount: 0,
      lastAnswer: '',
      editCount: 0,
      lastEdit: Timestamp.now(),
      storageData: '',
      taggedUser: [],
    };
    if (this.textArea.trim() !== '') {
      await this.msg.addMessageToSubcollection(collRef.id, newMessage);
      await this.msg.loadMessagesFromChat(collRef.id);
      this.textArea = ''; // Leere das Eingabefeld nach dem Senden
    }

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
