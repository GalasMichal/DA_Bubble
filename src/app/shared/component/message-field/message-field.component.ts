import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Message } from '../../../models/interfaces/message.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { CloseComponent } from '../close/close.component';
import { MessageService } from '../../../services/messages/message.service';
import { StorageService } from '../../../services/storage/storage.service';
import { AvatarComponent } from '../../avatar/avatar.component';
import { User } from '../../../models/interfaces/user.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-message-field',
  standalone: true,
  imports: [
    FormsModule,
    PickerComponent,
    CommonModule,
    CloseComponent,
    AvatarComponent,
  ],
  templateUrl: './message-field.component.html',
  styleUrl: './message-field.component.scss',
})
export class MessageFieldComponent {
  chat = inject(ChatRoomService);
  stateControl = inject(StateControlService);
  fb = inject(FirebaseService);
  userService = inject(UserServiceService);
  msg = inject(MessageService);
  storageService = inject(StorageService); // StorageService injizieren
  textArea: string = ''; // Initialisierung als leerer String
  isEmojiPickerVisible: boolean = false;
  selectedFile: File | null = null; // Für den Dateiupload
  currentChannel = computed(() => this.chat.currentChannelSignal());
  isUsersPickerVisible: boolean = false;

  @Input() isThreadAnswerOpen = false;
  @Input() textAreaEdit: string = '';
  @Input() channelIdEdit: string = '';
  @Input() textAreaEditId: string = '';
  @Input() textAreaIsEdited: boolean = false;
  @Output() editStatusChange = new EventEmitter<boolean>();
  @Input() directMessage: boolean = false;
  selectedMessage = computed(() => this.userService.selectedUserMessage());
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['textAreaEdit'] &&
      changes['textAreaEdit'].currentValue !== undefined
    ) {
      this.textArea = changes['textAreaEdit'].currentValue || ''; // Sicherstellen, dass textArea nie null ist
    }
  }

  async sendMessage() {
    this.stateControl.scrollToBottomGlobal = true; //scroll to bottom
    const currentUser = this.fb.currentUser();

    if (this.textAreaIsEdited && this.textArea !== '') {
      this.chat.updateMessageTextInFirestore(
        this.textArea,
        this.channelIdEdit,
        this.textAreaEditId
      );
      this.textArea = '';
      this.textAreaIsEdited = false;
      this.stateControl.globalEdit = false;
      return;
    }

    this.textArea = this.textArea || ''; // Falls textArea null ist, wird sie auf einen leeren String gesetzt

    if (currentUser) {
      const currentChannel = this.currentChannel();
      if (!currentChannel) {
        console.error('Kein Channel ausgewählt!');
        return;
      }
      let newMessage: Message = {
        text: this.textArea,
        chatId: currentChannel.chanId,
        timestamp: Timestamp.now(),
        messageSendBy: currentUser,
        reactions: [],
        threadId: '',
        answerCount: 0,
        lastAnswer: '',
        editCount: 0,
        lastEdit: Timestamp.now(),
        storageData: '',
        taggedUser: [],
        answers: [],
      };

      if (this.textArea !== '' || this.selectedFile) {
        if (this.selectedFile) {
          const imageUrl = await this.uploadChatImage(
            this.currentChannel()!.chanId,
            this.selectedFile
          );
          newMessage.storageData = imageUrl; // URL des Bildes speichern
          this.storageService.uploadMsg.set(''); // Signal zurücksetzen
        }

        if (this.isThreadAnswerOpen) {
          const selectedMessage = this.selectedMessage();
          if (selectedMessage) {
            selectedMessage.answers.push(newMessage);
            this.textArea = '';
            this.chat.updateMessage(selectedMessage.chatId, selectedMessage);
          }
        } else {
          this.textArea = '';
          const messageDocRef = this.currentChannel()!.chanId;
          // Die Methode updateMessageThreadId wird jetzt aufgerufen
          await this.chat.createMessage(messageDocRef, newMessage);
        }
      }
    }
  }
  
  async sendDirectMessage() {
    debugger
    this.stateControl.scrollToBottomGlobal = false;
    let collRef = await this.msg.newPrivateMessageChannel(
      this.userService.messageReceiver!
    );
    if (collRef) {
      const newMessage: Message = {
        text: this.textArea,
        chatId: collRef,
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
        answers: [],
      };

      if (this.textArea.trim() !== '' || this.selectedFile) {
        if (this.selectedFile) {
          const imageUrl = await this.uploadDirectMessageImage(
            collRef,
            this.selectedFile
          );
          newMessage.storageData = imageUrl;
          this.storageService.uploadMsg.set('');
        }

        await this.msg.addMessageToSubcollection(collRef, newMessage);
        await this.msg.loadMessagesFromChat(collRef);
        this.textArea = ''; // Leere das Eingabefeld nach dem Senden
      }
    }
  }

  async uploadChatImage(chatId: string, file: File): Promise<string> {
    return this.storageService.uploadFileToStorage('chats', chatId, file);
  }

  async uploadDirectMessageImage(
    directMessageId: string,
    file: File
  ): Promise<string> {
    return this.storageService.uploadFileToStorage(
      'directMessages',
      directMessageId,
      file
    );
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.storageService.generatePreview(this.selectedFile); // Vorschau generieren
    }
  }

  deleteFileInput() {
    this.storageService.uploadMsg.set('')
  }

  addEmoji(event: any) {
    this.stateControl.scrollToBottomGlobal = false;
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  showEmojiWindow() {
    this.stateControl.scrollToBottomGlobal = false;
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  closeEmojiWindow() {
    this.isEmojiPickerVisible = false;
  }

  closeUserWindow() {
    this.isUsersPickerVisible = false;
  }

  showUserWindow() {
    this.textArea += `@`;
    this.isUsersPickerVisible = !this.isUsersPickerVisible;
  }

  closeEdit() {
    this.stateControl.globalEdit = false;
    this.textArea = '';
    this.textAreaIsEdited = false;
  }
  
  handleKeyUp(textArea: string) {
    if (/@\S*$/g.test(textArea)) {
      this.isUsersPickerVisible = true;
    } else {
      this.isUsersPickerVisible = false;
    }
  }

  addUserToMessage(displayName: string) {
    this.textArea += `${displayName.trim()} `;
    this.isUsersPickerVisible = false;
  }

  sortListOfUser(): User[] {
    const sortAllUser = [...this.userService.userList];
    sortAllUser.sort((a, b) => {
      if (a.uId === this.fb.currentUser()?.uId) return -1;
      if (b.uId === this.fb.currentUser()?.uId) return 1;

      return a.displayName.localeCompare(b.displayName);
    });
    return sortAllUser;
  }
}
