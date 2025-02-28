import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
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
  storageService = inject(StorageService);

  textArea: string = '';
  isEmojiPickerVisible: boolean = false;
  selectedFile: File | null = null;
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
  editMessage = false;
  editedMessageObject: Message | null = null;
  /**
   * Constructor initializes the MessageFieldComponent.
   * Sets up a reactive effect to update the textArea with the text
   * of the current message being edited, if available.
   */
  constructor() {
    effect(() => {
      const message = this.msg.currentMessageToEdit();
      if (message) {
        this.textArea = message.text;
        this.editedMessageObject = message;
        this.editMessage = true;
      }
    });
  }

  /**
   * Resets the message input to its initial state.
   * Clears the textArea and sets textAreaIsEdited to false.
   * Also sets stateControl.globalEdit to false.
   */
  resetMessageInput() {
    this.textArea = '';
    this.textAreaIsEdited = false;
    this.stateControl.globalEdit = false;
  }

  /**
   * Sends a message based on the current state of the text area.
   * If the message is being edited and the text is not empty, updates the existing message.
   * Otherwise, processes the message as a new message.
   * Also ensures the chat view scrolls to the bottom.
   */

  async sendMessage() {
    this.stateControl.scrollToBottomGlobal = true;
    if (this.editMessage && this.textArea !== '' && this.editedMessageObject) {
      await this.chat.updateMessageTextInFirestore(
        this.textArea,
        this.editedMessageObject.chatId,
        this.editedMessageObject.messageId! // Stelle sicher, dass messageId existiert
      );
      this.resetMessageInput();
      return;
    }
    this.processNewMessage();
  }

  /**
   * Processes a new message based on the current state of the message field.
   * Creates a new message with the current channel ID and the current user's ID.
   * If a file has been selected, uploads the file to the firestore storage and adds the download URL to the message.
   * If the thread answer menu is open, adds the message to the thread.
   * Otherwise, creates a new message in the current channel.
   * Also clears the message input field.
   */

  private async processNewMessage() {
    const currentUser = this.fb.currentUser();
    if (!currentUser || !this.currentChannel()) return;
    let newMessage = this.createMessage(this.currentChannel()!.chanId);
    if (this.selectedFile) {
      newMessage.storageData = await this.uploadChatImage(
        this.currentChannel()!.chanId,
        this.selectedFile
      );
      this.storageService.uploadMsg.set('');
    }
    if (this.isThreadAnswerOpen) {
      this.addMessageToThread(newMessage);
    } else {
      await this.chat.createMessage(this.currentChannel()!.chanId, newMessage);
      this.textArea = '';
    }
  }

  /**
   * Creates a new message object with the provided chat ID and the current state of the message field.
   * Initializes the message with default values for reactions, thread information, and metadata.
   * The message includes the current text in the text area, the current timestamp, and the current user as the sender.
   *
   * @param {string} [chatId] - The ID of the chat to associate with the message.
   * @returns {Message} - A new message object with initialized fields.
   */
  private createMessage(chatId?: string): Message {
    return {
      text: this.textArea,
      chatId: chatId!,
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
  }

  private addMessageToThread(newMessage: Message) {
    const selectedMessage = this.selectedMessage();
    if (selectedMessage) {
      selectedMessage.answers.push(newMessage);
      this.textArea = '';
      this.chat.updateMessage(selectedMessage.chatId, selectedMessage);
    }
  }

  async sendDirectMessage() {
    this.stateControl.scrollToBottomGlobal = false;

    const collRef = await this.msg.newPrivateMessageChannel(
      this.userService.privatMessageReceiver!
    );
    if (!collRef) return;
    console.log(this.textArea, 'this.textArea');
    if (this.editMessage && this.textArea !== '' && this.editedMessageObject) {
      await this.msg.updateMessageInSubcollection(
        this.editedMessageObject.chatId,
        this.editedMessageObject.messageId!,
        this.textArea
      );
      this.resetMessageInput();
      return;
    }
    let newMessage = this.createMessage(collRef);

    if (this.selectedFile) {
      newMessage.storageData = await this.uploadDirectMessageImage(
        collRef,
        this.selectedFile
      );
      this.storageService.uploadMsg.set('');
    }

    await this.msg.addMessageToSubcollection(collRef, newMessage);
    this.resetMessageInput();
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
    this.storageService.uploadMsg.set('');
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
    this.stateControl.globalEditModul = false;
    this.stateControl.editDirectMessage = false;
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
